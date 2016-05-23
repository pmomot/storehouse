/**
 * Created by pmomot on 4/14/16.
 */
'use strict';

module.exports = function (ProductGroup) {

    /**
     * Get all product groups list
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getProductGroups (req, res) {
        ProductGroup.findAll({
            attributes: ['uuid', 'name', 'description']
        })
            .then(function (ProductGroups) {
                res.send(ProductGroups);
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    /**
     * Delete product group by id
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function deleteProductGroup (req, res) {

        ProductGroup.destroy({
            where: {
                uuid: req.params.id
            }
        })
            .then(function () {
                res.send({
                    message: 'Product group deleted',
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
     * Create new product group
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function createProductGroup (req, res) {
        ProductGroup.create(req.body)
            .then(function () {
                res.send({
                    message: 'Product group created',
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
     * Update product group
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function updateProductGroup (req, res) {
        var u = req.body;

        ProductGroup.find({
            where: {
                uuid: req.body.uuid
            }
        })
            .then(function (group) {
                if (group) {
                    group.name = u.name;
                    group.description = u.description;
                    return group.save();
                } else {
                    throw new Error('Product group does not exists');
                }
            })
            .then(function () {
                res.send({
                    message: 'Product group updated',
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
        getProductGroups: getProductGroups,
        deleteProductGroup: deleteProductGroup,
        createProductGroup: createProductGroup,
        updateProductGroup: updateProductGroup
    };
};
