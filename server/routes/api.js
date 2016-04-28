/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

var config = require('../config'),
    jsonWebToken = require('jsonwebtoken'),
    secretKey = config.secretKey;

module.exports = function (app, express, models) {
    var api = new express.Router(),
        User = models.User,
        userApiCalls = require('./user-api')(models),
        productApiCalls = require('./product-api')(models),
        unitApiCalls = require('./unit-api')(models.Unit),
        pGroupApiCalls = require('./product-group-api')(models.ProductGroup);

    api.get('/database-reset', function (req, res) { // TODO SH only for dev needs, remove this on prod
        require('../../db_setup/setup')(models);
        res.send('Database reset done');
    });

    api.get('/fill-table/locale', function (req, res) {
        require('../../db_setup/locale-fill')(models.Locale)
            .then(function () {
                res.send('Locale fill done');
            })
            .catch(function (err) {
                res.send(err.message);
            });
    });

    // User section
    api.post('/user', userApiCalls.signUp);
    api.post('/user/log-in', userApiCalls.logIn);
    api.get('/locale/:lang', userApiCalls.getLocale);

    api.use(verifyToken);

    // User section
    api.put('/user/change-pass', userApiCalls.changePassword);
    api.get('/users', userApiCalls.getUsers);
    api.get('/user', userApiCalls.getUser);
    api.put('/user/change-language', userApiCalls.changeLanguage);

    // Product section
    api.get('/products', productApiCalls.getProducts);
    api.post('/products', productApiCalls.createProduct);
    api.put('/products/:id', productApiCalls.updateProduct);
    api.delete('/products/:id', productApiCalls.deleteProduct);

    // Units section
    api.get('/units', unitApiCalls.getUnits);
    api.post('/units', unitApiCalls.createUnit);
    api.put('/units/:id', unitApiCalls.updateUnit);
    api.delete('/units/:id', unitApiCalls.deleteUnit);

    // Product groups section
    api.get('/product-groups', pGroupApiCalls.getProductGroups);
    api.post('/product-groups', pGroupApiCalls.createProductGroup);
    api.put('/product-groups/:id', pGroupApiCalls.updateProductGroup);
    api.delete('/product-groups/:id', pGroupApiCalls.deleteProductGroup);

    /**
     * Helper for verifying user token
     * */
    function verifyToken (req, res, next) {
        var token = req.body.token || req.headers['x-access-token'];

        if (token) {
            jsonWebToken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate'
                    });
                } else {
                    User.find({
                        where: {
                            uuid: decoded.uuid
                        }
                    })
                        .then(function (user) {
                            if (user) {
                                req.decoded = decoded;
                                next();
                            } else {
                                throw new Error('User does not exist');
                            }
                        })
                        .catch(function (error) {
                            res.status(403).send({
                                success: false,
                                message: error.message
                            });
                        });
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
    }

    return api;
};
