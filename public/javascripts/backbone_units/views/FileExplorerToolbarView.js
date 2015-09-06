var FileExplorerToolbarView = Backbone.View.extend({

    el: '#file-explorer-toolbar',

    currentPath: '/root',

    initialize: function(options) {
        this.options = options;
        _.defaults(this.options, {
            type: 'browse'
        });
        return this.render();
    },

    render: function() {
        this.findElements();
        this.attachEvents();
        this.format(this.options.type);
        return this;
    },

    events: {
        'click #add-item-btn': 'onAddItemButtonClick',
        'click #move-item-btn': 'onMoveItemButtonClick',
        'click #remove-item-btn': 'onRemoveItemButtonClick',
        'click #go-to-path-btn': 'onGoClick',
        'click #go-back-btn': 'onGoBackClick',
        'keypress #file-path-input': 'onFilePathInputKeypress',
    },

    attachEvents: function() {
        var self = this;
        this.$child.goBackButton.tooltip();
        this.$child.goToPathButton.tooltip();
        this.$child.addItemButton.tooltip();
        this.$child.removeItemButton.tooltip();
        this.$child.moveItemButton.tooltip();
        window.Backbone.on('change:' + this.options.type + 'currentpath', function() {
            self.onCurrentPathChange.apply(self, arguments);
        });
    },

    findElements: function() {
        this.$child = this.$child || {};
        this.$child.addItemModal = $('#add-item-modal');
        this.$child.moveItemModal = $('#move-item-modal');
        this.$child.toolbarSection1 = this.$el.find('#toolbar-section-1');
        this.$child.toolbarSection2 = this.$el.find('#toolbar-section-2');
        this.$child.goToPathInput = this.$el.find('input#file-path-input');
        this.$child.goToPathButton = this.$el.find('#go-to-path-btn');
        this.$child.goBackButton = this.$el.find('#go-back-btn');
        this.$child.addItemButton = this.$el.find('#add-item-btn');
        this.$child.removeItemButton = this.$el.find('#remove-item-btn');
        this.$child.moveItemButton = this.$el.find('#move-item-btn');
    },

    /**
     * Event Handlers
     */
    onGoClick: function(event) {
        window.Backbone.trigger('change:' + this.options.type + 'currentpath', this.$child.goToPathInput.val());
    },

    onGoBackClick: function(event) {
        window.Backbone.bookmarkRouter.goBack();
    },

    onAddItemButtonClick: function(event) {
        this.$child.addItemModal.modal('show');
    },

    onMoveItemButtonClick: function(event) {
        var selectedItemCollection = Backbone.browseItemListView.getSelected();
        if (selectedItemCollection.length) {
            if (selectedItemCollection.isAllBookmark()) {
                this.$child.moveItemModal.modal('show');
                window.Backbone.trigger('change:movecurrentpath', 'root');
            } else {
                $.notify('Folder cannot be moved', {
                    autoHideDelay: 3 * 1000,
                    className: 'warn',
                });
            }
        } else {
            $.notify('Select file(s) by long click and try', {
                autoHideDelay: 3 * 1000,
                className: 'warn',
            });
        }
    },

    onFilePathInputKeypress: function(event) {
        if (event.keyCode === 13) {
            this.onGoClick(event);
        }
    },

    onCurrentPathChange: function(path) {
        this.currentPath = path;
        this.$child.goToPathInput.val(this.currentPath);
    },

    onRemoveItemButtonClick: function() {
        var selectedItemCollection = Backbone.browseItemListView.getSelected();
        if (selectedItemCollection.length) {
            selectedItemCollection.deleteAll().done(function() {
                $.notify('Deleted successfully', {
                    autoHideDelay: 2 * 1000,
                    className: 'success',
                });
            });
        } else {
            $.notify('Select file(s) to delete', {
                autoHideDelay: 3 * 1000,
                className: 'warn',
            });
        }
    },

    /**
     * Helper methods
     */
    getPath: function() {
        return this.currentPath;
    },

    format: function(type) {
        switch (type) {
            case 'move':
                this.replaceColClass(this.$child.toolbarSection1, 'col-lg-12 col-md-12 col-sm-12 col-xs-12');
                this.$child.toolbarSection2.hide();
                break;
            case 'browse':
                this.replaceColClass(this.$child.toolbarSection1, 'col-lg-8 col-md-8 col-sm-8 col-xs-12');
                this.$child.toolbarSection2.show();
                break;
        }
    },

    replaceColClass: function($el, className) {
        var classBackUp = $el.attr('class');
        classBackUp = classBackUp.replace(/col-(sm|xs|md|lg)-[0-9]{1,2}/g, '').trim();
        $el.removeAttr('class');
        $el.attr('class', classBackUp + ' ' + className);
        return $el;
    },

});
