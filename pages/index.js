import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const [id, setId] = useState('');
    const [message, setMessage] = useState('');    
    const router = useRouter()

    const handleIdChange = (event) => {
      setId(event.target.value);
    };

    const handleIdSubmit = async (event) => {
        event.preventDefault();
        const fetchData = async () => {
            const response = await fetch(`/api/get-event?id=${id}`);            
            const responseData = await response.json();
            if (responseData.res.rows.length === 0) {
                setMessage("Please enter a valid event id");
                return;
            }
            router.push(`/${id}`);
        };
        fetchData();
    };

    return (
        <div>
            <h1 className="text-black text-7xl text-center mt-32 mb-16">enter your event's id</h1>
            <div className='flex justify-center items-center'>
                <form onSubmit={handleIdSubmit}>
                    <input
                        id="id"
                        name="id"
                        value={id}
                        onChange={handleIdChange}
                        className='text-black text-6xl text-center shadow appearance-none border rounded w-full py-3 px-4leading-tight focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent'
                    />
                </form>
            </div>
            <h1 className="text-red-600 text-xl text-center mt-7">{message}</h1>
        </div>
    );
}
