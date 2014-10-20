IssueTrackerApp.module('Footer', function(Footer, IssueTrackerApp, Backbone, Marionette, $, _) {

  // Define the Controller for the Footer module
  var FooterController = Marionette.Controller.extend({

    show: function() {
      logger.debug("FooterController.show");
      var footerView = new Footer.FooterView();
      IssueTrackerApp.footerRegion.show(footerView);
    }

  });

  // Create an instance
  var controller = new FooterController();

  // When the module is initialized...
  Footer.addInitializer(function() {
    logger.debug("Footer initializer");
    controller.show();
  });

});
