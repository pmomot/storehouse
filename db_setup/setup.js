/**
 * Created by pmomot on 4/1/16.
 */
'use strict';

var fs = require('fs');

module.exports = function (models) {
    var User = models.User,
        Locale = models.Locale,
        Product = models.Product,
        Unit = models.Unit,
        ProductGroup = models.ProductGroup,
        ProductGroupsConnection = models.ProductGroupsConnection,
        ProductStat = models.ProductStat;

    // TODO SH add localization to server-side errors

    User.sync({force: true})
        .then(function () {
            User.create({
                firstName: 'root',
                lastName: 'admin',
                email: 'root@admin.mail',
                password: 'rootpass'
            });

            return Locale.sync({force: true});
        })
        .then(function () {
            fs.readFile('db_setup/localization.json', function (err, json) {
                Locale.bulkCreate(JSON.parse(json));
            });

            return Unit.sync({force: true});
        })
        .then(function () {
            Unit.bulkCreate([{
                name: 'pcs',
                description: 'pieces'
            }, {
                name: 'kg',
                description: 'kilograms'
            }]);

            return ProductGroup.sync({force: true});
        })
        .then(function () {
            return Product.sync({force: true});
        })
        .then(function () {
            return ProductGroupsConnection.sync({force: true});
        })
        .then(function () {
            return ProductStat.sync({force: true});
        })
        .then(fillSomeData);

    /**
     * Fill some data into tables
     * */
    function fillSomeData () {
        var unit, productGroup, product;

        unit = Unit.build({
            name: 'bot',
            description: 'bottles'
        });

        productGroup = ProductGroup.build({
            name: 'Food',
            description: 'Everyone needs it'
        });

        product = Product.build({
            name: 'Water',
            description: 'Soo fresh and beautiful',
            amount: 20,
            minAmount: 5,
            price: 5.15,
            arrivedAt: Date.now(),
            expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
        });

        unit.save()
            .then(function () {
                return productGroup.save();
            })
            .then(function () {
                return product.save();
            })
            .then(function () {
                product.setUnit(unit);
                product.addProductGroup(productGroup);

                return product.save();
            });
    }
};
