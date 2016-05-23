/**
 * Created by pmomot on 4/14/16.
 */
'use strict';

module.exports = function (sqlz, SQLZ) {
    var ProductGroup, columns, options;

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

    ProductGroup = sqlz.define('ProductGroups', columns, {
        instanceMethods: {},
        classMethods: {}
    }, options);

    return ProductGroup;
};
