let mysql = require('mysql');

module.exports = {
    name: 'order task',
    version: '0.0.1',
    port: 3001,
    db: {
        get: mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'qwerty123',
            database : 'site'
        })
    },
    "jwt": {
        "secret": "&@$!changeme!$@&"
    }
};
