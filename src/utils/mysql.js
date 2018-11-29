const mysql = require('mysql');
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = require('../../config');

import { LIST_TYPE, CREATE_TYPE, UPDATE_TYPE, REMOVE_TYPE } from './mysql_types';

export const createConnection = () => {
  return mysql.createConnection({
    host     : DB_HOST,
    database : DB_NAME,
    user     : DB_USER,
    password : DB_PASSWORD
  });
};

export const buildListQuery = (model) => {
    return `SELECT * FROM ${model}s`;
};
