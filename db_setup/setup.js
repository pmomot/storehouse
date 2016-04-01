/**
 * Created by pmomot on 4/1/16.
 */
'use strict';

module.exports = function (models) {
    var User = models.User,
        Product = models.Product;

    User.sync({force: true})
        .then(function () {
            return User.create({
                firstName: 'root',
                lastName: 'admin',
                email: 'root@admin.mail',
                password: 'rootpass'
            });
        });

    Product.sync({force: true})
        .then(function () {
            return Product.create({
                name: 'Water',
                description: 'Soo fresh and beautiful',
                amount: 20,
                minAmount: 5,
                dateArrived: Date.now()
            });
        });
};