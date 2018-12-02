import soap from 'soap';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import {
  SOAP_HOST,
  SOAP_PORT,
  SOAP_WSDL
} from './config';
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

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const url = `${SOAP_HOST}:${SOAP_PORT}/xml?wsdl`;

app.get('/soap', (req, res) => {
  const search = req.query.search;

  const args = {
    search
  };
  soap.createClient(url, (error, client) => {
    if (error) {
      console.error(error);
    } else {
      client.getList(args, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          res.send(JSON.parse(response.content));
        }
      })
    }
  });
});

app.get('/soap/:model/:id', (req, res) => {
  const model = req.params.model;
  const id = req.params.id;

  const args = {
    model,
    id
  };
  soap.createClient(url, (error, client) => {
    if (error) {
      console.error(error);
    } else {
      client.getItem(args, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          res.send(JSON.parse(response.content));
        }
      })
    }
  });
});

app.post('/soap', (req, res) => {
  const model = req.body.model;
  const data = req.body.item;

  const args = {
    model,
    data
  };
  soap.createClient(url, (error, client) => {
    if (error) {
      console.error(error);
    } else {
      client.createItem(args, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          res.send(JSON.parse(response.content));
        }
      })
    }
  });
});

app.put('/soap', (req, res) => {
  const model = req.body.model;
  const data = req.body.item;

  const args = {
    model,
    data
  };
  soap.createClient(url, (error, client) => {
    if (error) {
      console.error(error);
    } else {
      client.updateItem(args, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          res.send(JSON.parse(response.content));
        }
      })
    }
  });
});

app.delete('/soap/:model/:id', (req, res) => {
  const model = req.params.model;
  const id = req.params.id;

  const args = {
    model,
    id
  };
  soap.createClient(url, (error, client) => {
    if (error) {
      console.error(error);
    } else {
      client.removeItem(args, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          res.send(JSON.parse(response.content));
        }
      })
    }
  });
});

const service = {
  SOAP_Service: {
    SOAP_Port: {
      getList: (args, callback) => {
        const { search } = args;

        let data = {};

        const connection = createConnection();

        connection.connect();

        let promises = [];
        models.forEach((model) => {
          async function getModelData() {
            return new Promise((resolve, reject) => {
              connection.query(search ? buildGetListSearchQuery(model, search) : buildGetListQuery(model),  (error, rows, fields) => {

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

            callback({
              content: JSON.stringify(data)
            });
          })
          .catch((error) => {
            console.error(error);
          });
      },

      getItem: (args, callback) => {
        const { model, id } = args;
        
        const connection = createConnection();

        connection.connect();

        async function getModelData() {
          return new Promise((resolve, reject) => {
            connection.query(buildGetOneQuery(model, id), (error, rows, fields) => {
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

            callback({
              content: JSON.stringify(data)
            });
          })
          .catch((error) => {
            console.error(error);
          });
      },

      createItem: (args, callback) => {
        const { model, data } = args;

        const connection = createConnection();

        connection.connect();

        async function createModel() {
          return new Promise((resolve, reject) => {
            connection.query(buildCreateQuery(model, data), (error, rows, fields) => {
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

            callback({
              content: JSON.stringify(data)
            });
          })
          .catch((error) => {
            console.error(error);
          });
      },

      updateItem: (args, callback) => {
        const { model, data } = args;

        const connection = createConnection();

        connection.connect();

        async function createModel() {
          return new Promise((resolve, reject) => {
            connection.query(buildUpdateQuery(model, data), (error, rows, fields) => {
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

            callback({
              content: JSON.stringify(data)
            });
          })
          .catch((error) => {
            console.error(error);
          })
      },

      removeItem: (args, callback) => {
        const { model, id } = args;

        const connection = createConnection();

        connection.connect();

        async function deleteModelItem() {
          return new Promise((resolve, reject) => {
            connection.query(buildDeleteQuery(model, id), (error, rows, fields) => {
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

            callback({
              content: JSON.stringify(data)
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }
};

// xml data is extracted from wsdl file created
const xml = fs.readFileSync(SOAP_WSDL, 'utf8');
//create an express server and pass it to a soap server
const server = app.listen(SOAP_PORT, () => console.log('Server Started!'));

soap.listen(server, '/xml', service, xml);

