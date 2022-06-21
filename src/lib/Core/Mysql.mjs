import { createConnection } from 'mysql';
import config from '#rootJson/config' assert {type: "json"};

// @ts-ignore
export const Connection = new createConnection({
  host     : config.MYSQL_HOST,
  user     : config.MYSQL_USERNAME,
  password : config.MYSQL_PASSWORD,
  database : config.MYSQL_DATABASE
})