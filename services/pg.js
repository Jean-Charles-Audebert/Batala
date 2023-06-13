import * as dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool();

pool.connect()
    .then(() => console.log('Connection accepted'))
    .catch((error) => console.log(error));

export default pool;