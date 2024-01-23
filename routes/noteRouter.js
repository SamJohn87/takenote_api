const express = require('express');
const User = require('../models/user');
const authenticate = require('../authenticate');
const cors = require('./cors');

const noteRouter = express.Router();

noteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //get all notes - user needs to be authenticated
        User.findById(req.user._id)
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user.notes);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //add note - user needs to be authenticated
        User.findById(req.user._id)
            .then(user => {
                if (user) {
                    user.notes.push(req.body);
                    user.save()
                        .then(user => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user)
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`User not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /notes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete all notes - user must be authenticated
        User.findById(req.user._id)
            .then(user => {
                if (user) {
                    for (let i = (user.notes.length - 1); i >= 0; i--) {
                        user.notes.id(user.notes[i]._id).remove();
                    }
                    user.save()
                        .then(user => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user)
                        })
                        .catch(err => next(err));
                } else {
                    err = new Error(`User not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    });

noteRouter.route('/:noteId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //get specific note - user must be authenticated
        User.findById(req.user._id)
            .then(user => {
                if (user && user.notes.id(req.params.noteId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user.notes.id(req.params.noteId));
                } else if (!user) {
                    err = new Error(`User not found`);
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error(`Note not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { //CONTINUE HERE
        res.statusCode = 403;
        res.end(`POST operation not supported on /notes/${req.params.noteId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //update note - user must be authenticated
        User.findByIdAndUpdate(req.params.noteId, { $set: req.body }, { new: true })
            .then(note => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(note);
            })
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete note - user must be authenticated
        User.findByIdAndDelete(req.params.noteId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

module.exports = noteRouter;