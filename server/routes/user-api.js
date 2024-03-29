/**
 * Created by pmomot on 3/30/16.
 */
'use strict';
var config = require('../config');

module.exports = function (models) {
    var User = models.User;

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
     * function for send error message on error view
     * @param {Object} res
     * @param {String} message
     * */
    function errorMethod (res, message) {
        var path = require('path');
        
        res.render(path.join(__dirname, '../../public', '/static-pages/index.jade'), {
            message: message.replace(/^[Error: ]+/ig, '')
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
     * Get localization info
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getLocale (req, res) {
        var lang = req.params['lang'];

        if (config.languages.indexOf(lang) === -1) { // no such language
            lang = 'en';
        }

        models.Locale
            .findAll({
                attributes: ['key', [lang, 'value']]
            })
            .then(function (locale) {
                res.send({
                    locale: locale,
                    langs: config.languages
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
                    success: true
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
            try {
                User.verifyRestorationToken(token)
                    .then(function () {
                        res.sendFile(path.join(__dirname, '../../public', '/static-pages/restorePasswordView.html'));
                    })
                    .catch(function (error) {
                        errorMethod(res, error.message);
                    });
            } catch (err) {
                errorMethod(res, 'Wrong token');
            }

        } else {
            errorMethod(res, 'No token provided');
        }
    }

    /**
     * Set new password for user
     * @param {Object} req - request
     * */
    function restorePassword (req) {
        var newPass = req.query.pass,
            token = req.query.token;

        User.restorePassword(newPass, token);
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
                return user.getInfo();
            })
            .then(function (userInfo) {
                res.send(userInfo);
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

    /**
     * Change user's language
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function changeLanguage (req, res) {

        User.changeLanguage(req.decoded.uuid, req.body)
            .then(function (locale) {
                res.send({
                    message: 'Language has been changed.',
                    success: true,
                    locale: locale
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
        signUp: signUp,
        logIn: logIn,
        getLocale: getLocale,
        changePassword: changePassword,
        forgotPassword: forgotPassword,
        verifyRestorationToken: verifyRestorationToken,
        restorePassword: restorePassword,
        getUser: getUser,
        getUsers: getUsers,
        changeLanguage: changeLanguage
    };
};
