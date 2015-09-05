var AddItemModalView = Backbone.View.extend({

    el: '#add-item-modal',

    currentFormat: 'bookmark',

    initialize: function() {
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
    },

    /**
     * Finds the elements from the DOM
     */
    findElements: function() {
        this.$ || (this.$ = {});
        this.$.itemTypeDropdown = this.$el.find('#item-type-dropdown-button');
        this.$.itemTypeButtonText = this.$.itemTypeDropdown.find('#selected-item-type-text');
        this.$.itemNameInput = this.$el.find('#add-item-name');
        this.$.itemContentInput = this.$el.find('#add-item-content');
        this.$.addItemContentDiv = this.$el.find('#add-item-content-div');
        this.$.addItemToolbarButton = $('#file-explorer-toolbar #add-item-btn');
    },

    /**
     * Event Handlers
     */
    onTypeClick: function(event) {
        var $target = $(event.target);
        var type = $target.attr('value');
        this.$.itemTypeDropdown.attr('value', type);
        this.$.itemTypeButtonText.html($target.html());
        this.format(type);
    },

    onNameKeyPress: function(event) {
        this.$.itemNameInput.removeClass('error');
    },

    onContentKeyPress: function(event) {
        this.$.itemContentInput.removeClass('error');
    },

    onAddButtonClick: function() {
        var self = this;
        var itemModel = this.get();
        if (itemModel) {
            itemModel.save().done(function(model) {
                self.$.addItemToolbarButton.notify('Created ' + model.type + ' "' + model.name + '"', {
                    autoHideDelay: 2 * 1000,
                    className: 'success',
                });
            }).fail(function(data) {
                var errorMessage;
                if (data && data.responseJSON && data.responseJSON.code === 11000) {
                    errorMessage = 'Already exist. Try with different name.';
                } else {
                    errorMessage = 'Failed. Please try again...';
                }
                self.$.addItemToolbarButton.notify(errorMessage, {
                    autoHideDelay: 3 * 1000,
                    className: 'error',
                });
            });
            self.$el.modal('hide');
        }
    },

    onCancelButtonClick: function() {
        this.$el.modal('hide');
    },

    onAddModalHidden: function() {
        this.resetView();
    },

    /**
     * Helpers
     */
    format: function(type) {
        switch (type) {
            case 'folder':
                this.currentFormat = type;
                this.$.addItemContentDiv.slideUp();
                break;
            case 'bookmark':
                this.currentFormat = type;
                this.$.addItemContentDiv.slideDown();
                break;
            default:
                throw new Error({
                    message: 'Unknown add item format. Given format value:' + type,
                });
        }
    },

    /**
     * Get the model object from view values
     */
    get: function() {
        var name = this.$.itemNameInput.val().trim();
        var content = this.$.itemContentInput.val().trim();
        var item = {
            type: this.currentFormat,
            path: '/root/home',
        };
        var isSuccess = true;
        if (name) {
            item.name = name;
        } else {
            this.$.itemNameInput.addClass('error');
            this.$.itemNameInput.notify('Provide label name', {
                autoHideDelay: 2 * 1000,
                className: 'error',
            });
            isSuccess = false;
        }
        if (this.currentFormat === 'bookmark') {
            if (content && this.validateURL(content)) {
                item.content = content;
            } else {
                this.$.itemContentInput.addClass('error');
                this.$.itemContentInput.notify('Provide valid URL', {
                    autoHideDelay: 2 * 1000,
                    className: 'error',
                });
                isSuccess = false;
            }
        }
        return isSuccess ? new ItemModel(item) : undefined;
    },

    /**
     * Resets the values in the view
     */
    resetView: function() {
        this.$.itemNameInput.val('');
        this.$.itemContentInput.val('');
        this.onNameKeyPress();
        this.onContentKeyPress();

    },

    validateURL: function(string) {
        return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(string);
    }

});
