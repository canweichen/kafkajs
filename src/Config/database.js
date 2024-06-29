const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'root',
    user: 'root',
    database: 'tms',
    host: '127.0.0.1',
    port: '3306'
});
// const pool = mysql.createPool({
//     connectionLimit: 10,
//     password: 'D@M4s!3k',
//     user: 'tms_master_dev_user',
//     database: 'tms_dev_master',
//     host: 'dev.freightapp.com',
//     port: '3306'
// });
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'tms'
// });
//
// connection.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to the database!');
// });
//
// module.exports = connection;
module.exports = pool;