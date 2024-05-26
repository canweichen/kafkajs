const connection = require('../Config/database');

exports.getTable = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql,  (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

exports.batchCreate = (users, callback) => {
    const sql = 'REPLACE INTO log_location SET ?';
    connection.query(sql, users, (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

exports.getTableValue = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql,  (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

exports.updateTableLines = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql,params,  (error, elements) => {
            if (error) {
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

// Create a new user
exports.createUser = (user, callback) => {
    const sql = 'INSERT INTO users SET ?';
    connection.query(sql, user, (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

exports.insertTableLine = (sql, params, callback) => {
    connection.query(sql, params, (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

// Get all users
exports.getAllUsers = (callback) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        callback(results);
    });
};

exports.getAllList = (sql, callback) => {
    connection.query(sql, (err, results) => {
        if (err) throw err;
        callback(results);
    });
};

// Get a single user by ID
exports.getUserById = (id, callback) => {
    const sql = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

// Update a user by ID
exports.updateUser = (id, user, callback) => {
    const sql = `UPDATE users SET ? WHERE id = ${id}`;
    connection.query(sql, user, (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

exports.updateTableLine = (sql, params, callback) => {
    connection.query(sql, params, (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

// Delete a user by ID
exports.deleteUser = (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        callback(result);
    });
};