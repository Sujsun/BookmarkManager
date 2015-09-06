var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
    id: String,
    type: {
        type: String,
        enum: ['folder', 'bookmark'],
    },
    name: String,
    path: String,
    content: String,
    created: {
        type: Date,
        default: Date.now
    },
});

/**
 * Making the name and path combination to be unique
 */
ItemSchema.index({
    name: 1,
    path: 1,
}, {
    unique: true
});

module.exports = ItemSchema;
