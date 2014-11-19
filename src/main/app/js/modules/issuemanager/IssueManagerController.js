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
        var layoutView = new IssueManager.IssueListLayoutView();
        var listView = new IssueManager.IssueListView({
          collection: issues
        });

        // Handle 'issue:edit' events triggered by Child Views
        listView.on('childview:issue:edit', function(args) {
          logger.debug("Handling 'childview:issue:edit' trigger");
          var editIssueView = new IssueManager.IssueEditView({
            model: args.model
          });

          // Handle 'form:cancel' event
          editIssueView.on('form:cancel', function() {
            logger.debug("Handling 'form:cancel' event");
            logger.debug("Show IssueListView in IssueListLayoutView.listRegion");
            layoutView.itemRegion.empty();
            listView.visible(true);
          });
          
          // Handle 'form:submit' event
          editIssueView.on('form:submit', function(data) {
            logger.debug("Handling 'form:submit' trigger");
            logger.debug("form data:"+JSON.stringify(data));
            var issueModel = args.model;
            if(issueModel.save(data, 
              { 
                success: function() {
                  logger.debug("Show IssueListView in IssueListLayoutView.listRegion");
                  layoutView.itemRegion.empty();
                  listView.visible(true);
                },
                error: function() {
                  alert('An unexpected problem has occurred.');
                }
              })
             ) {
              // validation successful
            } else {
              // handle validation errors
              editIssueView.triggerMethod('form:validation:failed', issueModel.validationError);
            }
          });

          logger.debug("Show IssueEditView in IssueListLayoutView.itemRegion");
          listView.visible(false);
          layoutView.itemRegion.show(editIssueView);
        });

        // Show the List View when the Layout is Shown
        layoutView.on("show", function() {
          layoutView.listRegion.show(listView);
        });

        logger.debug("Show IssueListLayoutView in IssueTrackerApp.mainRegion");
        IssueTrackerApp.mainRegion.show(layoutView);
      });
    },

    add: function(issueCollection) {
      logger.debug("IssueManagerController.add");
      var addIssueView = new IssueManager.IssueAddView();

      // Handle 'form:submit' trigger
      addIssueView.on('form:submit', function(data) {
        logger.debug("Handling 'form:submit' trigger");
        logger.debug("form data:"+JSON.stringify(data));
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

