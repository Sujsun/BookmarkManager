(function(root, $) {
    Backbone.history.start();

    var itemCollection = new ItemCollection();
    window.c = itemCollection;
    itemCollection.fetchByPath('/root');

    var fileExplorerToolbarView = new FileExplorerToolbarView();

})(this, $ || jQuery);
