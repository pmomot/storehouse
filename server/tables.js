/**
 * Created by pmomot on 4/18/16.
 */
'use strict';

module.exports = function (config) {
    var SQLZ = require('sequelize'),
        sqlz = new SQLZ(config.dbConnection),
        Locale = require('./models/locale')(sqlz, SQLZ),
        User = require('./models/user')(sqlz, SQLZ, {
            Locale: Locale
        }),
        Unit = require('./models/unit')(sqlz, SQLZ),
        ProductGroup = require('./models/product-group')(sqlz, SQLZ),
        Product = require('./models/product')(sqlz, SQLZ, {
            Unit: Unit,
            ProductGroup: ProductGroup
        }),
        ProductGroupsConnection;

    Unit.hasMany(Product, {as: 'Unit'});
    Product.belongsTo(Unit);

    ProductGroupsConnection = sqlz.define('ProductGroupsConnection', {
        started: SQLZ.BOOLEAN
    });
    Product.belongsToMany(ProductGroup, {through: ProductGroupsConnection});
    ProductGroup.belongsToMany(Product, {through: ProductGroupsConnection});

    return {
        User: User,
        Product: Product,
        Unit: Unit,
        ProductGroup: ProductGroup,
        ProductGroupsConnection: ProductGroupsConnection,
        Locale: Locale
    };
};
