import { sql } from '@vercel/postgres';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

class KMeans {
    constructor(clusterCapacities, maxIterations = 100) {
        this.clusterCapacities = clusterCapacities;
        this.clusterIds = Object.keys(clusterCapacities);
        this.k = this.clusterIds.length;
        this.maxIterations = maxIterations;
        this.centroids = [];
        this.clusters = {};
    }

    fit(passengers) {
        const data = Object.values(passengers);
        this.passengerIds = Object.keys(passengers);
        
        this.centroids = this.initializeCentroids(data);

        for (let i = 0; i < this.maxIterations; i++) {
            this.clusters = this.assignClusters(passengers);

            const newCentroids = this.calculateCentroids(this.clusters, passengers);

            if (this.hasConverged(this.centroids, newCentroids)) {
                break;
            }

            this.centroids = newCentroids;
        }
    }

    initializeCentroids(data) {
        const centroids = [];
        const usedIndices = new Set();
        while (centroids.length < this.k) {
            const index = Math.floor(Math.random() * data.length);
            if (!usedIndices.has(index)) {
                centroids.push(data[index]);
                usedIndices.add(index);
            }
        }
        return centroids;
    }

    assignClusters(passengers) {
        const clusters = {};
        const clusterCapacitiesLeft = { ...this.clusterCapacities };

        this.clusterIds.forEach(id => {
            clusters[id] = [];
        });

        Object.entries(passengers).forEach(([id, point]) => {
            const closestCentroidId = this.getClosestCentroidId(point, clusterCapacitiesLeft);
            if (closestCentroidId !== -1) {
                clusters[closestCentroidId].push(id);
                clusterCapacitiesLeft[closestCentroidId]--;
            }
        });

        return clusters;
    }

    getClosestCentroidId(point, clusterSizesLeft) {
        let minDistance = Infinity;
        let closestId = -1;
        this.centroids.forEach((centroid, index) => {
            const clusterId = this.clusterIds[index];
            if (clusterSizesLeft[clusterId] > 0) {
                const distance = this.euclideanDistance(point, centroid);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestId = clusterId;
                }
            }
        });
        return closestId;
    }

    calculateCentroids(clusters, passengers) {
        return this.clusterIds.map(id => {
            const cluster = clusters[id].map(passengerId => passengers[passengerId]);
            if (cluster.length === 0) {
                return passengers[this.passengerIds[Math.floor(Math.random() * this.passengerIds.length)]];
            }
            const sum = cluster.reduce((acc, point) => {
                return acc.map((val, index) => val + point[index]);
            }, Array(cluster[0].length).fill(0));
            return sum.map(val => val / cluster.length);
        });
    }

    hasConverged(oldCentroids, newCentroids) {
        for (let i = 0; i < oldCentroids.length; i++) {
            if (oldCentroids[i] !== newCentroids[i]) {
                return false;
            }
        }
        return true;
    }

    euclideanDistance(point1, point2) {
        return Math.sqrt(point1.reduce((sum, val, index) => {
            return sum + Math.pow(val - point2[index], 2);
        }, 0));
    }

    predict(point) {
        return this.getClosestCentroidId(point, this.clusterCapacities);
    }

    getClusters() {
        return this.clusters;
    }
}


const getCoordinates = async (locationName, apiKey) => {
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
        address: locationName,
        key: apiKey
    };

    try {
        const response = await axios.get(baseUrl, { params });
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return [location.lat, location.lng]
        } else {
            throw new Error(`Geocode was not successful for the following reason: ${response.data.status}`);
        }
    } catch (error) {
        return { error: error.message };
    }
};

export default async function handler(request, response) {
    const id = request.query.id;

    let passengers = await sql`SELECT * FROM passengers WHERE event = ${id};`;
    passengers = passengers.rows;
    
    let drivers = await sql`SELECT * FROM drivers WHERE event = ${id};`;
    drivers = drivers.rows;

    if(passengers.length == 0 || drivers.length == 0) {
        return response.status(400).json();
    }

    const driversDict = drivers.reduce((acc, driver) => {
        acc[driver.id] = driver.car_capacity;
        return acc;
    }, {});

    const passengersDictPromises = passengers.map(async passenger => {
        const coordinates = await getCoordinates(passenger.current_location, apiKey);
        return [passenger.id, coordinates];
    });

    const passengersDictArray = await Promise.all(passengersDictPromises);
    const passengersDict = passengersDictArray.reduce((acc, [id, coordinates]) => {
        acc[id] = coordinates;
        return acc;
    }, {});

    const kmeans = new KMeans(driversDict);
    kmeans.fit(passengersDict);
    const clusters = kmeans.getClusters();

    for (const driver in clusters) {
        const passengers = clusters[driver];
        for (const passenger of passengers) {
            const res = await sql`UPDATE passengers SET driver = ${driver} WHERE id = ${passenger}`;
        }
    }

    return response.status(200).json();
}

