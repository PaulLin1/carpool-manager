import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AccountDashboard() {
    const router = useRouter()
    const [events, setEvents] = useState('');
    const username = router.query.user;   

    useEffect(() => {
        if (router.isReady) {
            const fetchData = async () => {
				const response = await fetch(`/api/get-user-events?user=${username}`);            
				const responseData = await response.json();
				const event = responseData.res.rows;
				event.sort((a, b) => new Date(a.date) - new Date(b.date));
				setEvents(event);
            };
            fetchData();
        }
    }, [router.isReady]);
    
    const goToEvent = (event) => {
        router.push(`/account/${username}/event/${event}`)
    };

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className='bg-white shadow-lg rounded-lg w-4/5 lg:w-3/5 p-8 -translate-y-6'>
				<h1 className='mb-6 text-center text-2xl font-bold text-gray-800'>hi {username}, here are your events</h1>
				<div className="h-[15rem] overflow-y-auto border-2 border-black">
					{events && events.length > 0 ? (
						<table className="table-auto w-full border-collapse">
							<thead className="sticky top-0 bg-blue-200 border-b-4 border-black">
								<tr>
									<th className="w-1/2 text-left py-2 text-gray-700 pl-2">Name</th>
									<th className="w-1/4 text-left py-2 text-gray-700">Date</th>
									<th className="w-1/4 text-left py-2 text-gray-700">Location</th>
								</tr>
							</thead>
							<tbody>
								{events.map((event, index) => (
									<tr onClick={() => goToEvent(event.id)} className="border-t border-gray-200 cursor-pointer hover:bg-gray-300">
										<td className="w-1/2 py-2 pl-2 text-gray-800">{event.name}</td>
										<td className="w-1/4 py-2 text-gray-800">{event.date}</td>
										<td className="w-1/4 py-2 text-gray-800">{event.destination}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="text-center text-gray-500 py-2">No events available.</div>
					)}
				</div>
				<div className='mt-6 text-center'>
					<Link href={`/account/${username}/create-event`} passHref className='text-blue-500 hover:underline text-lg font-semibold'>
						Create a new event
					</Link>
				</div>
			</div>
		</div>
	);
}
