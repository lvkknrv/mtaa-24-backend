import pkg from 'pg';
const { Client } = pkg;

import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => {
        console.error('Error connecting to the database', err);
        process.exit(-1);
    });

export default client;
