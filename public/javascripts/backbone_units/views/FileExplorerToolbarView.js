var FileExplorerToolbarView = Backbone.View.extend({

    el: '#file-explorer-toolbar',

    $: {
        addItemModal: $('#add-item-modal'),
        moveItemModal: $('#move-item-modal'),
    },

    initialize: function() {
        return this.render();
    },

    render: function() {
        this.findElements();
        return this;
    },

    events: {
        'click #add-item-btn': 'onAddItemButtonClick',
        'click #move-item-btn': 'onMoveItemButtonClick',
        'click #go-to-path-btn': 'onGoClick',
        'keypress #file-path-input': 'onFilePathInputKeypress',
    },

    findElements: function() {
        this.$ || (this.$ = {});
        this.$.goToPathInput = this.$el.find('input#file-path-input');
    },

    onGoClick: function(event) {
        window.Backbone.trigger('loadpath', this.$.goToPathInput.val());
    },

    onAddItemButtonClick: function(event) {
        this.$.addItemModal.modal('show');
    },

    onMoveItemButtonClick: function(event) {
        this.$.moveItemModal.modal('show');
    },

    onFilePathInputKeypress: function(event) {
        if (event.keyCode === 13) {
            this.onGoClick(event);
        }
    },

});
