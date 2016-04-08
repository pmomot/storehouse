/**
 * Created by pmomot on 3/29/16.
 */
'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    config = require('./server/config'),
    SQLZ = require('sequelize'),
    sqlz = new SQLZ(config.dbConnection),
    User = require('./server/models/user')(sqlz, SQLZ),
    Product = require('./server/models/product')(sqlz, SQLZ),
    app = express(),
    api = require('./server/routes/api')(app, express, {
        User: User,
        Product: Product
    }),
    env = process.env;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/api', api);

app.listen(env.NODE_PORT || config.port, env.NODE_IP || '0.0.0.0', function () {
    console.log('Application worker ' + process.pid + ' started...'); // eslint-disable-line
});

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


//AmountType
//    .sync({force: true})
//    .then(function () {
//        return Product.sync({force: true})
//    });
