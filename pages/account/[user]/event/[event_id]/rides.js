import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'react-router-dom';

export default function EventPage() {
    const [eventId, setEventId] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDestination, setEventDestination] = useState('');

    const [passengers, setPassengers] = useState('');
    const [drivers, setDrivers] = useState('');

    const router = useRouter()

    useEffect(() => {
        if (router.isReady) {
            const pathname = router.query.event_id;   
            setEventId(pathname)   
            const fetchData = async () => {
      
                    const response = await fetch(`/api/get-event?id=${pathname}`);            
                    const responseData = await response.json();
                    const event = responseData.res.rows[0];

                    if (event !== undefined) {
                        setEventName(event.name);
                        setEventDate(event.date);
                        setEventDestination(event.destination);
                    }
                    else {
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

    return (
        <div className='flex justify-center'>
            <div className="bg-white mt-20 w-4/5 min-h-[30rem] items-center">
                {drivers && drivers.length > 0 ? (
                    <div>
                        {drivers.map((driver, index) => (
                            <div className="h-[12rem] overflow-y-auto border-2 border-black mb-5">
                                <h1 className='p-2 bg-blue-200 border-b-2 border-black'>Driver: {driver.name}</h1>
                                <table className="table-auto w-full">
                                    <tbody>
                                    {passengers.filter((passenger) => passenger.driver === driver.id).map((passenger, index) => (
                                            <tr className="border-t border-gray-200 cursor-pointer hover:bg-gray-100">
                                                <td className="w-2/5 py-2 pl-2 text-gray-800">{passenger.name}</td>
                                                <td className="w-1/5 py-2 text-gray-800">{passenger.phone_number}</td>
                                                <td className="w-2/5 py-2 text-gray-800">{passenger.current_location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>  
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-2">No events available.</div>
                )}
            </div>
        </div>
    );
}
