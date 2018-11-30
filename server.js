import express from 'express';
import cors from 'cors';
import { PORT } from './config';

import {
  createConnection,
  buildGetListQuery,
  buildGetListSearchQuery,
  buildGetOneQuery,
  buildCreateQuery,
  buildUpdateQuery,
  buildDeleteQuery
} from './src/utils/mysql';
import models from './src/config/models';

const app = express();
import bodyParser from 'body-parser';

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));

app.get('/rest', (req, res) => {
  const search = req.query.search;

  let data = {};

  const connection = createConnection();

  connection.connect();

  let promises = [];
  models.forEach((model) => {
    async function getModelData() {
      return new Promise((resolve, reject) => {
        connection.query(search ? buildGetListSearchQuery(model, search) : buildGetListQuery(model), function (error, rows, fields) {

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

      return res.send({ data });
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post('/rest', (req, res) => {
  const model = req.body.model;
  const data = req.body.item;

  const connection = createConnection();

  connection.connect();

  async function createModel() {
    return new Promise((resolve, reject) => {
      connection.query(buildCreateQuery(model, data), function (error, rows, fields) {
        if (error) {
          reject(false);

        }

        resolve(true);
      });
    })
  }

  createModel()
    .then((data) => {
      connection.end();

      return res.send({ data });
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get('/rest/:model/:id', (req, res) => {
  const model = req.params.model;
  const id = req.params.id;

  const connection = createConnection();

  connection.connect();

  async function getModelData() {
    return new Promise((resolve, reject) => {
      connection.query(buildGetOneQuery(model, id), function (error, rows, fields) {
        if (error) {
          reject(false);
        }

        resolve(JSON.parse(JSON.stringify(rows[0])));
      });
    });
  }

  getModelData()
    .then((data) => {
      connection.end();

      return res.send({ data });
    })
    .catch((error) => {
      console.error(error);
    });
});

app.put('/rest', (req, res) => {
  const model = req.body.model;
  const data = req.body.item;

  const connection = createConnection();

  connection.connect();

  async function createModel() {
    return new Promise((resolve, reject) => {
      connection.query(buildUpdateQuery(model, data), function (error, rows, fields) {
        if (error) {
          reject(false);

        }

        resolve(true);
      });
    })
  }

  createModel()
    .then((data) => {
      connection.end();

      return res.send({ data });
    })
    .catch((error) => {
      console.error(error);
    })
});

app.delete('/rest/:model/:id', (req, res) => {
  const model = req.params.model;
  const id = req.params.id;

  const connection = createConnection();

  connection.connect();

  async function deleteModelItem() {
    return new Promise((resolve, reject) => {
      connection.query(buildDeleteQuery(model, id), function (error, rows, fields) {
        if (error) {
          reject(false);
        }

        resolve(true);
      });
    });
  }

  deleteModelItem()
    .then((data) => {
      connection.end();

      return res.send({ data });
    })
    .catch((error) => {
      console.error(error);
    });
});
