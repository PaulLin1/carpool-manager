import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
    const event = request.query.event
    let res = null;
    const name = request.query.name;
    const phone = request.query.phone;
    const driver = request.query.driver;
    if (driver === "Yes") {
        const carCapacity = request.query.carCapacity;
        res = await sql`INSERT INTO drivers (name, phone_number, event, car_capacity) VALUES (${name}, ${phone}, ${event}, ${carCapacity});`;
    }
    else {
        const location = request.query.location;
        res = await sql`INSERT INTO passengers (name, phone_number, event, current_location) VALUES (${name}, ${phone}, ${event}, ${location});`;
    }

    return response.status(200).json({ res });
}