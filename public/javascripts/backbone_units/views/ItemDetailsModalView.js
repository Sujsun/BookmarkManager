var ItemDetailsModalView = Backbone.View.extend({

    el: '#add-item-modal',

    currentFormat: 'bookmark',

    currentPath: '/root',

    initialize: function(options) {
        this.options = options;
        _.defaults(this.options, {
            type: 'browse'
        });
        this.render();
    },

    render: function() {
        this.findElements();
        this.attachEvents();
    },

    events: {
        'click #add-item-type-dropdown ul li a': 'onTypeClick',
        'keypress #add-item-name': 'onNameKeyPress',
        'keypress #add-item-content': 'onContentKeyPress',
        'click #add-item-modal-btn': 'onAddButtonClick',
        'click #cancel-item-modal-btn': 'onCancelButtonClick',
    },

    attachEvents: function() {
        var self = this;
        this.$el.on('hidden.bs.modal', function() {
            self.onAddModalHidden.apply(self, arguments);
        });
        window.Backbone.on('change:' + this.options.type + 'currentpath', function() {
            self.onCurrentPathChange.apply(self, arguments);
        });
    },

    /**
     * Finds the elements from the DOM
     */
    findElements: function() {
        this.$child || (this.$child = {});
        this.$child.itemTypeDropdown = this.$el.find('#item-type-dropdown-button');
        this.$child.itemTypeButtonText = this.$child.itemTypeDropdown.find('#selected-item-type-text');
        this.$child.itemNameInput = this.$el.find('#add-item-name');
        this.$child.itemContentInput = this.$el.find('#add-item-content');
        this.$child.addItemContentDiv = this.$el.find('#add-item-content-div');
        this.$child.addItemToolbarButton = $('#file-explorer-toolbar #add-item-btn');
    },

    /**
     * Event Handlers
     */
    onTypeClick: function(event) {
        var $target = $(event.target);
        var type = $target.attr('value');
        this.format(type);
    },

    onNameKeyPress: function(event) {
        this.$child.itemNameInput.removeClass('error');
    },

    onContentKeyPress: function(event) {
        this.$child.itemContentInput.removeClass('error');
    },

    onAddButtonClick: function() {
        var self = this;
        var itemModel = this.getModel();
        if (itemModel) {
            itemModel.save().done(function(model) {
                self.collection.add(model);
                $('#file-explorer-browse #file-explorer-ul #' + (model._id || itemModel.get('_id')) + ' #file-item-wrapper').notify('Saved ' + itemModel.get('type') + ' "' + itemModel.get('name') + '"', {
                    autoHideDelay: 2 * 1000,
                    className: 'success',
                });
            }).fail(function(data) {
                var errorMessage, notifyClassName = 'error';
                if (data && data.responseJSON && data.responseJSON.code === 11000) {
                    errorMessage = 'Already exist. Try with different name.';
                } else if (data.message) {
                    errorMessage = data.message;
                    notifyClassName = 'warn';
                } else {
                    errorMessage = 'Failed. Please try again...';
                }
                $.notify(errorMessage, {
                    autoHideDelay: 3 * 1000,
                    className: notifyClassName,
                });
            });
            self.$el.modal('hide');
        }
    },

    onCancelButtonClick: function() {
        this.$el.modal('hide');
    },

    onAddModalHidden: function() {
        this.reset();
    },

    onCurrentPathChange: function(path) {
        this.currentPath = path;
    },

    /**
     * Helpers
     */
    format: function(type) {
        var typeName = 'Unknown';
        switch (type) {
            case 'folder':
                this.currentFormat = type;
                typeName = 'Folder';
                this.$child.addItemContentDiv.slideUp();
                break;
            case 'bookmark':
                this.currentFormat = type;
                typeName = 'Bookmark';
                this.$child.addItemContentDiv.slideDown();
                break;
            default:
                throw new Error({
                    message: 'Unknown add item format. Given format value:' + type,
                });
        }
        this.$child.itemTypeDropdown.attr('value', type);
        this.$child.itemTypeButtonText.html(typeName);
    },

    setModel: function(model) {
        var self = this;
        this.model = model;
        this.setModelInView();
    },

    setModelInView: function() {
        this.$child.itemNameInput.val(this.model.get('name'));
        this.format(this.model.get('type'));
        if (this.model.get('type') !== 'folder') {
            this.$child.itemContentInput.val(this.model.get('content'));
        }
    },

    /**
     * Get the model object from view values
     */
    getModel: function() {
        var returnModel = this.model || new ItemModel();
        var name = this.$child.itemNameInput.val().trim();
        var content = this.$child.itemContentInput.val().trim();
        // if (returnModel.get('path') !== this.currentPath) {
        returnModel.set('path', this.currentPath);
        // }
        // if (returnModel.get('type') !== this.currentFormat) {
        returnModel.set('type', this.currentFormat);
        // }
        var isSuccess = true;
        if (name) {
            // if (returnModel.get('name') !== name) {
            returnModel.set('name', name);
            // }
        } else {
            this.$child.itemNameInput.addClass('error');
            this.$child.itemNameInput.notify('Provide label name', {
                autoHideDelay: 2 * 1000,
                className: 'error',
            });
            isSuccess = false;
        }
        if (this.currentFormat === 'bookmark') {
            if (content && this.validateURL(content)) {
                // if (returnModel.get('content') !== content) {
                returnModel.set('content', content);
                // }
            } else {
                this.$child.itemContentInput.addClass('error');
                this.$child.itemContentInput.notify('Provide valid URL', {
                    autoHideDelay: 2 * 1000,
                    className: 'error',
                });
                isSuccess = false;
            }
        }
        return isSuccess ? returnModel : undefined;
    },

    reset: function() {
        delete this.model;
        this.resetView();
    },

    /**
     * Resets the values in the view
     */
    resetView: function() {
        this.$child.itemNameInput.val('');
        this.$child.itemContentInput.val('');
        this.onNameKeyPress();
        this.onContentKeyPress();

    },

    validateURL: function(string) {
        return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(string);
    }

});
