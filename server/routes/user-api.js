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
     * function for send error message on error view
     * @param {Object} res
     * @param {String} message
     * */
    function errorMethod(res, message) {
        var path = require('path');
           // ejs = require('ejs');
       /* app.set('view engine', 'jade');
        app.get(path.join(__dirname, '../../public', '/static-pages/errorView.html'), function (req, res) {
            res.render('index', { title: 'Hey', message: 'Hello there!'});
        });*/


        res.sendFile(path.join(__dirname, '../../public', '/static-pages/errorView.html'));
        //res.send({'mess':message});
       // res.setHeader("Access-Control-Allow-Headers", "x-access-token, mytoken");
        res.cookie('err',message)
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
                errorMethod(res,JSON.stringify(error.message))

            });
    }
    
    /**
     * Verifying token from restore link
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function verifyRestorationToken (req, res) {
        //console.log(req)
        var token = req.query.token,
            path = require('path');

        if (token) {
            try {
                User.verifyRestorationToken(token)
                    .then(function () {
                        res.sendFile(path.join(__dirname, '../../public', '/static-pages/restorePasswordView.html'));
                    })
                    .catch(function (error) {
                         errorMethod(res, JSON.stringify(error.message))
                    });
            }
            catch (err) {
                console.log(err)
                errorMethod(res, JSON.stringify({'err':'wrong token'}))
            }

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
