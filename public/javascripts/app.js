(function(root, $) {
    Backbone.history.start();

    var itemCollection = new ItemCollection();
    window.c = itemCollection;

    var addItemModalView = new AddItemModalView();

    var itemListView = new ItemListView({
        collection: itemCollection,
    });

    var fileExplorerToolbarView = new FileExplorerToolbarView({
        test: 'test',
    });

    window.liv = itemListView;

    itemListView.loadPath('/root');

})(this, $ || jQuery);
