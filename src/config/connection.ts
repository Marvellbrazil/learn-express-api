import * as mariadb from 'mariadb';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number.parseInt(process.env.DB_PORT as string),
    connectionLimit: Number.parseInt(process.env.DB_CONN_LIMIT as string)
});

export default pool;