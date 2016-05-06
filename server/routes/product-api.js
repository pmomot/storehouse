/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

module.exports = function (models) {
    var Product = models.Product;

    /**
     * Get products list by query
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getProducts (req, res) {
        Product.queryAll()
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

        if (req.body.amount <= 0) { // removed this from validation rules in Products class, because user can take all
            res.send({
                message: 'Validation error: Amount should be more than zero',
                success: false
            });
            return;
        }

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
                return Product.queryAll();
            })
            .then(function (products) {
                res.send({
                    message: 'Product deleted',
                    success: true,
                    products: products
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
     * Search product by text
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function searchProducts (req, res) {
        var text = req.query.text;

        if (!text) {
            text = '';
        }
        Product
            .searchForTake(text)
            .then(function (products) {
                res.send({
                    success: true,
                    products: products
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
     * Take product from storehouse
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function takeProduct (req, res) {
        if (typeof req.body.takeAmount !== 'number') {
            res.send({
                message: 'Cannot proceed with this amount',
                success: false
            });
            return;
        }

        Product
            .findAndTake(req.body)
            .then(function (product) {
                res.send({
                    success: true,
                    product: product
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
        deleteProduct: deleteProduct,
        searchProducts: searchProducts,
        takeProduct: takeProduct
    };
};
