/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

var CryptoJS = require('crypto-js'),
    config = require('../config'),
    secretKey = config.secretKey,
    jsonWebToken = require('jsonwebtoken');

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

module.exports = function (sqlz, SQLZ, relations) {
    var User, columns, options,
        Locale = relations.Locale;

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
        },
        lang: {
            type: SQLZ.STRING,
            defaultValue: 'en'
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
        var self = this, // eslint-disable-line no-invalid-this
            token;

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
                        token = createToken(user.dataValues);

                        return user.getInfo();
                    } else {
                        throw new Error('Invalid Password');
                    }
                } else {
                    throw new Error('User does not exist');
                }
            })
            .then(function (userInfo) {
                return {
                    token: token,
                    user: userInfo
                };
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
     * Change user's language
     * @param {String} uuid - decoded user id
     * @param {Object} body - request body
     * */
    function changeLanguage (uuid, body) {
        var lang = body.language;

        return User.find({
            where: {
                uuid: uuid
            }
        })
            .then(function (user) {
                if (config.languages.indexOf(lang) === -1) { // no such language
                    lang = 'en';
                }
                user.lang = lang;

                return user.save();
            })
            .then(function (user) {

                return Locale.findAll({
                    attributes: ['key', [user.lang, 'value']]
                });
            });
    }

    User = sqlz.define('Users', columns, {
        instanceMethods: {
            comparePassword: function (password) {
                return CryptoJS.AES.decrypt(this.passwordHash, secretKey).toString(CryptoJS.enc.Utf8) === password;
            },
            getInfo: function () {
                var info = {
                    fullName: [this.firstName, this.lastName].join(' '),
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    lang: this.lang,
                    langs: config.languages
                };

                return Locale.findAll({
                    attributes: ['key', [this.lang, 'value']]
                }).then(function (locale) {
                    info.locale = locale;

                    return info;
                });
            }
        },
        classMethods: {
            signUp: signUp,
            logIn: logIn,
            changePassword: changePassword,
            changeLanguage: changeLanguage
        }
    }, options);

    return User;
};
