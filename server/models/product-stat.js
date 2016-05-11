/**
 * Created by pmomot on 5/11/16.
 */
'use strict';

module.exports = function (sqlz, SQLZ, relations) {
    var ProductStat, columns, options;

    columns = {
        id: {
            type: SQLZ.UUID,
            defaultValue: SQLZ.UUIDV4,
            primaryKey: true
        },
        action: {
            type: SQLZ.ENUM,
            values: ['created', 'removed', 'updated', 'took']
        },
        time: {
            type: SQLZ.DATE
        },
        message: {
            type: SQLZ.STRING,
            validate: {
                notEmpty: {
                    msg: 'Message can not be empty'
                }
            }
        }
    };

    options = {
        freezeTableName: true
    };

    /**
     * Add statistics line to table
     * @param {String} message - action message
     * @param {String} action - action type
     * */
    function addLine (message, action) {
        var statLine = ProductStat.build({
            action: action,
            time: Date.now(),
            message: message
        });

        return statLine.save();
    }

    ProductStat = sqlz.define('ProductStats', columns, {
        instanceMethods: {
        },
        classMethods: {
            addLine: addLine
        }
    }, options);

    return ProductStat;
};
