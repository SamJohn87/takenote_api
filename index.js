const express = require('express');
const config = require('./config');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');

//Routers
const userRouter = require('./routes/userRouter');

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

exports.myExpressApp = app;