const express = require('express');
const { PORT } = require('./config');

const app = express();

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));


// http://expressjs.com/en/
// http://expressjs.com/en/guide/database-integration.html#mysql
// https://github.com/vpulim/node-soap

app.get('/', (req, res) => {
  return res.status(200);
});

app.post('/', (req, res) => {
  return res.status(200);
});
