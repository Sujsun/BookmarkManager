var ItemModel = Backbone.Model.extend({

    url: '/item',

    idAttribute: '_id',

    defaults: {
        isDeleted: 'false',
    },

    initialize: function() {
        this.onModelTypeChange();
        if (this.get('created')) {
            this.set('createdDateReadable', window.moment(this.get('created')).format('MMM D, YYYY'));
        }
        this.attachEvents();
    },

    attachEvents: function() {
        var self = this;
        this.on('change', function() {
            self.onModelChange.apply(self, arguments);
        });
        this.on('change:type', function() {
            self.onModelTypeChange.apply(self, arguments);
        });
    },

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
     * Event Handlers
     */
    onModelChange: function(model) {
        this.changedProperties || (this.changedProperties = {});
        var changedAttributes = this.changedAttributes();
        for (var key in changedAttributes) {
            this.changedProperties[key] = changedAttributes[key];
        }
    },

    onModelTypeChange: function() {
        this.set('icon', this.getIcon());
    },

    /**
     * Overriding default save method to change the payload structure
     */
    save: function(options) {
        var self = this;
        options || (options = {});
        if (!self.isNew()) {
            if (self.changedProperties) {
                options.data || (options.data = {});
                options.data.ids = self.get('_id');
                options.data.updateProp = self.changedProperties;
                options.data = window.JSON.stringify(options.data);
                options.contentType = 'application/json';
            } else {
                return $.Deferred().reject(Error('No changes to save')).promise();
            }
        }
        return Backbone.Model.prototype.save.call(this, undefined, options).done(function() {
            this.changedProperties = {};
        });
    },

    /**
     * Overriding Parse Method to adopt to PUT response
     */
    parse: function(response, options) {
        var returnResponse = response;
        if (!options.add) {
            returnResponse = undefined;
        }
        return returnResponse;
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

    getIcon: function() {
        var iconUrl;
        switch (this.get('type')) {
            case 'folder':
                iconUrl = 'images/folder.png';
                break;
            case 'bookmark':
                iconUrl = 'images/book-bookmark-icon.png';
                break;
            default:
                iconUrl = 'images/unknown-file-icon.jpg';
        }
        return iconUrl;
    },

});
