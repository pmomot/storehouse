/**
 * Created by pmomot on 3/29/16.
 */
'use strict';

var config,
    production = process.env.NODE_ENV === 'production';

if (production) {
    config = {
        port: 3000,
        secretKey: 'sV2EwoVkZJIr3fFrspUj',
        dbConnection: process.env.OPENSHIFT_POSTGRESQL_DB_URL + '/storehouse'
    };
} else {
    config = {
        port: 3001,
        secretKey: 'LoremIpsumDolorSitAmet',
        dbConnection: 'postgres://postgres:AdminUser1**@localhost:5432/storehouse'
    };
}

config.languages = ['en', 'ua', 'ru'];

module.exports = config;
