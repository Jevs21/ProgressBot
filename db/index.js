const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('database.db');
exports.dbName = 'database.db'

/**
 * @param  dbName, Name of the database to connect to
 */
exports.connect = (dbName) => {
    db.close();
    db = new sqlite3.Database(dbName)
    this.dbName = dbName
}

/**
 * Runs an SQL query on the database, and doesn't return any result from query.
 * @param  sql, SQL for query to execute
 * @return Promise 
 *
 */
exports.run = (sql) => {
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

/**
 * Runs an SQL query on the database, and returns the result from the query.
 * @param sql SQL query to execute
 * @return Promise 
 */
exports.runQuery = (sql) => {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(this)
            }
        });
    });
}

/**
 * Execute an SQL query on the database, and returns the first row.
 * @param  sql, SQL for query to execute
 * @return Result of query
 *
 */
exports.get = (sql) => {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

/**
 * Execute an SQL query on the database, and returns all rows.
 * @param  sql, SQL for query to execute
 * @return Result of query
 *
 */
exports.all = (sql) => {
    return new Promise ((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}


/**
 * Clears all data in the database
 */
exports.clear = () => {
    if (this.dbName === 'database.db') {
        console.warn("I don't think you really want to do that.")
        return;
    }

    return this.run(`
        DELETE FROM drink_preference;
        DELETE FROM shop_preference;
        DELETE FROM order;
        DELETE FROM user_order;
    `)
};

/**
 * 
 */
exports.checkUserExists = (id) => {
    return this.get(`
        SELECT *
        FROM user
        WHERE user_id='${id}'
    `);
}

/**
 * 
 */
exports.addNewUser = (id, name) => {
    return this.run(`
        INSERT INTO user (user_id, username)
        VALUES ('${id}', '${name}')
    `);
}

/**
 * 
 */
exports.getAllUsers = () => {
    return this.all(`
        SELECT *
        FROM user
    `);
}

/**
 * 
 */
exports.logWork = (id, text) => {
    return this.run(`
        INSERT INTO work_log (user_id, work_done, created_at)
        VALUES ('${id}', '${text}', date('now'))
    `);
}

/**
 * 
 */
exports.getUserUpdates = (username, limit) => {
    limit = limit ? (limit == 0 ? 1 : limit) : 50;

    return this.all(`
        SELECT *
        FROM work_log
        INNER JOIN user
        ON work_log.user_id = user.user_id
        WHERE user.username='${username}'
        ORDER BY work_log.created_at DESC
        LIMIT ${limit}
    `);
}

exports.getUserWorkYesterday = (id) => {
    return this.all(`
        SELECT *
        FROM work_log
        WHERE user_id='${id}' AND created_at=date('now', '-1 day')
    `)
}