const errs = require('restify-errors'),
    utils = require("../utils/utils"),
    requestsDB = require("../requests/requests"),
    jwt = require('jsonwebtoken');

module.exports = (server, database, secret) => {
    server.post("/api/signUp", getSignUp);
    server.post("/api/signIn", getSignIn);
    server.post("/api/authorization", getAuthorization);
    server.get("/api/getProjects", getProjectList);
    server.post("/api/getProject", getProject);
    server.post("/api/updateProfile", updateProfile);

    function getAuthorization(req, res, next) {
        const data = JSON.parse(req.body);
        console.log(data);
        try {
            const dataUser = jwt.verify(data.token, secret);
            const id_user = dataUser.id_user;
            console.log(dataUser);
            requestsDB.getProfile(database, id_user, next)
                .then((data) => {
                    res.send(data[0]);
                })
                .catch(() => {
                    res.send("err");
                });
        } catch (e) {
            console.log(e);
            return next(new errs.UnauthorizedError("token expired"));
        }
    }

    function getProject(req, res, next) {
        const data = JSON.parse(req.body);
        requestsDB.getProject(database, data, next)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }

    function getProjectList(req, res, next) {
        requestsDB.getProjects(database, next)
            .then((data) => {
                res.send(data);
            })
            .catch(() => {
                res.send("err");
            });
    }

    function getSignUp(req, res, next) {
        const data = JSON.parse(req.body);
        if (!utils.isset(data.email, data.password)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        requestsDB.addUser(database, data, next)
            .then(() => {
                res.send("success");
            })
            .catch(() => {
                res.send("email is already exist");
            });
    }

    function getSignIn(req, res, next) {
        const data = JSON.parse(req.body);
        if (!utils.isset(data.email, data.password)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        requestsDB.checkUser(database, data, next)
            .then((dataUser) => {
                const newDataUser = {
                    id_user: dataUser[0].id_user,
                    id_role: dataUser[0].id_role
                };
                let token = jwt.sign(newDataUser, secret, {
                    expiresIn: '5m'
                });
                console.log(jwt.decode(token));
                let {exp, id_user, id_role} = jwt.decode(token);
                res.send({exp, token})
            })
            .catch(() => {
                return next(new errs.InvalidArgumentError("Unknown user"));
            });
    }

    function updateProfile(req, res, next) {
        const data = JSON.parse(req.body);
        if (!utils.isset(data)) {
            return next(new errs.InvalidArgumentError("Not enough body data"));
        }
        requestsDB.updateProfile(database, data)
            .then(() => {
                res.send("success");
            })
            .catch(() => {
                return next(new errs.InvalidArgumentError("Request database error"));
            });
    }
};
