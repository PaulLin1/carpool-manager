import { sql } from '@vercel/postgres';
const bcrypt = require('bcrypt');

export default async function handler(request, response) {
    const username = request.query.username;
    const password = request.query.password;

    const res = await sql`SELECT * FROM users WHERE username = ${username};`;
    const userRes = res.rows[0];

    if (!userRes) {
        return response.status(400).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, userRes.password);
    if (!match) {
        return response.status(400).json({ message: 'Wrong password' });
    }

    return response.status(200).json({ res });
}