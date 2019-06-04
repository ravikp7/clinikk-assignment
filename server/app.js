import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import setupRoutes from './src/routes';
import { dbUrl, serverPort } from './src/config';
import { connectDb, disconnectDb } from './src/config/db';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

setupRoutes(app);

const startServer = async () => {
  try {
    await connectDb(dbUrl);
    const server = app.listen(serverPort, () => {});

    process.on('SIGTERM', () => {
      server.close(() => {
        disconnectDb();
      });
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

module.exports = app;
