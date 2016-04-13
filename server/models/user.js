/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

var CryptoJS = require('crypto-js'),
    config = require('../config'),
    secretKey = config.secretKey,
    jsonWebToken = require('jsonwebtoken'),
    nodemailer = require('nodemailer');

/**
 * Generates token from user params
 * @param {Object} user - userInfo
 * */
function createToken (user) { // TODO SH check if key expires
    return jsonWebToken.sign({
        uuid: user.uuid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }, secretKey, {
        expiresInMinute: 1440
    });
}

/**
 * Generate token for user password restoration
 * @param {Object} user - user info
* */
function createRestoreToken (user) {
    return encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify({
        uuid: user.uuid,
        expiresAt: new Date(Date.now() + config.passwordRestorationTime).getTime()
    }), secretKey).toString());
}

module.exports = function (sqlz, SQLZ) {
    var User, columns, options;

    columns = {
        uuid: {
            type: SQLZ.UUID,
            defaultValue: SQLZ.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: SQLZ.STRING,
            field: 'first_name'
        },
        lastName: {
            type: SQLZ.STRING,
            field: 'last_name'
        },
        email: {
            type: SQLZ.STRING
        },
        passwordHash: {
            type: SQLZ.STRING,
            field: 'password_hash'
        },
        password: {
            type: SQLZ.VIRTUAL,
            set: function (val) {
                var hash;

                this.setDataValue('password', val);
                hash = CryptoJS.AES.encrypt(val, secretKey);
                this.setDataValue('passwordHash', hash.toString());
            },
            validate: {
                isLongEnough: function (val) {
                    if (val.length < 7) {
                        throw new Error('Please choose a longer password');
                    }
                }
            }
        }
    };

    options = {
        freezeTableName: true
    };

    /**
     * Sign Up in service
     * @param {Object} body - new user info
     * */
    function signUp (body) {
        var self = this; // eslint-disable-line no-invalid-this

        return self.find({
            where: {
                email: body.email
            }
        })
            .then(function (data) {
                if (data) {
                    throw new Error('User with this email already exists');
                } else {
                    return self.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        password: body.password,
                        email: body.email
                    });
                }
            });
    }

    /**
     * Log into system
     * @param {Object} body - user email and pass
     * */
    function logIn (body) {
        var self = this; // eslint-disable-line no-invalid-this

        return self.find({
            where: {
                email: body.email
            }
        })
            .then(function (user) {
                var validPassword;

                if (user) {
                    validPassword = user.comparePassword(body.password);

                    if (validPassword) {

                        return {
                            token: createToken(user.dataValues),
                            user: user.getInfo()
                        };
                    } else {
                        throw new Error('Invalid Password');
                    }
                } else {
                    throw new Error('User does not exist');
                }
            });
    }

    /**
     * Change user password
     * @param {Object} body - user email, old pass and new pass
     * */
    function changePassword (body) {
        var self = this; // eslint-disable-line no-invalid-this

        return self.find({
            where: {
                email: body.email
            }
        })
            .then(function (user) {
                var validPassword;

                if (user) {

                    validPassword = user.comparePassword(body.currentPass);

                    if (validPassword) {
                        user.password = body.newPass;
                        return user.save();
                    } else {
                        throw new Error('Invalid current password');
                    }
                } else {
                    throw new Error('User does not exist');
                }
            });
    }

    /**
     * Send password restoration link via email
     * @param {Object} body - request body with user email
     * @param {String} hostUrl - base url to server
     * */
    function forgotPassword (body, hostUrl) {
        var self = this, // eslint-disable-line no-invalid-this
            transporter, mailOptions, html;

        return self.find({
            where: {
                email: body.email
            }
        })
            .then(function (data) {
                if (data) {
                    transporter = nodemailer.createTransport(config.transporterNodemail);

                    html = 'Hi! To restore password, please click <a href="';
                    html += hostUrl + '/api/user/restore-password?token=' + createRestoreToken(data) + '"';
                    html += '>this link</a>';

                    mailOptions = {
                        from: '"foodbox&storehouse"<storehousefoodbox@gmail.com>',
                        to: '"' + data.email + '"',
                        subject: 'Store House restore password',
                        html: html
                    };

                    return transporter.sendMail(mailOptions, function () {});
                } else {
                    throw new Error('Account with this mail does not exist');
                }
            });
    }

    /**
     * Verifying token from restore link
     * @param {String} token - encrypted token with user id and expiresAt time
     * */
    function verifyRestorationToken (token) {
        var decrypted = CryptoJS.AES.decrypt(decodeURIComponent(token), secretKey).toString(CryptoJS.enc.Utf8);

        decrypted = JSON.parse(decrypted);

        return User.find({
            where: {
                uuid: decrypted.uuid
            }
        })
            .then(function (user) {
                if (user) {
                    if (decrypted.expiresAt - Date.now() >= 0) {
                        return 'Everything ok!';
                    } else {
                        throw new Error('Password restoration link has been expired');
                    }
                } else {
                    throw new Error('User does not exist');
                }
            });
    }

    /**
     * Create new (restore) password
     * */
    function restorePassword () {
        // TODO SH to be developed
    }

    User = sqlz.define('users', columns, {
        instanceMethods: {
            comparePassword: function (password) {
                return CryptoJS.AES.decrypt(this.passwordHash, secretKey).toString(CryptoJS.enc.Utf8) === password;
            },
            getInfo: function () {
                return {
                    fullName: [this.firstName, this.lastName].join(' '),
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email
                };
            }
        },
        classMethods: {
            signUp: signUp,
            logIn: logIn,
            changePassword: changePassword,
            forgotPassword: forgotPassword,
            verifyRestorationToken: verifyRestorationToken,
            restorePassword: restorePassword
        }
    }, options);

    return User;
};
