import authRoutes from './auth.route';
import userRoutes from './user.route';
import articleRoutes from './article.route';
import ratingRoutes from './rating.route';
import searchRoute from './search.route';
import noitificationsRoute from './notification.route';

export default app => {
  app.use('/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/auth', userRoutes);
  app.use('/api/v1/articles', articleRoutes);
  app.use('/api/v1/articles', ratingRoutes);
  app.use('/api/v1', searchRoute);
  app.use('/api/v1/notifications', noitificationsRoute);
};
