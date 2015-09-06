var ItemListView = Backbone.View.extend({

    el: '#file-explorer-main ul#file-explorer-ul',

    initialize: function(options) {
        this.options = options;
        this.currentPath = '/root';
        _.defaults(this.options, {
            type: 'browse',
        });
        this.itemViews = {};
        return this.render();
    },

    selectedItemViews: {},

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
        this.$child || (this.$child = {});
    },

    attachEvents: function() {
        var self = this;
        this.collection.on('add', function() {
            self.onModelAdd.apply(self, arguments);
        });
        this.collection.on('remove', function() {
            self.onModelRemove.apply(self, arguments);
        });
        this.collection.on('change:path', function() {
            self.onItemModelPathChange.apply(self, arguments);
        })
        window.Backbone.on('change:' + this.options.type + 'currentpath', function() {
            self.onCurrentPathChange.apply(self, arguments);
        });
    },

    attachItemViewEvents: function(itemView) {
        var self = this;
        itemView.on('change:select', function() {
            self.onItemViewSelectChange.apply(self, arguments);
        });
    },

    /**
     * Event Handlers
     */
    onModelAdd: function(model) {
        var self = this;
        if (model.get('path') === this.currentPath) {
            this.appendItem(model);
        }
    },

    onModelRemove: function(model) {
        if (model.get('path') === this.currentPath) {
            this.removeItem(model.get('_id'));
        }
    },

    onCurrentPathChange: function(path) {
        this.currentPath = path;
        this.loadPath(path);
    },

    onItemViewSelectChange: function(selectFlag, itemView) {
        if (selectFlag) {
            this.selectedItemViews[itemView.model.get('_id')] = itemView;
        } else {
            delete this.selectedItemViews[itemView.model.get('_id')];
        }
        if (!Object.keys(this.selectedItemViews).length) {
            window.Backbone.bookmarkRouter.view.browseItemListView.selectMode = 'single';
        }
    },

    onItemModelPathChange: function(model) {
        if (model.get('path') === this.currentPath) {
            this.appendItem(model.get('_id'));
        } else {
            this.removeItem(model.get('_id'));
        }
    },

    /**
     * Helpers
     */
    loadPath: function(path) {
        var self = this;
        self.reset();
        self.collection.reset();
        self.collection.fetchByPath(path).done(function(models) {
            console.log('Loaded path: ', path);
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
        var self = this;
        var itemView = new ItemView({
            model: model,
            type: self.options.type,
        });
        this.itemViews[model.get('_id')] = itemView;
        this.$el.append(itemView.render().el);
        this.attachItemViewEvents(itemView);
        return this;
    },

    removeItem: function(_id) {
        var itemView = this.itemViews[_id];
        if (itemView) {
            itemView.remove();
            if (itemView.isSelected) {
                this.onItemViewSelectChange(false, itemView);
                delete this.selectedItemViews[_id];
            }
        }
        delete this.itemViews[_id];
    },

    reset: function() {
        this.removeAll();
        this.selectedItemViews = {};
    },

    getSelected: function() {
        var selectedItemModels = [];
        for (var key in this.selectedItemViews) {
            var selectedItemView = this.selectedItemViews[key];
            selectedItemModels.push(selectedItemView.model);
        }
        var selectedItemCollection = new ItemCollection(selectedItemModels);
        return selectedItemCollection;
    },

    move: function() {

    },

});
