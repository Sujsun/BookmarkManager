var ItemListView = Backbone.View.extend({

    el: 'ul#file-explorer-ul',

    itemViews: {},

    initialize: function() {
        return this.render();
    },

    render: function() {
        this.findElements();
        this.attachEvents();
        return this;
    },

    events: {},

    /**
     * Finds the elements from the DOM
     */
    findElements: function() {
        this.$ || (this.$ = {});
    },

    attachEvents: function() {
        var self = this;
        window.Backbone.on('loadpath', function() {
            self.loadPath.apply(self, arguments);
        });
    },

    /**
     * Event Handlers
     */


    /**
     * Helpers
     */
    loadPath: function(path) {
        var self = this;
        self.removeAll();
        self.collection.reset();
        self.collection.fetchByPath(path).done(function(models) {
            var models = self.collection.where({
                path: path
            });
            self.appendItems(models);
        }).fail(function(data) {
            $.notify('Failed to load. ' + (data.message || ''), {
                autoHideDelay: 2 * 1000,
                className: 'error',
            });
        });
    },

    removeAll: function() {
        this.removeItems(Object.keys(this.itemViews))
    },

    appendItems: function(models) {
        for (var index in models) {
            this.appendItem(models[index]);
        }
    },

    removeItems: function(ids) {
        for (var index in ids) {
            this.removeItem(ids[index]);
        }
    },

    appendItem: function(model) {
        var itemView = new ItemView({
            model: model
        });
        this.itemViews[model.get('_id')] = itemView;
        this.$el.append(itemView.render().el);
        return this;
    },

    removeItem: function(_id) {
        this.itemViews[_id] && this.itemViews[_id].remove();
        delete this.itemViews[_id];
    },

});
