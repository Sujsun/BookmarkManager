var ItemModel = Backbone.Model.extend({

    url: '/item',

    idAttribute: '_id',

    defaults: {},

    move: function(path) {
        var self = this;
        self.set('path', path);
        return self.save();
    },

    rename: function(name) {
        var self = this;
        self.set('name', name);
        return self.save();
    },

    /**
     * Overriding default save method to change the payload structure
     */
    save: function(options) {
        var self = this;
        options || (options = {});
        if (!self.isNew()) {
            options.data || (options.data = {});
            options.data.ids = self.get('_id');
            options.data.updateProp = self.changedAttributes();
            options.data = window.JSON.stringify(options.data);
            options.contentType = 'application/json';
        }
        return Backbone.Model.prototype.save.call(this, undefined, options);
    },

    /**
     * Overriding default destroy method to add the model to the payload
     */
    destroy: function(options) {
        var self = this;
        options || (options = {});
        options.data = window.JSON.stringify(self.toJSON());
        options.contentType = 'application/json';
        return Backbone.Model.prototype.destroy.call(this, options);
    },

});
