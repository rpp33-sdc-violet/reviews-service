// process.env.NEW_RELIC_ENABLED ? require('newrelic') : null; <-- another way to turn New Relic ON/OFF
require('newrelic');

const app = require('./app');
const port = 8080;

app.listen(port, () => {
  console.log(`Reviews Server: Listening on port ${port}`);
});
