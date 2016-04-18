/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

module.exports = function (Product, Unit) {

    /**
     * Get products list by query
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getProducts (req, res) {
        Product.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'unitUuid']

            },
            include: {
                model: Unit,
                as: 'unit',
                attributes: ['uuid']
            }
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
     * Create new product
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function createProduct (req, res) {
        Product
            .createNew(req.body)
            .then(function () {
                res.send({
                    message: 'Product created',
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

    /**
     * Update product
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function updateProduct (req, res) {

        Product
            .updateExisting(req.body)
            .then(function () {
                res.send({
                    message: 'Product updated',
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
        createProduct: createProduct,
        updateProduct: updateProduct,
        deleteProduct: deleteProduct
    };
};
