import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
    const name = request.query.name;
    const date = request.query.date;
    const location = request.query.location;
    const event_owner = request.query.event_owner;

    if (name === '' || date === '' || location === '') {
        return response.status(400).json({ message: 'Please complete all forms' });
    }

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomChar = () => characters.charAt(Math.floor(Math.random() * characters.length));
    const randomNumber = () => Math.floor(Math.random() * 900000) + 100000;

    const id = randomChar() + randomChar() + randomNumber().toString();


    const res = await sql`INSERT INTO events (id, name, date, destination, event_owner) VALUES (${id}, ${name}, ${date}, ${location}, ${event_owner});`;

    return response.status(200).json({ res });
}