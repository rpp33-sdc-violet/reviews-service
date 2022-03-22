const express = require('express');
const app = express();
const db = require('./database');

// Router
const router = require('./routes');

// Set up our routes
app.use('/reviews', router);

app.get('/test', (req, res) => {
  res.send('testing...testing...1, 2, 3');
});

module.exports = app;
