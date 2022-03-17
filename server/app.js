const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.send('testing...testing...1, 2, 3');
});

module.exports = app;
