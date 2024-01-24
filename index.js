const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');

//Routers
const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const noteRouter = require('./routes/noteRouter');
const goalRouter = require('./routes/goalRouter');

//MongoDB connection
const config = require('./config');
const mongoose = require('mongoose');
const url = config.mongoConnectionString;
const connect = async () => {
    await mongoose.connect(url);
};
connect().catch((err) => functions.logger.log(err));

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/notes', noteRouter);
app.use('/goals', goalRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// // error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


exports.takenote_api = app;