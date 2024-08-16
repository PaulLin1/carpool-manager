import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
    const user = request.query.user;

    const res = await sql`SELECT * FROM events WHERE event_owner = ${user};`;
    return response.status(200).json({ res });
}