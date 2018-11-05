const config = require("./config"),
    restify = require("restify"),
    plugins = restify.plugins,
    rjwt = require('restify-jwt-community');

const server = restify.createServer({
    name: config.name,
    version: config.version
});

let database = config.db.get;

server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
server.use(plugins.authorizationParser());
server.use(plugins.multipartBodyParser());

server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
});

server.on("restifyError", (req, res, err, callback) => { // Обработка ошибок сервера
    return callback();
});

server.listen(config.port, () => { // Подключаемся к серверу
    console.log(`Server is listening on port ${config.port}`);
    require("./routes/routes")(server, database, config.jwt.secret);
});