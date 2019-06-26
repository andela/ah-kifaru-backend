
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Create global app object

const app = express();


app.use(cors());

// Normal express config defaults
// app.use(morgan)(dev);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.route('/*').all((req, res) => res.status(404).json({
    status: 404,
    error: '404 Route not found'
  }));
// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + server.address().port);
});
