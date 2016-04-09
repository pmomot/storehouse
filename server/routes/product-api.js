/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

module.exports = function (Product) {

    /**
     * Get products list by query
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getProducts (req, res) {
        Product.findAll({
            attributes: ['uuid', 'name', 'description']
        })
            .then(function (products) {
                res.send(products);
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    /**
     * Delete product by id
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function deleteProduct (req, res) {

        Product.destroy({
            where: {
                uuid: req.params.id
            }
        })
            .then(function () {
                res.send({
                    message: 'Product deleted',
                    success: true
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
        getProducts: getProducts,
        deleteProduct: deleteProduct
    };
};
