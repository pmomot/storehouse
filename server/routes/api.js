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
        userApiCalls = require('./user-api')(User),
        productApiCalls = require('./product-api')(models.Product);
  
    api.get('/database-reset', function (req, res) { // TODO only for dev needs, remove this on prod
        require('../../db_setup/setup')(models);
        res.send('Database reset done');
    });

    // User section
    
    api.post('/user', userApiCalls.signUp);
    api.post('/user/log-in', userApiCalls.logIn);
    api.post('/user/forgot-password', userApiCalls.forgotPassword);
    api.get('/user/restore-password', userApiCalls.verifyRestorationToken);
    api.post('/user/restore-password', userApiCalls.restorePassword);

    api.use(verifyToken);
    
    // User section
    api.put('/user/change-pass', userApiCalls.changePassword);
    api.get('/users', userApiCalls.getUsers);
    api.get('/user', userApiCalls.getUser);

    // Product section
    api.get('/products', productApiCalls.getProducts);
    api.delete('/products/:id', productApiCalls.deleteProduct);
    
    // Units of measurement section

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
