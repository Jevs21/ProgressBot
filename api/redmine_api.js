let request = require('request');

exports.query = (options) => {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error || response.statusCode != 200) {
                reject(error);
            }
            resolve(body);
        });
    });
}


