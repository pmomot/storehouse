/**
 * Created by pmomot on 3/30/16.
 */
'use strict';
module.exports = function (User) {

    /**
     * Sign Up in service
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function signUp (req, res) {
        User
            .signUp(req.body)
            .then(function () {
                res.send({
                    success: true,
                    message: 'User has been created!'
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
     * Log into system
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function logIn (req, res) {
        User
            .logIn(req.body)
            .then(function (params) {
                res.send({
                    message: 'Successfully logged in',
                    success: true,
                    token: params.token,
                    user: params.user
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
     * Change user password
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function changePassword (req, res) {
        User
            .changePassword(req.body)
            .then(function () {
                res.send({
                    message: 'Password has been changed.',
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
     * send restore link for password
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function restorePassword (req, res) {
        User
            .restorePassword(req.body)
            .then(function () {
                res.send({
                    message: 'send restore link',
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
     * verifing token from restore link
     * @param {Object} req - request
     * @param {Object} res - response
    * */
    function verifyRestoreToken (req, res) {
        var config = require('../config'),
            jsonWebToken = require('jsonwebtoken'),
            secretKey = config.secretKey,
            token = req.query.token,
            diffTime = 0, // time between current and expire time token
            currentTime = new Date().getTime();

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
                                diffTime = currentTime - decoded.expireTime;
                                if (diffTime < 60000) { // for test setup 60 second delay 
                                    req.decoded = decoded;
                                    res.send({
                                        message: 'OK',
                                        success: true
                                    });
                                } else {
                                    throw new Error('duration of the restoration link passed');
                                }
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

    /**
     * Get user info
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getUser (req, res) {
        User.find({
            where: {
                uuid: req.decoded.uuid
            }
        })
            .then(function (user) {
                res.send(user.getInfo());
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    /**
     * Get users list by query
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getUsers (req, res) {
        // TODO SH decide how proceed with possible req.query
        // TODO SH exclude admins from list
        User.findAll({
            attributes: ['firstName', 'lastName', 'email']
        })
            .then(function (users) {
                res.send(users);
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    return {
        signUp: signUp,
        logIn: logIn,
        changePassword: changePassword,
        getUser: getUser,
        getUsers: getUsers,
        restorePassword: restorePassword,
        verifyRestoreToken: verifyRestoreToken
    };
};
