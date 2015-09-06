var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// var users = require('./routes/users');
var ItemRoutes = require('./app/routes/ItemRoutes');
var ViewRoutes = require('./app/routes/ViewRoutes');

var app = express();

setEnvironmentVariables(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/item', ItemRoutes);
app.use('/', ViewRoutes);

// Connect to MongoDB
mongoose.connect(app.get('MongoDBUrl'));
module.exports = app;

/**
 * Helper methods
 */

/**
 * Sets the environment variables
 */
function setEnvironmentVariables(app) {
    var environment = app.get('env');
    switch (environment) {
        case 'production':
            app.set('MongoDBUrl', 'mongodb://sundarasan:password@ds035613.mongolab.com:35613/sampledb');
            break;
        case 'development':
            app.set('MongoDBUrl', 'mongodb://localhost/test');
            break;
        default:
            console.error('Unknown environment. Environment value: ', environment);
            break;
    }
}

module.exports = app;
