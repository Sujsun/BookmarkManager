(function(root, $) {
    Backbone.history.start();

    var itemCollection = new ItemCollection();
    window.coll = itemCollection;

    var addItemModalView = new AddItemModalView({
        collection: itemCollection,
        type: 'browse',
    });

    var itemListView = new ItemListView({
        el: '#file-explorer-main #file-explorer-ul',
        collection: itemCollection,
        type: 'browse',
    });

    window.Backbone.browseItemListView = itemListView;

    var fileExplorerToolbarView = new FileExplorerToolbarView({
        type: 'browse',
    });

    var moveFileExplorerToolbarView = new FileExplorerToolbarView({
        el: '#move-item-modal #file-explorer-move #file-explorer-toolbar',
        type: 'move',
    });

    window.tool = fileExplorerToolbarView;

    window.mtool = moveFileExplorerToolbarView;

    window.moveItemListView = new ItemListView({
        el: '#file-explorer-move #file-explorer-ul',
        collection: new ItemCollection(),
        type: 'move',
    });

    var moveItemModalView = new MoveItemModalView();

    window.Backbone.trigger('change:' + 'browse' + 'currentpath', '/root');

    window.Backbone.trigger('change:selectmode', 'single');

})(this, $ || jQuery);
