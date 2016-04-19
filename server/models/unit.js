/**
 * Created by pmomot on 4/13/16.
 */
'use strict';

module.exports = function (sqlz, SQLZ) {
    var Unit, columns, options;

    columns = {
        uuid: {
            type: SQLZ.UUID,
            defaultValue: SQLZ.UUIDV4,
            primaryKey: true
        },
        name: {
            type: SQLZ.STRING
        },
        description: {
            type: SQLZ.STRING
        }
    };

    options = {
        freezeTableName: true
    };

    Unit = sqlz.define('Units', columns, {
        instanceMethods: {},
        classMethods: {}
    }, options);

    return Unit;
};
