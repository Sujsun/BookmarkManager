var FileExplorerToolbarView = Backbone.View.extend({

    el: '#file-explorer-toolbar-wrapper',

    template: window.document.getElementById('file-explorer-toolbar-template'),

    $: {
        addItemModal: $('#add-item-modal'),
        moveItemModal: $('#move-item-modal'),
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        var htmlString = Mustache.to_html(this.template.innerHTML);
        this.$el.html(htmlString);
    },

    events: {
        'click #add-item-btn': 'onAddItemButtonClick',
        'click #move-item-btn': 'onMoveItemButtonClick',
    },

    onAddItemButtonClick: function(event) {
        this.$.addItemModal.modal('show');
    },

    onMoveItemButtonClick: function(event) {
        this.$.moveItemModal.modal('show');
    },

});
