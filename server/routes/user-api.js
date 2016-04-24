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
     * Send password restoration link via email
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function forgotPassword (req, res) {
        User
            .forgotPassword(req.body, req.protocol + '://' + req.get('host'))
            .then(function () {
                res.send({
                    message: 'Restoration link has been sent',
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
     * Verifying token from restore link
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function verifyRestorationToken (req, res) {
        var token = req.query.token,
            path = require('path');
           
        if (token) {
            User.verifyRestorationToken(token)
                .then(function () {
                    res.sendFile(path.join(__dirname, '../../public', '/static-pages/restorePasswordView.html'));
                })
                .catch(function (error) {
                    res.send({
                        success: false,
                        message: error.message
                    });
                });
        } else {
            res.send({
                success: false,
                message: 'No token provided'
            });
        }
    }

    /**
     * Set new password for user
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function restorePassword (req, res) {
        // TODO SH dev this functionality
        
        var newPass = req.headers.data,
            token = req.headers.token;
        
        User.restorePassword(newPass, token)
        res.send({
            message: 'Password has been restored',
            success: true
        });
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
        forgotPassword: forgotPassword,
        verifyRestorationToken: verifyRestorationToken,
        restorePassword: restorePassword,
        getUser: getUser,
        getUsers: getUsers
    };
};
