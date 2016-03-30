/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

var config = require('../config'),
    secretKey = config.secretKey,
    jsonWebToken = require('jsonwebtoken');

/**
 * Generates token from user params
 * @param {Object} user - userInfo
 * */
function createToken (user) {
    return jsonWebToken.sign({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }, secretKey, {
        expiresInMinute: 1440
    });
}

module.exports = function (User) {

    /**
     * Sign Up in service
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function signUp (req, res) {
        var body = req.body;

        User.find({
            where: {
                email: body.email
            }
        })
            .then(function (data) {
                if (data) {
                    throw new Error('User with this email already exists');
                } else {
                    return User.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        password: body.password,
                        email: body.email
                    });
                }
            })
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
        var token;

        User.find({
            where: {
                email: req.body.email
            }
        })
            .then(function (user) {
                if (user) {
                    // TODO SH compare pass
                    //console.log(user.comparePassword(req.body.password));
                    console.log(user.comparePassword(123));


                    res.send({
                        success: false
                    });
                } else {
                    throw new Error('User does not exist');
                }
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });

        return;

        User.findOne({
            email: req.body.email
        })
            .select('password').exec()
            .then(function (user) {
                var validPassword;

                if (user) {
                    validPassword = user.comparePassword(req.body.password);

                    if (validPassword) {
                        token = createToken(user);

                        return User.findOne({
                            email: req.body.email
                        }).lean().exec();

                    } else {
                        throw new Error('Invalid Password');
                    }
                } else {
                    throw new Error('User does not exist');
                }
            })
            .then(function (u) {
                res.send({
                    message: 'Successfully logged in',
                    success: true,
                    token: token,
                    user: u
                });
            })

    }

    return {
        signUp: signUp,
        logIn: logIn
    };
};
