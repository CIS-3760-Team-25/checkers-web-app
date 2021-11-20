const { Pool } = require('pg');
const { parse } = require('pg-connection-string');

const config = parse(`${process.env.DATABASE_URL}?ssl=false`);
config.ssl = { rejectUnauthorized: false };

export default new Pool(config);
