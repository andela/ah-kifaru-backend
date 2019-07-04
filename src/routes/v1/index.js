import userRoutes from './user.route';

export default app => {
  app.use('/api/v1/user', userRoutes);
};
