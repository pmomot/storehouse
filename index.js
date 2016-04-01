/**
 * Created by petermomot on 3/29/16.
 */
'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    config = require('./server/config'),
    SQLZ = require('sequelize'),
    sqlz = new SQLZ('postgres://postgres:AdminUser1**@localhost:5432/storehouse'),
    User = require('./server/models/user')(sqlz, SQLZ),
    app = express(),
    api = require('./server/routes/api')(app, express, {
        User: User
    });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.use('/api', api);

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(config.port, function (err) {
    if (err) {
        console.log(err); // eslint-disable-line
    } else {
        console.log('listening on port ' + config.port); // eslint-disable-line
    }
});

// uncomment this only to create (almost) empty tables. Use this ONLY on dev
// require('./db_setup/setup')({User: User});

//var AmountType = sequelize.define('amountTypes', {
//    value: {
//        type: Sequelize.STRING
//    },
//    uaName: {
//        type: Sequelize.STRING
//    },
//    engName: {
//        type: Sequelize.STRING
//    }
//}, {
//    freezeTableName: true
//});
//
//
//var Product = sequelize.define('products', {
//    name: {
//        type: Sequelize.STRING
//    },
//    description: {
//        type: Sequelize.TEXT
//    },
//    amount: {
//        type: Sequelize.INTEGER
//    },
//    amountType: {
//        type: Sequelize.INTEGER,
//        references: {
//            model: AmountType,
//            key: 'id',
//            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
//        }
//    },
//    minAmount: {
//        type: Sequelize.INTEGER
//    },
//    barCode: {
//        type: Sequelize.INTEGER
//    },
//    dateArrived: {
//        type: Sequelize.DATE
//    }
//}, {
//    freezeTableName: true
//});


//AmountType
//    .sync({force: true})
//    .then(function () {
//        return Product.sync({force: true})
//    });
