var count = 0;
var ItemView = Backbone.View.extend({

    tagName: 'li',

    isSelected: false,

    id: function() {
        return this.model.get('_id');
    },

    className: 'file-item-li',

    template: window.document.getElementById('file-item-template'),

    currentSelectMode: 'single',

    initialize: function(options) {
        this.options = options || {};
        _.defaults(this.options, {
            type: 'browse'
        });
        this.setType(this.options.type);
        return this;
    },

    render: function() {
        var htmlString = Mustache.to_html(this.template.innerHTML, this.model.toJSON());
        $(this.el).html(htmlString, this.model.toJSON());
        this.findElements();
        this.attachEvents();
        return this;
    },

    events: {
        'tap #file-item-wrapper': 'onIconClick',
        'taphold #file-item-wrapper': 'onIconLongClick',
    },

    attachEvents: function() {
        var self = this;
        window.Backbone.on('change:selectmode', function() {
            self.onSelectModeChange.apply(self, arguments);
        });
        this.model.on('change:name', function() {
            self.onNameChange.apply(self, arguments);
        });
        this.model.on('change:icon', function() {
            self.onIconChange.apply(self, arguments);
        });
        this.$child.fileItemWrapper.tooltip({
            html: true,
            placement: 'bottom',
            title: function() {
                return self.model.get('name') + '<br>Created: ' + self.model.get('createdDateReadable');
            },
        });
    },

    /**
     * Finds the elements from the DOM
     */
    findElements: function() {
        this.$child || (this.$child = {});
        this.$child.fileItemWrapper = this.$el.find('#file-item-wrapper');
        this.$child.fileItemName = this.$el.find('#file-item-name');
        this.$child.fileIconImg = this.$el.find('img#file-icon-img');
    },

    /**
     * Event Handlers
     */
    onIconClick: function() {
        switch (this.currentSelectMode) {
            case 'single':
                this.open();
                break;
            case 'multiple':
                this.toggleSelect();
                break;
        }
    },

    onIconLongClick: function(event) {
        if (this.options.enableSelect) {
            this.toggleSelect();
        }
    },

    onSelectModeChange: function(selectMode) {
        this.currentSelectMode = selectMode;
    },

    onNameChange: function(model) {
        this.$child.fileItemName.html(this.model.get('name'));
    },

    onIconChange: function(model) {
        this.$child.fileIconImg.attr('src', this.model.get('icon'));
    },

    /**
     * Helpers
     */
    open: function() {
        switch (this.model.get('type')) {
            case 'folder':
                if (this.options.enableFolderOpen) {
                    var navigateTo = this.model.get('path') + '/' + this.model.get('name');
                    if (this.options.type === 'browse') {
                        window.Backbone.bookmarkRouter.navigate(navigateTo, {
                            trigger: true
                        });
                    } else {
                        window.Backbone.trigger('change:' + this.options.type + 'currentpath', navigateTo);
                    }
                }
                break;
            case 'bookmark':
                if (this.options.enableFileOpen) {
                    this.openNewTab(this.model.get('content'));
                }
                break;
            default:
                this.$child.fileItemWrapper.notify('Cannot open this file', {
                    autoHideDelay: 3 * 1000,
                    className: 'error',
                });
                throw new Error({
                    name: 'Unsupported Format',
                    message: 'Unknown file format',
                });
        }
    },

    toggleSelect: function() {
        if (!this.isSelected) {
            this.select();
        } else {
            this.unselect();
        }
    },

    select: function() {
        this.isSelected = true;
        this.$child.fileItemWrapper.addClass('selected');
        this.trigger('change:select', this.isSelected, this);
        if (this.currentSelectMode !== 'multiple') {
            window.Backbone.trigger('change:selectmode', 'multiple');
        }
    },

    unselect: function() {
        this.isSelected = false;
        this.$child.fileItemWrapper.removeClass('selected');
        this.trigger('change:select', this.isSelected, this);
    },

    setType: function(type) {
        switch (type) {
            case 'browse':
                this.options.enableFolderOpen = true;
                this.options.enableFileOpen = true;
                this.options.enableSelect = true;
                break;
            case 'move':
                this.options.enableFolderOpen = true;
                this.options.enableFileOpen = false;
                this.options.enableSelect = true;
                break;
        }
    },

    openNewTab: function(url) {
        var windowObject = window.open(url, '_blank');
        windowObject.focus();
        return window;
    },

});
