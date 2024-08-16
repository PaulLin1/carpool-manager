import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter()

    const handleInputChangeUsername = (event) => {
        setUsername(event.target.value);
        setMessage("");
    };
    const handleInputChangePassword = (event) => {
        setPassword(event.target.value);
        setMessage("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username === '' || password === '') {
            setMessage("Please fill out the form correctly and completely");
            return;
        }
        const fetchData = async () => {
            const response = await fetch(`/api/get-user?username=${username}&password=${password}`);         
            if (response.status === 400) {
                const errorResponse = await response.json();
                setMessage(errorResponse.message)
            }
            else {
                router.push(`/account/${username}`);
            }
        };
        fetchData();
    };

    return (
		<div className="flex flex-col justify-center items-center min-h-screen">
			<div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full -translate-y-11">
					<h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
							<input
									id="username"
									name="username"
									value={username}
									onChange={handleInputChangeUsername}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div className="mb-6">
							<label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
							<input
									id="password"
									name="password"
									type="password"
									value={password}
									onChange={handleInputChangePassword}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
						>
							Sign In
						</button>
					</form>
					<div className="text-center mt-4">
						<a href="/signup" className="text-blue-700 hover:underline">Sign up</a>
					</div>
					<div className="mt-4 h-6">
						{message && <h1 className="text-center text-red-500">{message}</h1>}
					</div>
			</div>
		</div>
    );
}
