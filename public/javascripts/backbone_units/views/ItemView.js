var ItemView = Backbone.View.extend({

    tagName: 'li',

    id: function() {
        return this.model.get('_id');
    },

    className: 'file-item-li',

    template: window.document.getElementById('file-item-template'),

    initialize: function() {
        return this;
    },

    render: function() {
        var htmlString = Mustache.to_html(this.template.innerHTML, this.model.toJSON());
        $(this.el).html(htmlString, this.model.toJSON());
        return this;
    },

    events: {},

    /**
     * Finds the elements from the DOM
     */
    findElements: function() {
        this.$ || (this.$ = {});
    },

    /**
     * Event Handlers
     */


    /**
     * Helpers
     */


});
