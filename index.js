/**
 * Created by pmomot on 3/29/16.
 */
'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    config = require('./server/config'),
    app = express(),
    tables = require('./server/tables')(config),
    api = require('./server/routes/api')(app, express, tables),
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
