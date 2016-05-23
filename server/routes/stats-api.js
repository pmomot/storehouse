/**
 * Created by pmomot on 5/10/16.
 */
'use strict';

module.exports = function (models) {
    var Product = models.Product;

    /**
     * Get general statistics for storehouse
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getGeneral (req, res) {

        Product.findAll({
            where: {
                amount: {
                    $gt: 0
                },
                price: {
                    $gt: 0
                }
            }
        })
            .then(function (products) {
                var money;

                if (products.length) {
                    money = products.reduce(function (p1, p2) {
                        return p1.amount * p1.price + p2.amount * p2.price;
                    });
                } else {
                    money = 0;
                }

                res.send({
                    success: true,
                    money: money,
                    productsCount: products.length
                });
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    return {
        getGeneral: getGeneral
    };
};
