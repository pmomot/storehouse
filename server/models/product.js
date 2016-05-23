/**
 * Created by pmomot on 4/1/16.
 */
'use strict';

module.exports = function (sqlz, SQLZ, relations) {
    var Product, columns, options,
        Unit = relations.Unit,
        ProductGroup = relations.ProductGroup;

    // TODO SH add validation rules

    columns = {
        uuid: {
            type: SQLZ.UUID,
            defaultValue: SQLZ.UUIDV4,
            primaryKey: true
        },
        name: {
            type: SQLZ.STRING,
            validate: {
                notEmpty: {
                    msg: 'Name can not be empty'
                }
            }
        },
        description: {
            type: SQLZ.STRING,
            validate: {
                notEmpty: {
                    msg: 'Description can not be empty'
                }
            }
        },
        price: {
            type: SQLZ.FLOAT,
            validate: {
                isFloat: true,
                min: {
                    args: [0],
                    msg: 'Price should be more than zero or equal'
                }
            },
            defaultValue: 0
        },
        amount: {
            type: SQLZ.INTEGER,
            validate: {
                min: {
                    args: [0],
                    msg: 'Amount should be more than zero or equal'
                },
                isNumeric: {
                    msg: 'Amount must be number'
                }
            }
        },
        minAmount: {
            type: SQLZ.INTEGER,
            field: 'min_amount',
            validate: {
                min: {
                    args: [0],
                    msg: 'Min amount should be more than zero or equal'
                },
                isNumeric: {
                    msg: 'Min amount must be number'
                }
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
        expiresAt: {
            type: SQLZ.DATE,
            field: 'expires_at'
        }
    };

    options = {
        freezeTableName: true
    };

    // class methods ------------------

    /**
     * Create new product
     * @param {Object} p - product from request body
     * */
    function createNew (p) {
        var product = Product.build(p);

        return product.save()
            .then(function () {
                return product.resetUnit(p.unit.uuid);
            })
            .then(function () {
                return product.resetProductGroups(p.groups);
            });
    }

    /**
     * Update product
     * @param {Object} p - product from request body
     * */
    function updateExisting (p) {
        var savedProduct;

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
                    product.arrivedAt = p.arrivedAt;
                    product.expiresAt = p.expiresAt;
                    product.price = p.price;

                    return product.save();
                } else {
                    throw new Error('Product does not exists');
                }
            })
            .then(function (product) {
                savedProduct = product;

                return product.resetUnit(p.unit.uuid);
            })
            .then(function (product) {
                return product.resetProductGroups(p.groups);
            })
            .then(function () {
                return savedProduct;
            });
    }

    /**
     * Query all products with related fields
     * */
    function queryAll () {
        return Product.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'UnitUuid']
            },
            include: [
                {
                    model: Unit,
                    as: 'Unit',
                    attributes: ['uuid']
                },
                {
                    model: ProductGroup,
                    attributes: ['uuid', 'name']
                }
            ]
        });
    }

    /**
     * Get all products available to take by search query
     * @params {String} text - search query
     * */
    function searchForTake (text) {
        text = '%' + text + '%';

        return Product.findAll({
            where: {
                $or: {
                    name: {
                        $iLike: text
                    },
                    description: {
                        $iLike: text
                    }
                },
                amount: {
                    $gt: 0
                }
            },
            attributes: ['name', 'description', 'uuid', 'amount'],
            include: [
                {
                    model: Unit,
                    as: 'Unit',
                    attributes: ['name']
                }
            ]
        });
    }

    /**
     * Take some amount of product from storehouse
     * @params {Object} body - request body
     * */
    function findAndTake (body) {

        return Product.find({
            where: {
                uuid: body.uuid
            },
            attributes: ['name', 'description', 'uuid', 'amount'],
            include: [
                {
                    model: Unit,
                    as: 'Unit',
                    attributes: ['name']
                }
            ]
        })
            .then(function (p) {
                if (p.amount < body.takeAmount) {
                    throw new Error('Product amount is not enough');
                } else {
                    p.amount -= body.takeAmount;
                    // console.log(p.reason); // TODO SH save to statistix
                    return p.save();
                }
            });
    }

    // instance methods ---------------

    /**
     * Reset unit method
     * @param {String} uuid - Unit id
     * */
    function resetUnit (uuid) {
        return Unit.find({
            where: {
                uuid: uuid
            }
        }).then(function (unit) {
            return this.setUnit(unit);
        }.bind(this)); // eslint-disable-line no-invalid-this
    }

    /**
     * Reset product groups method
     * @param {Array} groups - new product groups to set
     * */
    function resetProductGroups (groups) {
        groups = groups.map(function (g) {
            return g.uuid;
        });

        return ProductGroup.findAll({
            where: {
                uuid: {
                    $in: groups
                }
            }
        }).then(function (g) {
            return this.setProductGroups(g);
        }.bind(this)); // eslint-disable-line no-invalid-this
    }

    Product = sqlz.define('Products', columns, {
        instanceMethods: {
            resetUnit: resetUnit,
            resetProductGroups: resetProductGroups
        },
        classMethods: {
            createNew: createNew,
            updateExisting: updateExisting,
            queryAll: queryAll,
            searchForTake: searchForTake,
            findAndTake: findAndTake
        }
    }, options);

    return Product;
};
