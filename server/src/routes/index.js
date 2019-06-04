import userRouter from './user.route';

const setupRoutes = (app) => {
  app.use('/api/users', userRouter);
};

export default setupRoutes;
