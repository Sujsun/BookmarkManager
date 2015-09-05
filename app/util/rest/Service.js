var express = require('express'),
    Factory = require('./Factory');

function createService(options) {
    return new Service(options);
}

function Service(options) {
    options || (options = {});
    var returnObject = {};
    if (!options.route) {
        options.router || (options.router = express.Router());
        options.route = options.router.route(options.path || '');
    }
    options.Model || ((function() {
        throw new Error('Please provide model in options');
    })());
    options.factory || (options.factory = Factory(options.Model, options));
    // HTTP request handlers
    options.route.get(returnObject.get = function(req, res, next) {
        _get(req, res, next, options);
    });
    options.route.post(returnObject.post = function(req, res, next) {
        _post(req, res, next, options);
    });
    options.route.put(returnObject.put = function(req, res, next) {
        _put(req, res, next, options);
    });
    options.route.delete(returnObject.delete = function(req, res, next) {
        _remove(req, res, next, options);
    });
    returnObject.router = options.router;
    return returnObject;
}

function _get(req, res, next, options) {
    req.query.isDeleted && (req.query.isDeleted = (req.query.isDeleted === 'true'));
    options.factory.get(req.query).done(function(models) {
        res.send(models);
    }).fail(function(err) {
        res.status(500).send(err); // Sending 500 (Internal Server) response code
    });
}

function _post(req, res, next, options) {
    var requestBody = req.body,
        models = [];
    Array.isArray(requestBody) || (requestBody = [requestBody]);
    options.factory.save(requestBody).done(function(models) {
        if (Object.keys(models).length === 1) {
            res.send(models[0]);
        } else {
            res.send(arguments);
        }
    }).fail(function(err) {
        res.status(500).send(err); // Sending 500 (Internal Server) response code
    });
}

function _put(req, res, next, options) {
    var err = {
        message: '',
    };
    (req.body.models || req.body.ids) || (err.message += 'Please provide "models"/"ids" in the request body. ');
    req.body.updateProp || (err.message += 'Please provide "updateProp" in the request body. "updateProp" is a JSON which needs to be updated in the given models. ');
    if (err && err.message !== '') {
        res.status(500).send(err); // Sending 500 (Internal Server) response code 
    }
    options.factory.update(req.body.models || req.body.ids, {
        updateProp: req.body.updateProp,
    }).done(function() {
        res.send(arguments);
    }).fail(function(err) {
        res.status(500).send(err); // Sending 500 (Internal Server) response code 
    });
}

function _remove(req, res, next, options) {
    var models = [];
    if (req.query.id) {
        try {
            models = JSON.parse(req.query._id);
        } catch (exception) {
            console.error('Given url query is not a JSON. URL Query: ', req.query);
            res.status(500).send({
                message: "Invalid Query Value. Not a valid JSON",
                exception: exception.message,
            });
        }
    } else if (req.body) {
        models = req.body;
    }
    options.factory.remove(models, options).done(function() {
        res.send(arguments.length > 0 ? arguments : arguments);
    }).fail(function(err) {
        res.status(500).send(err); // Sending 500 (Internal Server) response code
    });
}
module.exports = createService;
