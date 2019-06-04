/* eslint-disable no-nested-ternary */
import { config } from 'dotenv';

config();

const {
  NODE_ENV,
  DEV_PORT,
  TEST_PORT,
  PORT,
  MONGODB_URL_DEV,
  MONGODB_URL_TEST,
  MONGODB_URL,
} = process.env;

const serverPort = NODE_ENV === 'dev' ? DEV_PORT : NODE_ENV === 'test' ? TEST_PORT : PORT;

const dbUrl = NODE_ENV === 'dev' ? MONGODB_URL_DEV : NODE_ENV === 'test' ? MONGODB_URL_TEST : MONGODB_URL;

export { serverPort, dbUrl };
