import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', (req, res) => {
  res.status(200).json({
    message: `Welcome to the Kifaru backend page`
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
