import authRoutes from './auth.route';
import userRoutes from './user.route';
import articleRoutes from './article.route';
import searchRoute from './search.route';
import noitificationsRoute from './notification.route';
import tagRoutes from './tag.route';
import commentRoute from './comment.route';

export default app => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/articles', articleRoutes);
  app.use('/api/v1/search', searchRoute);
  app.use('/api/v1/notifications', noitificationsRoute);
  app.use('/api/v1/tags', tagRoutes);
  app.use('/api/v1', commentRoute);
};
