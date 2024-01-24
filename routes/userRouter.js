const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors')


const userRouter = express.Router();

userRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/auth/google', session: false }),
    function (req, res) {
        // Successful authentication, redirect home.
        const token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, status: 'You are successfully logged in!' });
    });

userRouter.post('/signup', cors.corsWithOptions, (req, res) => {
    User.register(
        new User({ username: req.body.username }),
        req.body.password,
        (err, user) => { //will contain user document create if successful
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                user.save()
                    .then(() => {
                        return passport.authenticate('local', { session: false })(req, res);
                    })
                    .then(() => {
                        res.status(200).json({ success: true, status: 'Registration Successful!' });
                    })
                    .catch(err => {
                        // Handle the error
                        console.error(err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
            }
        }
    );
});

userRouter.post('/login', cors.cors, passport.authenticate('local', { session: false }), (req, res) => { //using local strategy to authenticate user
    //response if login is successfull - passport handles errors
    //issue token to user
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' }); //add token in response to client
});

module.exports = userRouter;