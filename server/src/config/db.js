import { connect, connection } from 'mongoose';

const connectDb = (url, opts = {}) => connect(
  url,
  {
    ...opts,
    useCreateIndex: true,
    useNewUrlParser: true,
  },
);

const disconnectDb = () => connection.close();

export { connectDb, disconnectDb };
