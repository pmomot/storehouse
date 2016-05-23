/**
 * Created by pmomot on 5/11/16.
 */
'use strict';

module.exports = function (sqlz, SQLZ, relations) {
    var ProductStat, columns, options,
        User = relations.User;

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
     * @param {Object} params - info to create stat line
     *                 message - action message
     *                 action - action type
     *                 userId - user uuid
     *                 product - product
     * */
    function addLine (params) {
        var statLine = ProductStat.build({
            action: params.action,
            time: Date.now(),
            message: params.message
        });

        return setRelationFields(statLine, params);
    }

    /**
     * Set Product and User relations info
     * @param {Object} statLine - statistics instance
     * @param {Object} params - info to create stat line
     *                 message - action message
     *                 action - action type
     *                 userId - user uuid
     *                 product - product
     * */
    function setRelationFields (statLine, params) {

        return statLine.save()
            .then(function () {
                return statLine.setProduct(params.product);
            })
            .then(function () {

                return User.find({
                    where: {
                        uuid: params.userId
                    }
                });
            })
            .then(function (user) {
                return statLine.setUser(user);
            });
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
