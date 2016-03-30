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
        userApiCalls = require('./user-api')(User);

    // User section
    api.post('/user', userApiCalls.signUp);
    api.post('/user/log-in', userApiCalls.logIn);

    //api.use(verifyToken);

    //api.get('/user', userApiCalls.getUser);
    //api.post('/user/change-pass', userApiCalls.changePassword);
    //api.get('/users', userApiCalls.getUsers);

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
                    //User.findOne({_id: decoded.id}, function (error, user) {
                    //    if (user) {
                    //        req.decoded = decoded;
                    //        next();
                    //    } else {
                    //        res.status(403).send({
                    //            status: 403,
                    //            success: false,
                    //            message: 'User does not exist'
                    //        });
                    //    }
                    //});
                    console.log(decoded);

                    res.status(403).send({
                        status: 403,
                        success: false,
                        message: 'User does not exist'
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
