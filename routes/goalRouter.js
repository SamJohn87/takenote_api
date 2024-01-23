const express = require('express');
const Goal = require('../models/goal');
const authenticate = require('../authenticate');
const cors = require('./cors');