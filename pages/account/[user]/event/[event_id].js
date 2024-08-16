import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function EventPage() {
    const [eventId, setEventId] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDestination, setEventDestination] = useState('');

    const [passengers, setPassengers] = useState('');
    const [drivers, setDrivers] = useState('');

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const pathname = router.query.event_id;
            setEventId(pathname);
            const fetchData = async () => {
                const response = await fetch(`/api/get-event?id=${pathname}`);
                const responseData = await response.json();
                const event = responseData.res.rows[0];

                if (event !== undefined) {
                    setEventName(event.name);
                    setEventDate(event.date);
                    setEventDestination(event.destination);
                } else {
                    router.push('/404');
                }

                const response_passengers = await fetch(`/api/get-passengers?id=${pathname}`);
                const responseData_passengers = await response_passengers.json();
                const event_passengers = responseData_passengers.res.rows;
                setPassengers(event_passengers);

                const response_drivers = await fetch(`/api/get-drivers?id=${pathname}`);
                const responseData_drivers = await response_drivers.json();
                const event_drivers = responseData_drivers.res.rows;
                setDrivers(event_drivers);
            };
            fetchData();
        }
    }, [router.isReady]);

    const deleteEvent = () => {
        const fetchData = async () => {
            const owner_response = await fetch(`/api/get-event?id=${eventId}`);
            const responseData = await owner_response.json();
            const owner = responseData.res.rows[0].event_owner;

            await fetch(`/api/delete-event?id=${eventId}`);
            router.push(`/account/${owner}`);
        };
        fetchData();
    };

    const updateEvent = () => {
        const fetchData = async () => {
            const owner_response = await fetch(`/api/get-event?id=${eventId}`);
            const responseData = await owner_response.json();
            const owner = responseData.res.rows[0].name;

            router.push(`/account/${owner}/event/${eventId}/update`);
        };
        fetchData();
    };

    const createRides = () => {
        const fetchData = async () => {
            const owner_response = await fetch(`/api/get-event?id=${eventId}`);
            const responseData = await owner_response.json();
            const owner = responseData.res.rows[0].name;

            await fetch(`/api/create-rides?id=${eventId}`);
            router.push(`/account/${owner}/event/${eventId}/rides`);
        };
        fetchData();
    };

    return (
        <div className='flex justify-center'>
            <div className="bg-white grid grid-cols-7 mt-16 w-4/5 min-h-[30rem] border-y-8 border-white items-center">
                <div className='col-span-2  text-black text-2xl p-5 pl-5'>
                    <h1 className='text-2xl'><b>Link</b></h1>
                    <h1 className='ml-8 text-lg'>http://localhost:3000/{eventId}</h1>
                    <h1 className='text-2xl'><b>Name</b></h1>
                    <h1 className='ml-8 text-lg'>{eventName}</h1>
                    <h1 className='text-2xl'><b>Date</b></h1>
                    <h1 className='ml-8 text-lg'>{eventDate}</h1>
                    <h1 className='text-2xl'><b>Destination</b></h1>
                    <h1 className='ml-8 text-lg'>{eventDestination}</h1>
                </div>
                <div className='col-span-4'>
                    <h1 className='py-2 text-red-500 text-lg font-semibold'>Passengers</h1>
                    <div className="h-[15rem] overflow-y-auto border-2 border-black">
                        {passengers && passengers.length > 0 ? (
                            <table className="table-auto w-full">
                                <thead className="sticky top-0 bg-blue-200 border-b-4 border-black">
                                    <tr>
                                        <th className="w-1/5 text-left py-2 pl-2 text-gray-700">Name</th>
                                        <th className="w-1/5 text-left py-2 text-gray-700">Phone Number</th>
                                        <th className="w-3/5 text-left py-2 text-gray-700">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passengers.map((passenger, index) => (
                                        <tr key={index} className="border-t border-gray-200 cursor-pointer hover:bg-gray-300">
                                            <td className="w-1/5 py-2 pl-2 text-gray-800">{passenger.name}</td>
                                            <td className="w-1/5 py-2 text-gray-800">{passenger.phone_number}</td>
                                            <td className="w-3/5 py-2 text-gray-800">{passenger.current_location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-gray-500 py-2">No passengers available.</div>
                        )}
                    </div>
                    <h1 className='py-2 text-red-500 text-lg font-semibold'>Drivers</h1>
                    <div className="h-[15rem] overflow-y-auto border-2 border-black">
                        {drivers && drivers.length > 0 ? (
                            <table className="table-auto w-full">
                                <thead className="sticky top-0 bg-blue-200 border-b-4 border-black">
                                    <tr>
                                        <th className="w-1/5 text-left py-2 pl-2 text-gray-700">Name</th>
                                        <th className="w-1/5 text-left py-2 text-gray-700">Phone Number</th>
                                        <th className="w-3/5 text-left py-2 text-gray-700">Car Capacity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drivers.map((driver, index) => (
                                        <tr key={index} className="border-t border-gray-200 cursor-pointer hover:bg-gray-300">
                                            <td className="w-1/5 py-2 pl-2 text-gray-800">{driver.name}</td>
                                            <td className="w-1/5 py-2 text-gray-800">{driver.phone_number}</td>
                                            <td className="w-3/5 py-2 text-gray-800">{driver.car_capacity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-gray-500 py-2">No drivers available.</div>
                        )}
                    </div>
                </div>
                <div className='col-span-1 flex flex-col space-y-4 items-center'>
                    <button
                        onClick={deleteEvent}
                        className="w-3/5 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
                    >
                        Delete Event
                    </button>
                    <button
                        onClick={updateEvent}
                        className="w-3/5 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
                    >
                        Update Event
                    </button>
                    <button
                        onClick={createRides}
                        className="w-3/5 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
                    >
                        Create Rides
                    </button>
                </div>
            </div>
        </div>
    );
}
