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

        logger.debug("Show IssueListView in IssueTrackerApp.mainRegion");
        IssueTrackerApp.mainRegion.show(listView);
      });
    },

    add: function(issueCollection) {
      logger.debug("IssueManagerController.add");
      var addIssueView = new IssueManager.IssueAddView();

      // Handle 'form:submit' trigger
      addIssueView.on('form:submit', function(data) {
        logger.debug("handling 'form:submit' trigger");
        logger.debug("data:"+JSON.stringify(data));
        var issueModel = new IssueTrackerApp.Entities.Issue();
        if(issueModel.save(data, 
          { 
            success: function() {
              controller.list();
            },
            error: function() {
              alert('An unexpected problem has occurred.');
            }
          })
         ) {
          // validation successful
        } else {
          // handle validation errors
          addIssueView.triggerMethod('form:validation:failed', issueModel.validationError);
        }
      });
      logger.debug("Show IssueAddView in IssueTrackerApp.mainRegion");
      IssueTrackerApp.mainRegion.show(addIssueView);
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
    logger.debug("Handling 'issuemanager:list' command");
    IssueTrackerApp.navigate('issues');
    controller.list();
  });
  
  IssueTrackerApp.commands.setHandler('issuemanager:add', function() {
    logger.debug("Handling 'issuemanager:add' command");
    controller.add();
  });
  
});

