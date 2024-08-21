import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function EventRegistrationDetailsForm() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [driver, setDriver] = useState('');    
    const [location, setLocation] = useState('');
    const [carCapacity, setCarCapacity] = useState('');

    const [eventId, setEventId] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDestination, setEventDestination] = useState('');

    const [message, setMessage] = useState('');

    const locationInputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            const fetchData = async () => {
                const pathname = router.query.id;   
                setEventId(pathname);         
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
            };
            fetchData();
        }
    }, [router.isReady]);

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
            loadScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`, initializeAutocomplete);
        } else {
            initializeAutocomplete();
        }
    }, []);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };
    const handleDriverChange = (event) => {
        setDriver(event.target.value);
        if (event.target.value === 'Yes') {
            setLocation('');
        } else if (event.target.value === 'No') {
            setCarCapacity('');
        }
    };
    const handleCarCapacityChange = (event) => {
        setCarCapacity(event.target.value);
    };

    const handleIdSubmit = (event) => {
        event.preventDefault();
        if (name === '' || phone === '' || driver === '' || (driver === 'No' && location === '') || (driver === 'Yes' && carCapacity === '')) {
            setMessage("Please fill in all fields");
            return;
        } else if (driver === 'Yes' && isNaN(carCapacity)) {
            setMessage("Car capacity must be a number");
            return;
        }
        const fetchData = async () => {
            await fetch(`/api/add-attendee?name=${name}&phone=${phone}&driver=${driver}&location=${location}&carCapacity=${carCapacity}&event=${eventId}`);
        };
        fetchData();
        router.push(`/registered`);
    };

    return (
        <div className='flex justify-center'>
            <div className="grid grid-cols-2 mt-20 w-[45rem] items-center">
                <div className='text-black text-2xl space-y-3'>
                    <h1 className='text-4xl'><b>Name</b></h1>
                    <h1 className='ml-8'>{eventName}</h1>
                    <h1 className='text-4xl'><b>Date</b></h1>
                    <h1 className='ml-8'>{eventDate}</h1>
                    <h1 className='text-4xl'><b>Destination</b></h1>
                    <h1 className='ml-8'>{eventDestination}</h1>
                </div>
                <form onSubmit={handleIdSubmit} className='space-y-5'>
                    <div className='space-y-3'>
                        <label htmlFor="name">Name</label><br />
                        <input
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                            className='text-black shadow appearance-none border rounded w-full py-1 pl-1 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent'
                        />
                    </div>
                    <div className='space-y-3'>
                        <label htmlFor="phone">Phone Number</label><br />
                        <input
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={handlePhoneChange}
                            className='text-black shadow appearance-none border rounded w-full py-1 pl-1 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent'
                        />
                    </div>
                    <div>
                        <label htmlFor="drive">Can you give rides or drive yourself?</label><br />
                        <div className='grid grid-cols-2 '>
                            <div className='space-x-2'>
                            <label>
                                Yes
                            </label>
                            <input
                                type="radio"
                                value="Yes"
                                checked={driver === 'Yes'}
                                onChange={handleDriverChange}
                            />
                            </div>
                            <div className='space-x-2'>
                                <label>
                                No
                                </label>
                                <input
                                    type="radio"
                                    value="No"
                                    checked={driver === 'No'}
                                    onChange={handleDriverChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`space-y-3 ${driver === 'Yes' ? 'opacity-20' : 'opacity-100'}`}>
                        <label htmlFor="location">Location</label><br />
                        <input
                            id="location"
                            name="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            ref={locationInputRef}
                            className='text-black shadow appearance-none border rounded w-full py-1 pl-1 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent'
                            disabled={driver === 'Yes'}
                        />
                    </div>
                    <div className={`space-y-3 ${driver === 'No' ? 'opacity-20' : 'opacity-100'}`}>
                        <label htmlFor="carCapacity">Car Capacity (Enter 0 if driving only yourself)</label><br />
                        <input
                            id="carCapacity"
                            name="carCapacity"
                            value={carCapacity}
                            onChange={handleCarCapacityChange}
                            className='text-black shadow appearance-none border rounded w-full py-1 pl-1 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent'
                            disabled={driver === 'No'}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                    <h1 className='min-w-[200px] min-h-[30px] text-red-600'>{message}</h1>
                </form>
            </div>
        </div>
    );
}
