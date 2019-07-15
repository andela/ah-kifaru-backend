import authRoutes from './auth.route';
import userRoutes from './user.route';
import articleRoutes from './article.route';

export default app => {
  app.use('/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/auth', userRoutes);
  app.use('/api/v1/articles', articleRoutes);
};
