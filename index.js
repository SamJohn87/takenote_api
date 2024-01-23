const express = require('express');
const config = require('./config');
const logger = require('morgan');

const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then(() => console.log('Connected correctly to server'), err => console.log(err));

const app = express();
app.use(logger('dev'));
app.use(express.json());

// const userRouter = require('./routes/userRouter');
// app.use('/users', userRouter);

app.use((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('This is an Express Server');
});

exports.myExpressApp = app;