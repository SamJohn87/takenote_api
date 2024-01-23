const express = require('express');
const config = require('./config');
const logger = require('morgan');
const passport = require('passport');

//Routers
const userRouter = require('./routes/userRouter');
const noteRouter = require('./routes/noteRouter');
const goalRouter = require('./routes/goalRouter');

//MongoDB connection
const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then(() => console.log('Connected correctly to server'), err => console.log(err));

const app = express();
app.use(logger('dev'));
app.use(express.json());

app.use(passport.initialize());

app.use('/user', userRouter);
app.use('/notes', noteRouter);
app.use('/goals', goalRouter);

exports.myExpressApp = app;