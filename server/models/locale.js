/**
 * Created by pmomot on 4/21/16.
 */
'use strict';

module.exports = function (sqlz, SQLZ) {
    var Locale, columns, options;

    columns = {
        uuid: {
            type: SQLZ.UUID,
            defaultValue: SQLZ.UUIDV4,
            primaryKey: true
        },
        key: {
            type: SQLZ.STRING
        },
        description: {
            type: SQLZ.STRING
        },
        en: {
            type: SQLZ.STRING
        },
        uk: {
            type: SQLZ.STRING
        },
        ru: {
            type: SQLZ.STRING
        }
    };

    options = {
        freezeTableName: true
    };

    Locale = sqlz.define('Locales', columns, {
        instanceMethods: {},
        classMethods: {}
    }, options);

    return Locale;
};
