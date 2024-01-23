const express = require('express');
const User = require('../models/user');
const authenticate = require('../authenticate');
const cors = require('./cors');

const noteRouter = express.Router();