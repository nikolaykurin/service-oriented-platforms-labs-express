import express from 'express';
import cors from 'cors';
import { PORT } from './config';

import { buildListQuery, createConnection } from './src/utils/mysql';
import models from './src/config/models';

const app = express();
app.use(cors());
app.options('*', cors());

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));

// Квитанция, накладная, документ, счет
// Receipt, invoice, document, bill

// https://github.com/vpulim/node-soap

app.get('/list', (req, res) => {
  let data = {};

  const connection = createConnection();

  connection.connect();

  let promises = [];
  models.forEach((model) => {
    async function getModelData() {
      return new Promise((resolve, reject) => {
        connection.query(buildListQuery(model), function (error, rows, fields) {

          console.log(rows);

          if (error) {
            reject(false);
          }

          data[model] = JSON.parse(JSON.stringify(rows));

          resolve(true);
        });
      })
    }

    promises.push(getModelData());
  });

  Promise.all(promises)
    .then(() => {

      connection.end();

      console.log(data);

      return res.send({ data });
    });
});

app.post('/create', (req, res) => {
  const model = req.model;
  return res.status(200);
});
