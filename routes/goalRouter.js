const express = require('express');
const User = require('../models/user');
const cors = require('./cors');
const authenticate = require('../authenticate');
const mongoose = require('mongoose');

const goalRouter = express.Router();

goalRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => { //get all user's goals - user needs to be authenticated
        User.findById(req.user._id)
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user.goals);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //add goal - user needs to be authenticated
        User.findById(req.user._id)
            .then(user => {
                if (user) {
                    const listTasks = req.body.tasks.map((task) => ({
                        title: task
                    }));
                    const newGoal = {
                        title: req.body.title,
                        tasks: listTasks
                    };
                    user.goals.push(newGoal);
                    user.save()
                        .then(user => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user)
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error('User not found');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /goals');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete all goals - user must be authenticated
        User.findById(req.user._id)
            .then(user => {
                if (user) {
                    user.goals = [];
                    user.save()
                        .then(user => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user)
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error('User not found');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

goalRouter.route('/:goalId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => { //get specific goal - user must be authenticated
        User.findById(req.user._id)
            .then(user => {
                if (user && user.goals.id(req.params.goalId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user.goals.id(req.params.goalId));
                } else if (!user) {
                    err = new Error('User not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Goal not found');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /goals/${req.params.goalId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //update goal - user must be authenticated
        User.findById(req.user._id)
            .then(user => {
                if (user && user.goals.id(req.params.goalId)) {
                    const goalToUpdate = user.goals.id(req.params.goalId);
                    goalToUpdate.title = req.body.title;
                    goalToUpdate.tasks = [];
                    const listTasks = req.body.tasks.map((task) => ({
                        title: task
                    }));
                    goalToUpdate.tasks = listTasks;
                    user.save()
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user.goals.id(req.params.goalId));
                        })
                        .catch(err => next(err));
                } else if (!user) {
                    err = new Error('User not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Goal not found');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete goal - user must be authenticated
        User.findById(req.user._id)
            .then(user => {
                if (user && user.goals.id(req.params.goalId)) {
                    user.goals = user.goals.filter((goal) => goal._id.toString() !== req.params.goalId);
                    user.save()
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user.goals);
                        })
                        .catch(err => next(err));
                } else if (!user) {
                    err = new Error('User not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Could not delete goal!');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

module.exports = goalRouter;