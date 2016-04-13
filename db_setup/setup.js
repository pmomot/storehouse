/**
 * Created by pmomot on 4/1/16.
 */
'use strict';

module.exports = function (models) {
    var User = models.User,
        Product = models.Product,
        Unit = models.Unit;

    User.sync({force: true})
        .then(function () {
            return User.create({
                firstName: 'root',
                lastName: 'admin',
                email: 'root@admin.mail',
                password: 'rootpass'
            });
        });

    Unit.sync({force: true})
        .then(function () {
            return Unit.create({
                name: 'pcs',
                description: 'pieces'
            });
        });

    Product.sync({force: true})
        .then(function () {
            return Product.bulkCreate([{
                name: 'Water',
                description: 'Soo fresh and beautiful',
                amount: 20,
                minAmount: 5,
                arrivedAt: Date.now(),
                expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
            }, {
                name: 'Potatos',
                description: 'tasty',
                amount: 20,
                minAmount: 5,
                arrivedAt: Date.now(),
                expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
            }]);
        });
};
