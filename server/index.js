const app = require('./app');
const port = 8080;

app.listen(port, () => {
  console.log(`Reviews Server: Listening on port ${port}`);
});
