const errs = require('restify-errors');

exports.addUser = function(database, data, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM user WHERE email = '${data.email}'`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length !== 0) {
                return reject(false);
            }
        });

        sql = `INSERT INTO user VALUES (null, '', '', 1, '', '${data.password}', '${data.email}', '')`;
        await database.query(sql, function (err) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(true);
        });
    });
};

exports.checkUser = function (database, data, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM user WHERE email = '${data.email}' AND password = '${data.password}'`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return reject(undefined);
            } else {
                return resolve(result);
            }
        })
    })
};

exports.getProfile = function (database, id_user, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM user WHERE id_user = ${id_user}`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return reject(undefined);
            } else {
                return resolve(result);
            }
        })
    })
};

exports.getProjects = function (database, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM project`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            return resolve(result);
        })
    })
};

exports.getProject = function (database, data, next) {
    return new Promise(async (resolve, reject) => {
        let sql = `SELECT * FROM project WHERE id_project = ${data.id}`;
        await database.query(sql, function (err, result) {
            if (err) {
                return next(new errs.BadGatewayError(err));
            }
            if (result.length === 0) {
                return reject(undefined);
            } else {
                return resolve(result[0]);
            }
        })
    })
};

exports.updateProfile = function (database, data) {
    return new Promise(async (resolve, reject) => {
        const sql = `UPDATE user SET 
                        first_name = '${data.first_name}', 
                        last_name = '${data.last_name}',
                        email = '${data.email}' 
                     WHERE id_user = '${data.id_user}'`;
        await database.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
};