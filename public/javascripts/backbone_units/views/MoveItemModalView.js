var MoveItemModalView = Backbone.View.extend({

    el: '#move-item-modal',

    initialize: function(options) {
        this.options = options;
        this.currentMovePath = '/root';
        this.moveItemCollection = new ItemCollection();
        this.render();
    },

    render: function() {
        this.findElements();
        this.attachEvents();
    },

    events: {
        'click #move-here-btn': 'onMoveHereButtonClick',
        'click #cancel-move-btn': 'onCancelButtonClick',
    },

    attachEvents: function() {
        var self = this;
        window.Backbone.on('change:movecurrentpath', function() {
            self.onCurrentMovePathChange.apply(self, arguments);
        });
    },

    /**
     * Finds the elements from the DOM
     */
    findElements: function() {
        this.$child || (this.$child = {});
    },

    /**
     * Event Handlers
     */
    onMoveHereButtonClick: function() {
        var self = this;
        var selectedItemCollection = Backbone.browseItemListView.getSelected();
        selectedItemCollection.move(this.currentMovePath).done(function() {
            $.notify('Moved successfully', {
                autoHideDelay: 2 * 1000,
                className: 'success',
            });
            self.$el.modal('hide');
        }).fail(function() {
            $.notify('Failed to move', {
                autoHideDelay: 3 * 1000,
                className: 'error',
            });
        });
    },

    onCancelButtonClick: function() {
        this.$el.modal('hide');
    },

    onCurrentMovePathChange: function(path) {
        this.currentMovePath = path;
    },

    onMoveItemCollectionChange: function(itemCollection) {
        this.moveItemCollection = itemCollection;
    },

    /**
     * Helpers
     */

});
