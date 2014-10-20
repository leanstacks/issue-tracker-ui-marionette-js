IssueTrackerApp.module('Header', function(Header, IssueTrackerApp, Backbone, Marionette, $, _) {

  // Define the Controller for the Header module
  var HeaderController = Marionette.Controller.extend({

    show: function() {
      logger.debug("HeaderController.show");
      var navBarView = new Header.NavBarView();
      IssueTrackerApp.headerRegion.show(navBarView);
    }

  });

  // Create an instance
  var controller = new HeaderController();
  
  // When the module is initialized...
  Header.addInitializer(function() {
    logger.debug("Header initializer");
    controller.show();
  });
  
});

