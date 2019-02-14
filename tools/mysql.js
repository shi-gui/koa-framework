const mysql = require('mysql');
const config = require('../config/config');

const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
})


exports.query = function(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (errs, rows) => {
                    if (errs) {
                        reject(errs);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                })
            }
        })
    })
}

exports.shutdown = function(){
    pool.end();
}


exports.transaction = function(sqlArr) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                }
                for (let i = 0; i < sqlArr.length; i++) {
                    query(sqlArr[i]).catch((err) => {
                        connection.rollback(() => {
                            reject(err);
                        })
                    })
                }
                connection.commit(err => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err);
                        })
                    }
                });
                console.log('完成事务');
                resolve('完成事务');
                connection.release();
            })
        })
    })
}