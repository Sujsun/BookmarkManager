var $ = require('jquery-deferred');
/**
 * Creates Factory Object for given ModelClass
 * @param  {Object} Model ModelClass
 */
function createFactory(Model, options) {
    return new Factory(Model, options);
}
/**
 * Factory Class definition
 * @param  {Object} Model ModelClass
 * @param  {Object} options
 */
function Factory(Model, options) {
    options || (options = {});
    this.get = function(query, optionsArg) {
        return _get(Model, query, optionsArg || options);
    };
    this.getOne = function(query, optionsArg) {
        return _getOne(Model, query, optionsArg || options);
    };
    this.save = function(model, optionsArg) {
        return _save(Model, model, optionsArg || options);
    };
    this.remove = function(model, optionsArg) {
        return _remove(Model, model, optionsArg || options);
    };
    this.update = function(model, optionsArg) {
        return _update(Model, model, optionsArg || options);
    };
}
/**
 * Gets object by param value which are unique
 * @param  {Object} model
 * @param  {Object} query
 * @param  {Object} options     options = {populate: '<keys which needs to be populated seperated by space>'}
 * @return {Object} deferred
 */
function _getOne(Model, query, options) {
    var deferred = $.Deferred();
    typeof(query) === 'object' || (query = {});
    options || (options = {});
    options.populate || (options.populate = '');
    Model.findOne(query).populate(options.populate).exec(function(err, model) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(model);
        }
    });
    return deferred;
}
/**
 * Gets object by param value which are not unique (Which means it returns list of matched objects)
 * @param  {Object} model
 * @param  {Object} query
 * @param  {Object} options     options = {populate: '<keys which needs to be populated seperated by space>'}
 * @return {Object} deferred
 */
function _get(Model, query, options) {
    var deferred = $.Deferred();
    typeof(query) === 'object' || (query = {});
    options || (options = {});
    options.populate || (options.populate = '');
    Model.find(query).populate(options.populate).exec(function(err, models) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(models);
        }
    });
    return deferred;
}
/**
 * Saves model(s)
 * @param  {Object} Model
 * @param  {Object} models  Single/Array of objects those needs to be saved
 * @return {Object} deferred
 */
function _save(Model, model) {
    Array.isArray(model) || (model = [model]);
    var deferred = $.Deferred();
    var deferredArray = [];
    for (var index in model) {
        model[index] = Model(model[index]);
        deferredArray.push(_saveOne(Model, model[index]));
    }
    $.when.apply($, deferredArray).done(function() {
        deferred.resolve(Array.prototype.slice.call(arguments));
    }).fail(function() {
        deferred.reject.apply(deferred, arguments);
    });
    return deferred;
}
/**
 * Saves one model
 * @param  {Object} Model
 * @param  {Object} models  Single/Array of objects those needs to be saved
 * @return {Object} deferred
 */
function _saveOne(Model, model) {
    var deferred = $.Deferred();
    model.save(function(err, model) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(model);
        }
    });
    return deferred;
}
/**
 * Removes object
 * @param  {Object} Model
 * @param  {Object} model
 * @param  {Object} options     options = { permanentDelete: false <Default: false>, deleteProp: {status: 'deleted' <Default: {isDeleted: true}>}, }
 * @return {Object} deferred
 */
function _remove(Model, model, options) {
    var deferred;
    options || (options = {});
    // If permanentDelete is true then delete permanently from the collection
    if (options.permanentDelete) {
        deferred = $.Deferred();
        var ids = pluckIds(model);
        Model.remove({
            _id: {
                $in: ids,
            },
        }, function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve();
            }
        });
        return deferred;
    } else {
        options.deleteProp || (options.deleteProp = {
            isDeleted: true,
        });
        deferred = _update(Model, model, {
            updateProp: options.deleteProp,
        });
    }
    return deferred;
}
/**
 * Update the given models with the given udpateProp
 * @param  {Object} Model
 * @param  {Object} model   Single/Array of objects those needs to be updated
 * @param  {Object} options     options = { updateProp: <updatePropObject Eg: {sold: true}>, }
 * @return {Object} deferred
 */
function _update(Model, model, options) {
    var deferred = $.Deferred();
    options || (options = {});
    var ids = pluckIds(model),
        multi = (ids.length > 1);
    console.log('IDs: ', ids);
    if (options && typeof(options.updateProp) === 'object') {
        Model.update({
            _id: {
                $in: ids,
            }
        }, {
            $set: options.updateProp,
        }, {
            multi: multi,
        }, function(err, models) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(models);
            }
        });
    } else {
        deferred.reject({
            message: 'No updateProp given in options/Invalid updateProp value.',
        });
    }
    return deferred;
}
/**
 * Smart algorithm to pull out id from given list of model/id
 * @param {Array<Model/String>/String} model [description]
 * @return {Array} ids
 */
function pluckIds(param) {
    var ids = [];
    var paramType = typeof(param);
    if (paramType === 'string') {
        ids.push(param);
    } else if (Array.isArray(param)) {
        if (param.length > 0) {
            var paramItemType = typeof(param[0]);
            if (paramItemType === 'string') {
                ids = ids.concat(param);
            } else if (paramItemType === 'object') {
                for (var index in param) {
                    ids.push(param[index].id || param[index]._id);
                }
            }
        }
    } else if (paramType === 'object') {
        ids.push(param.id || param._id);
    }
    return ids;
}
// Exports createFactory method
module.exports = createFactory;
