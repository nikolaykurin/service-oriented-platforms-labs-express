const mysql = require('mysql');
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = require('../../config');

export const DELIMITER = ', ';
export const skipFields = [ 'id', 'timestamp' ];

export const createConnection = () => {
  return mysql.createConnection({
    host     : DB_HOST,
    database : DB_NAME,
    user     : DB_USER,
    password : DB_PASSWORD
  });
};

export const buildGetListQuery = (model) => {
    return `SELECT * FROM ${model}s`;
};

export const buildGetListSearchQuery = (model, search) => {
  return `SELECT * FROM ${model}s WHERE name LIKE '%${search}%'`;
};

export const buildGetOneQuery = (model, id) => {
  return `SELECT * FROM ${model}s WHERE id = ${id}`;
};

export const buildCreateQuery = (model, data) => {
  let fields = '';
  let values = '';

  for (let field in data) {
    fields += `\`${field}\`${DELIMITER}`;
    values += `'${data[field]}'${DELIMITER}`;
  }

  fields = fields.replace(/(^[,\s]+)|([,\s]+$)/g, '');
  values = values.replace(/(^[,\s]+)|([,\s]+$)/g, '');

  return `INSERT INTO ${model}s(${fields}) VALUES(${values})`;
};

export const buildUpdateQuery = (model, data) => {
  let set = '';

  for (let field in data) {
    if (skipFields.includes(field)) {
      continue;
    }

    set += `${field}='${data[field]}'${DELIMITER}`;
  }

  set = set.replace(/(^[,\s]+)|([,\s]+$)/g, '');

  return `UPDATE ${model}s SET ${set} WHERE id = ${data.id}`;
};

export const buildDeleteQuery = (model, id) => {
  return `DELETE FROM ${model}s where id = ${id}`;
};
