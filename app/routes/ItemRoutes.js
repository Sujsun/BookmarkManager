var mongoose = require('mongoose'),
    express = require('express'),
    Service = require('../util/rest/Service'),
    ItemSchema = require('../schema/ItemSchema'),
    ItemModel = mongoose.model('Item', ItemSchema),
    router = express.Router();

module.exports = Service({
    Model: ItemModel,
}).router;
