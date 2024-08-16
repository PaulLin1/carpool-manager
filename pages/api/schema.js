// CREATE TABLE IF NOT EXISTS users(
//     username TEXT PRIMARY KEY,
//     password TEXT NOT NULL
// )
// CREATE TABLE IF NOT EXISTS events(
//     id TEXT PRIMARY KEY,
//     name TEXT NOT NULL,
//     date INTEGER NOT NULL,
//     destination TEXT NOT NULL,
//     event_owner TEXT NOT NULL,
//     FOREIGN KEY (event_owner) REFERENCES users(username)            
// )
// CREATE TABLE IF NOT EXISTS drivers(
//     id SERIAL PRIMARY KEY,
//     name TEXT NOT NULL,
//     phone_number TEXT NOT NULL,
//     event TEXT,
//     car_capacity INT,
//     FOREIGN KEY (event) REFERENCES events(id)
// )
// CREATE TABLE IF NOT EXISTS passengers(
//     id SERIAL PRIMARY KEY,
//     name TEXT NOT NULL,
//     phone_number TEXT NOT NULL,
//     event TEXT,
//     driver INT,
//     current_location TEXT NOT NULL,
//     FOREIGN KEY (event) REFERENCES events(id),
//     FOREIGN KEY (driver) REFERENCES drivers(id)
// )
