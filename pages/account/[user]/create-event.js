import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function CreateEventForm() {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [message, setMessage] = useState('');

    const locationInputRef = useRef(null);
    const router = useRouter();
    const username = router.query.user;

    useEffect(() => {
        const loadScript = (url, callback) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = callback;
            document.head.appendChild(script);
        };

        const initializeAutocomplete = () => {
            if (locationInputRef.current) {
                const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    setLocation(place.formatted_address);
                });
            }
        };

        if (!window.google) {
            loadScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`, initializeAutocomplete);
        } else {
            initializeAutocomplete();
        }
    }, []);

    const handleInputChangeName = (event) => {
        setName(event.target.value);
        setMessage("");
    };

    const handleInputChangeDate = (event) => {
        setDate(event.target.value);
        setMessage("");
    };

    const handleInputChangeLocation = (event) => {
        setLocation(event.target.value);
        setMessage("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const fetchData = async () => {
            const response = await fetch(`/api/add-event?name=${name}&date=${date}&location=${location}&event_owner=${username}`);         
            if (response.status === 400) {
                const errorResponse = await response.json();
                setMessage(errorResponse.message);
            } else {
                router.push(`/account/${username}`);
            }
        };
        fetchData();
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-center">Create Event</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleInputChangeName}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">Date</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={date}
                            onChange={handleInputChangeDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">Location</label>
                        <input
                            id="location"
                            name="location"
                            value={location}
                            onChange={handleInputChangeLocation}
                            ref={locationInputRef}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Create Event
                    </button>
                </form>
                <div className="text-center mt-4">
                    <a href={`/account/${username}`} className="text-blue-500 hover:underline text-lg font-semibold">Go Back</a>
                </div>
                <div className="mt-4 h-6">
                    {message && <h1 className="text-center text-red-500">{message}</h1>}
                </div>
            </div>
        </div>
    );
}
