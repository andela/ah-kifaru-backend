import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('method-override')());

app.use(express.static(`${__dirname}/public`));

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

require('../models/User');

app.use('/', (req, res) => {
  res.status(200).json({
    message: `Welcome to the Kifaru backend page`
  });
});

app.use(require('../routes'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;
