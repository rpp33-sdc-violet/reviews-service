const express = require('express');
const app = express();
const db = require('../database/index');
const path = require('path');

app.use(express.json());

// Router
const router = require('./routes');

// Set up our routes
app.use('/reviews', router);
app.use('/reviews_test', router);

app.get('/test', (req, res) => {
  res.send('testing...testing...1, 2, 3');
});

app.get('/loaderio-bb7ccf49217978042ae9eae0a98aa8af', (req, res) => {
  res.send('loaderio-bb7ccf49217978042ae9eae0a98aa8af');
});

module.exports = app;
