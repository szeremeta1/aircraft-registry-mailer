import { Pool } from 'pg'; // Assuming PostgreSQL is used, adjust as necessary
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});
export const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS aircraft (
            id SERIAL PRIMARY KEY,
            registration_number VARCHAR(50),
            owner_name VARCHAR(100),
            address VARCHAR(255),
            city VARCHAR(100),
            state VARCHAR(50),
            zip_code VARCHAR(20),
            certificate_expiration DATE,
            status VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
};
export const insertAircraft = async (aircraft) => {
    const query = `
        INSERT INTO aircraft (registration_number, owner_name, address, city, state, zip_code, certificate_expiration, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [
        aircraft.registrationNumber,
        aircraft.ownerName,
        aircraft.street,
        aircraft.city,
        aircraft.state,
        aircraft.zipCode,
        aircraft.certificateExpiration,
        aircraft.status,
    ];
    await pool.query(query, values);
};
export const getExpiredCertificates = async () => {
    const query = `
        SELECT * FROM aircraft WHERE certificate_expiration < CURRENT_DATE
    `;
    const result = await pool.query(query);
    return result.rows;
};
export const getPendingCancellations = async () => {
    const query = `
        SELECT * FROM aircraft WHERE status = 'Pending Cancellation'
    `;
    const result = await pool.query(query);
    return result.rows;
};
export const closeConnection = async () => {
    await pool.end();
};
