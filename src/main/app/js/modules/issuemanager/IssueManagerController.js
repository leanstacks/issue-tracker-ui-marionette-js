IssueTrackerApp.module('IssueManager', function(IssueManager, IssueTrackerApp, Backbone, Marionette, $, _) {

  // Define the AppRouter for the IssueManager module
  var IssueManagerRouter = Marionette.AppRouter.extend({

    appRoutes: {
      'issues': 'list'
    }

  });


  // Define the Controller for the IssueManager module
  var IssueManagerController = Marionette.Controller.extend({

    list: function() {
      logger.debug("IssueManagerController.list");
      var fetchingIssues = IssueTrackerApp.request('issue:entities');
      $.when(fetchingIssues).done(function(issues) {
        var listView = new IssueManager.IssueListView({
          collection: issues
        });
        IssueTrackerApp.mainRegion.show(listView);
      });
    }

  });


  // Create an instance
  var controller = new IssueManagerController();


  // When the module is initialized...
  IssueManager.addInitializer(function() {
    logger.debug("IssueManager initializer");
    var router = new IssueManagerRouter({
      controller: controller
    });
  });


  // Handle application commands...
  IssueTrackerApp.commands.setHandler('issuemanager:list', function() {
    logger.debug("Handling 'issues:list' command");
    IssueTrackerApp.navigate('issues');
    controller.list();
  });
  
});

