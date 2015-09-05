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

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);
app.use('/item', ItemRoutes);
app.use('/', ViewRoutes);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.send('Error');
//     // res.render('error', {
//     //     message: err.message,
//     //     error: {}
//     // });
// });

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
	switch(environment) {
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
