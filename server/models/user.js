/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

var CryptoJS = require('crypto-js'),
    config = require('../config'),
    secretKey = config.secretKey,
    jsonWebToken = require('jsonwebtoken'),

    nodemailer = require('nodemailer'),
    mailConfig = config.mail,
    smtpTransport = require('nodemailer-smtp-transport');
//chromelogger = require('chromelogger');//trying debuggs backend

/**
 * Generates token from user params
 * @param {Object} user - userInfo
 * */
function createToken(user) { // TODO SH check if key expires
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
    function signUp(body) {
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
    function logIn(body) {
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
    function changePassword(body) {
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
     * send to user email message 
     * @param {Object} body - user email
     * */
    function restorePassword(body) {
        var self = this; // eslint-disable-line no-invalid-this

        return self.find({
            where: {
                email: body.email
            }
        })
            .then(function (data) {
                if (data) {
                    // var transporter = nodemailer.createTransport(smtpTransport(mailConfig));
                    var transporter = nodemailer.createTransport('smtps://storehousefoodbox%40gmail.com:ael,jrc123@smtp.gmail.com');
                    // create reusable transporter object using the default SMTP transport

                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: '"foodbox&storehouse"<storehousefoodbox@gmail.com>', // sender address
                        to: '"' + data.email + '"', // list of receivers
                        subject: 'Hell', // Subject line
                        text: 'Hell world', // plaintext body
                        tml: '<b>Hell world</b>' // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                    });
                } else {
                    return;
                }
            });

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
            restorePassword: restorePassword
        }
    }, options);

    return User;
};
