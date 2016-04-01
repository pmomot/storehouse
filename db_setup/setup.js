/**
 * Created by petermomot on 4/1/16.
 */
'use strict';

module.exports = function (models) {
    var User = models.User;

    User.sync({force: true})
        .then(function () {
            return User.create({
                firstName: 'root',
                lastName: 'admin',
                email: 'root@admin.mail',
                password: 'rootpass'
            });
        });
};