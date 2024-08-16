import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
    const id = request.query.id;

    const res = await sql`SELECT * FROM drivers WHERE event = ${id};`;
    return response.status(200).json({ res });
}