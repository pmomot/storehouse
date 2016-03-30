/**
 * Created by petermomot on 3/30/16.
 */
'use strict';

var bcrypt = require('bcrypt-nodejs'),
    Promise = require('promise');

module.exports = function (sqlz, SQLZ) {
    var User, columns, options;
    // TODO SH add virtual field fullName

    columns = {
        uuid: {
            type: SQLZ.UUID,
            defaultValue: SQLZ.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: SQLZ.STRING
        },
        lastName: {
            type: SQLZ.STRING
        },
        email: {
            type: SQLZ.STRING
        },
        passwordHash: SQLZ.STRING,
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

    User = sqlz.define('users', columns, {
        instanceMethods: {
            comparePassword: function (password) {
                console.log(this.password, password);
                return bcrypt.compareSync(password, this.password);
            },
            getFullName: function () {
                return [this.firstName, this.lastName].join(' ');
            }
        }
    }, options);

    User.addHook('beforeCreate', function (user) { // hack to save passwordHash for user
        return new Promise(function (fulfill, reject) {
            bcrypt.hash(user.dataValues.password, null, null, function (err, hash) {
                if (err) {
                    reject(err);
                }
                user.setDataValue('passwordHash', hash);
                fulfill();
            });
        });
    });

    return User;

    //var User = sequelize.define('User', {

    //    {

    //        classMethods: {
    //            createSecure: function(email, password) {
    //                if(password.length < 6) {
    //                    throw new Error("Password too short");
    //                }
    //                return this.create({
    //                    email: email,
    //                    passwordDigest: password
    //                });
    //
    //            },
    //            authenticate: function(email, password) {
    //                // find a user in the DB
    //                return this.find({
    //                    where: {
    //                        email: email
    //                    }
    //                })
    //                    .then(function(user){
    //                        if (user === null){
    //                            throw new Error("Username does not exist");
    //                        }
    //                        else if (user.checkPassword(password)){
    //                            return user;
    //                        }
    //
    //                    });
    //            },
    //            associate: function(models) {
    //                //associations can be defined here
    //                this.hasMany(models.Song);
    //            }
    //
    //        } // close classMethods
    //    }); // close define user
    //return User;
};