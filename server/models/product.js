/**
 * Created by pmomot on 4/1/16.
 */
'use strict';

module.exports = function (sqlz, SQLZ, relations) {
    var Product, columns, options,
        Unit = relations.Unit,
        ProductGroup = relations.ProductGroup;

    // TODO SH add validation rules
    // TODO SH do same relation work with groups

    columns = {
        uuid: {
            type: SQLZ.UUID,
            defaultValue: SQLZ.UUIDV4,
            primaryKey: true
        },
        name: {
            type: SQLZ.STRING
        },
        description: {
            type: SQLZ.STRING
        },
        amount: {
            type: SQLZ.INTEGER,
            validate: {
                moreThanZero: vMoreThanZero
            }
        },
        minAmount: {
            type: SQLZ.INTEGER,
            field: 'min_amount',
            validate: {
                moreThanZero: vMoreThanZero
            }
        },
        barCode: {
            type: SQLZ.INTEGER,
            field: 'bar_code'
        },
        arrivedAt: {
            type: SQLZ.DATE,
            field: 'arrived_at'
        },
        expiresAt: { // TODO SH maybe store only date, not time
            type: SQLZ.DATE,
            field: 'expires_at'
        }
    };

    options = {
        freezeTableName: true
    };

    // validation ---------------------

    /**
     * Validation for numbers to be > 0
     * @param {Number} val - new value
     * */
    function vMoreThanZero (val) {
        val = Number(val);

        if (isNaN(val)) {
            throw new Error('Amount must be number');
        } else if (val <= 0) {
            throw new Error('Amount should be more than zero');
        }
    }

    /**
     * Validation for not empty values
     * @param {String} val - new value
     * */
    function vNotEmpty (val) {
        if (String(val).trim().length === 0) {
            throw new Error('Value can not be empty');
        }
    }

    // class methods ------------------

    /**
     * Create new product
     * @param {Object} p - product from request body
     * */
    function createNew (p) {
        var product = Product.build(p);

        return product.save()
            .then(function () {
                return Unit.find({
                    where: {
                        uuid: p.unit.uuid
                    }
                });
            })
            .then(function (unit) {
                return product.setUnit(unit);
            });
    }

    /**
     * Update product
     * @param {Object} p - product from request body
     * */
    function updateExisting (p) {
        var pFound;

        return Product.find({
            where: {
                uuid: p.uuid
            }
        })
            .then(function (product) {
                if (product) {
                    product.name = p.name;
                    product.description = p.description;
                    product.amount = p.amount;
                    product.minAmount = p.minAmount;

                    return product.save();
                } else {
                    throw new Error('Product does not exists');
                }
            })
            .then(function (product) {
                pFound = product;

                return Unit.find({
                    where: {
                        uuid: p.unit.uuid
                    }
                });
            })
            .then(function (unit) {
                return pFound.setUnit(unit);
            });
    }

    Product = sqlz.define('products', columns, {
        instanceMethods: {},
        classMethods: {
            createNew: createNew,
            updateExisting: updateExisting
        }
    }, options);

    return Product;
};
