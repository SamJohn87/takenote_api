const express = require('express');
const noteRouter = express.Router();

noteRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the notes to you');
})
.post((req, res) => {
    res.end(`Will add the note: ${req.body.title} with description: ${req.body.content}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /notes');
})
.delete((req, res) => {
    res.end('Deleting all notes');
});

module.exports = noteRouter;