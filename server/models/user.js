/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

var bcrypt = require('bcrypt-nodejs'),
    Promise = require('promise'),
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
                this.setDataValue('password', val);
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
     * Hook for updating passwordHash field, called every time on create and update User
     * @param {Object} user - instance
     * */
    function passHashHook (user) { // save passwordHash for user
        return new Promise(function (fulfill, reject) {
            bcrypt.hash(user.dataValues.password, null, null, function (err, hash) {
                if (err) {
                    reject(err);
                }
                user.setDataValue('passwordHash', hash);
                fulfill();
            });
        });
    }

    User = sqlz.define('users', columns, {
        instanceMethods: {
            comparePassword: function (password) {
                return bcrypt.compareSync(password, this.passwordHash);
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
            changePassword: changePassword
        }
    }, options);

    User.addHook('beforeCreate', passHashHook);
    User.addHook('beforeUpdate', passHashHook);

    return User;
};
