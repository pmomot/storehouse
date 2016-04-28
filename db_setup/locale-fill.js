/**
 * Created by pmomot on 4/28/16.
 */
'use strict';

var fs = require('fs'),
    Promise = require('promise');

module.exports = function (Locale) {

    return Locale.destroy({
        where: {}
    })
        .then(function () {
            return new Promise(function (fulfill, reject) {
                fs.readFile('db_setup/localization.json', function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        })
        .then(function (json) {
            return Locale.bulkCreate(JSON.parse(json));
        });
};
