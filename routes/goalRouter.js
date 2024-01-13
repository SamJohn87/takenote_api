const express = require('express');
const goalRouter = express.Router();
//test

goalRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the goals to you');
})
.post((req, res) => {
    res.end(`Will add the goal: ${req.body.title}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /goals');
})
.delete((req, res) => {
    res.end('Deleting all goals');
});

module.exports = goalRouter;