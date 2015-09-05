var ItemCollection = Backbone.Collection.extend({

    model: ItemModel,

    url: '/item',

    fetchByPath: function(path) {
        var self = this;
        return self.fetch({
            data: $.param({
                path: path,
                isDeleted: 'false',
            }),
        });
    },

});
