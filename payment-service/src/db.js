const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'host.docker.internal',
    database: process.env.POSTGRES_DB || 'mydatabase',
    password: process.env.POSTGRES_PASSWORD || '2372002',
    port: process.env.POSTGRES_PORT || 5433,
});

module.exports = pool;
