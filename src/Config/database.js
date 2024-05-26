const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'root',
    user: 'root',
    database: 'tms',
    host: '127.0.0.1',
    port: '3306'
});
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