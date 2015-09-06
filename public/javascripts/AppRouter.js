(function(root, $) {

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

        createCollection: function() {
            this.collection || (this.collection = {});
            this.collection.browseItemCollection = new ItemCollection();
            this.collection.moveItemCollection = new ItemCollection();
        },

        createViews: function() {
            this.view || (this.view = {});

            /**
             * Contruct Views for Browsing
             */
            var type = 'browse';
            this.view.itemDetailsModalView = new ItemDetailsModalView({
                collection: this.collection.browseItemCollection,
                type: type,
            });
            this.view.moveItemModalView = new MoveItemModalView();
            this.createFolderViews(type);

            /**
             * Contruct Views for Moving
             */
            type = 'move';
            this.createFolderViews(type);
        },

        /**
         * Create Folder Views
         */
        createFolderViews: function(type) {
            this.view[type + 'FileExplorerToolbarView'] = new FileExplorerToolbarView({
                el: '#file-explorer-toolbar-' + type,
                type: type,
            });
            this.view[type + 'ItemListView'] = new ItemListView({
                el: '#file-explorer-' + type + ' #file-explorer-ul',
                collection: this.collection[type + 'ItemCollection'],
                type: type,
            });
        },

        /**
         * Goes back from current path
         */
        goBack: function() {
            this.navigate(this.removeLastDirFromUrl(Backbone.history.getFragment()), {
                trigger: true,
            });
        },

        removeLastDirFromUrl: function(url) {
            var indexOfSlash = url.lastIndexOf('/'),
                resultString = '';
            if (indexOfSlash !== -1) {
                var regexpString = url.substr(indexOfSlash) + '$';
                resultString = url.replace(new RegExp(regexpString), '');
            } else {
                resultString = url;
            }
            return resultString;
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

    window.Backbone.trigger('change:selectmode', 'single');

    Backbone.history.start();
})(this, $ || jQuery);
