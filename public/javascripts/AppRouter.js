(function(root, $) {

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

    window.Backbone.trigger('change:selectmode', 'single');

    var BookmarkRouter = Backbone.Router.extend({

        initialize: function() {
            this.createCollection();
            this.createViews();
            this.attachEvents();
        },

        routes: {
            '*all': 'default',
        },

        attachEvents: function() {
            var self = this;
            this.on('route:all', function() {
                alert('Route changed!');
                self.onAllRoute.apply(self, arguments);
            });
        },

        onAllRoute: function() {
            var currentRoutePath = Backbone.history.getFragment();
            if (currentRoutePath) {
                window.Backbone.trigger('change:browsecurrentpath', currentRoutePath);
            } else {
                this.navigate('root', {
                    trigger: true
                });
            }
        },

        createCollection: function() {},

        createViews: function() {},

        goBack: function() {
            this.navigate(this.removeLastDirFromUrl(Backbone.history.getFragment()), {
                trigger: true,
            });
        },

        removeLastDirFromUrl: function(url) {
            var regexpString = url.substr(url.lastIndexOf('/')) + '$';
            return url.replace(new RegExp(regexpString), '');
        },

    });

    var bookmarkRouter = new BookmarkRouter();
    Backbone.bookmarkRouter = bookmarkRouter;
    bookmarkRouter.on('route:default', function() {
        var currentRoutePath = Backbone.history.getFragment();
        if (currentRoutePath) {
            window.Backbone.trigger('change:browsecurrentpath', currentRoutePath);
        } else {
            this.navigate('root', {
                trigger: true
            });
        }
    });

    Backbone.history.start();
})(this, $ || jQuery);
