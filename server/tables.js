/**
 * Created by pmomot on 4/18/16.
 */
'use strict';

module.exports = function (config) {
    var SQLZ = require('sequelize'),
        sqlz = new SQLZ(config.dbConnection),
        User = require('./models/user')(sqlz, SQLZ),
        Unit = require('./models/unit')(sqlz, SQLZ),
        ProductGroup = require('./models/product-group')(sqlz, SQLZ),
        Product = require('./models/product')(sqlz, SQLZ, {
            Unit: Unit,
            ProductGroup: ProductGroup
        });

    Unit.hasMany(Product, {as: 'unit'});
    Product.belongsTo(Unit);

    return {
        User: User,
        Product: Product,
        Unit: Unit,
        ProductGroup: ProductGroup
    };
};
