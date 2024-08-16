import { sql } from '@vercel/postgres';
const bcrypt = require('bcrypt');
const saltRounds = 10;

export default async function handler(request, response) {
    const username = request.query.username;
    const password = request.query.password;

    const userCheckRes = await sql`SELECT * FROM users WHERE username = ${username};`;
    const userCheck = userCheckRes.rows[0];

    if (userCheck) {
        return response.status(400).json({ message: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)
    const res = await sql`INSERT INTO users (username, password) VALUES (${username}, ${passwordHash});`;

    return response.status(200).json({ res });
}