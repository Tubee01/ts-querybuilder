import 'dotenv/config';
import postgres from 'postgres';
import { env } from 'process';

const sql = postgres({
  host: env.POSTGRES_HOST,
  port: Number(env.POSTGRES_PORT),
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  transform: postgres.camel,
  debug(connection, query, parameters) {
    console.log(query);
    parameters.length && console.log(parameters);
  },
});

export default sql;
