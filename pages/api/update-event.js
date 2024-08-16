import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
    const id = request.query.id;
    const name = request.query.name;
    const date = request.query.date;
    const location = request.query.location;

    if (name === '' || date === '' || location === '') {
        return response.status(400).json({ message: 'Please complete all forms' });
    }

    
    const res = await sql`UPDATE events SET name = ${name}, date = ${date}, destination = ${location} WHERE id = ${id};`;
    return response.status(200).json({ res });
}