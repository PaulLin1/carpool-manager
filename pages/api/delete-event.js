import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
    const id = request.query.id;

    const res_passengers = await sql`DELETE FROM passengers WHERE event = ${id};`;
    const res_drivers = await sql`DELETE FROM drivers WHERE event = ${id};`;

    const res_events = await sql`DELETE FROM events WHERE id = ${id};`;
    return response.status(200).json({ res_events });
}