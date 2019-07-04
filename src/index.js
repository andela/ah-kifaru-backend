import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import authRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const swaggerdoc = yaml.load('./swagger.yaml');

app.use(cors());

app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerdoc));
app.use('/api/v1', authRoutes);
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Kifaru backend page'
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  process.stdout.write(`Listening on port ${server.address().port}`);
});

export default app;
