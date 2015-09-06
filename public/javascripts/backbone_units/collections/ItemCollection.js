var ItemCollection = Backbone.Collection.extend({

    model: ItemModel,

    url: '/item',

    fetchByPath: function(path) {
        var self = this;
        return self.fetch({
            data: $.param({
                path: path,
                isDeleted: 'false',
            }),
        });
    },

    /**
     * Helpers
     */
    move: function(path) {
        return this.update(this.models, {
            path: path,
        });
    },

    deleteAll: function() {
        return this.deleteModels(this.models);
    },

    update: function(models, updateAttr) {
        var options = {},
            deferred = $.Deferred(),
            collection = new ItemCollection(models),
            self = this;
        options.url = this.url;
        options.contentType = 'application/json';
        options.type = 'put';
        options.dataType = 'json';
        options.data = {
            ids: collection.pluck('_id'),
            updateProp: updateAttr,
        };
        options.data = window.JSON.stringify(options.data);
        $.ajax(options).done(function() {
            self.updateModels(models, updateAttr);
            deferred.resolve(models);
        });
        return deferred;
    },

    deleteModels: function(models) {
        var options = {},
            deferred = $.Deferred(),
            collection = new ItemCollection(models),
            self = this;
        options.url = this.url;
        options.contentType = 'application/json';
        options.type = 'delete';
        options.dataType = 'json';
        options.data = collection.toJSON();
        options.data = window.JSON.stringify(options.data);
        $.ajax(options).done(function() {
            for (var index in models) {
                models[index].destroy();
            }
            deferred.resolve();
        });
        return deferred;
    },

    updateModels: function(models, updateAttr) {
        for (var index in models) {
            for (var key in updateAttr) {
                models[index].set(key, updateAttr[key]);
            }
        }
    },

    isAllFolder: function() {
        var folderItemModels = this.where({
            type: 'folder'
        });
        if (this.length && folderItemModels.length === this.length) {
            return true;
        } else {
            return false;
        }
    },

    isAllBookmark: function() {
        var folderItemModels = this.where({
            type: 'bookmark'
        });
        if (this.length && folderItemModels.length === this.length) {
            return true;
        } else {
            return false;
        }
    },

});
