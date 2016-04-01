/**
 * Created by pmomot on 4/1/16.
 */
'use strict';

module.exports = function (sqlz, SQLZ) {
    var Product, columns, options;

    /*

     amountType: {
         type: Sequelize.INTEGER,
         references: {
             model: AmountType,
             key: 'id',
             deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
     },

     */

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
        },
        amount: {
            type: SQLZ.INTEGER
        },
        minAmount: {
            type: SQLZ.INTEGER,
            field: 'main_amount'
        },
        barCode: {
            type: SQLZ.INTEGER,
            field: 'bar_code'
        },
        dateArrived: {
            type: SQLZ.DATE,
            field: 'date_arrived'
        }
    };

    options = {
        freezeTableName: true
    };

    Product = sqlz.define('products', columns, {
        instanceMethods: {},
        classMethods: {}
    }, options);

    return Product;
};
