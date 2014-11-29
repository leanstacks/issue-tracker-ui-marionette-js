IssueTrackerApp.module('IssueManager', function(IssueManager, IssueTrackerApp, Backbone, Marionette, $, _) {

  // Define the AppRouter for the IssueManager module
  var IssueManagerRouter = Marionette.AppRouter.extend({

    appRoutes: {
      'issues': 'list',
      'issues/:id': 'view'
    }

  });


  // Define the Controller for the IssueManager module
  var IssueManagerController = Marionette.Controller.extend({

    list: function(collection) {
      logger.debug("IssueManagerController.list");

      var displayListView = function(issueCollection) {
        var listView = new IssueManager.IssueListView({
          collection: issueCollection
        });

        // Handle 'issue:view' events triggered by Child Views
        listView.on('childview:issue:view', function(args) {
          logger.debug("Handling 'childview:issue:view' event");
          IssueTrackerApp.execute('issuemanager:view', args.model.get('id'), args.model, issueCollection);
        });

        // Handle 'issue:edit' events triggered by Child Views
        listView.on('childview:issue:edit', function(args) {
          logger.debug("Handling 'childview:issue:edit' event");
          IssueTrackerApp.execute('issuemanager:edit', args.model.get('id'), args.model, issueCollection);
        });

        // Handle 'issue:delete' events triggered by Child Views
        listView.on('childview:issue:delete', function(args) {
          logger.debug("Handling 'childview:issue:delete' event");
          var dialogView = new IssueTrackerApp.Common.DialogView({
            title: "Delete Issue?",
            body: "Click confirm to permanently delete this issue.",
            primary: "Confirm",
            secondary: "Cancel"
          });

          dialogView.on("primary", function() {
            logger.debug("Handling 'primary' dialog event");
            args.model.destroy();
            dialogView.triggerMethod('hide');
          });

          dialogView.on("secondary", function() {
            logger.debug("Handling 'secondary' dialog event");
            dialogView.triggerMethod('hide');
          });

          IssueTrackerApp.dialogRegion.show(dialogView);
        });

        logger.debug("Show IssueListView in IssueTrackerApp.mainRegion");
        IssueTrackerApp.mainRegion.show(listView);
      };

      if(collection) {
        displayListView(collection);
      } else {
        var fetchingIssues = IssueTrackerApp.request('issue:entities');
        $.when(fetchingIssues).done(function(issues) {
          displayListView(issues);
        });
      }
    },

    add: function() {
      logger.debug("IssueManagerController.add");
      var addIssueView = new IssueManager.IssueAddView();

      // Handle 'form:cancel' event
      addIssueView.on('form:cancel', function() {
        logger.debug("Handling 'form:cancel' event");
        IssueTrackerApp.execute('issuemanager:list');
      });

      // Handle 'form:submit' trigger
      addIssueView.on('form:submit', function(data) {
        logger.debug("Handling 'form:submit' event");
        logger.debug("form data:" + JSON.stringify(data));
        var issueModel = new IssueTrackerApp.Entities.Issue();
        if(issueModel.save(data,
          {
            success: function() {
              IssueTrackerApp.execute('issuemanager:view', issueModel.get('id'), issueModel);
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
    },

    edit: function(id, model, collection) {
      logger.debug("IssueManagerController.edit");

      var displayEditView = function(issueModel, issueCollection) {
        var editIssueView = new IssueManager.IssueEditView({
          model: issueModel
        });

        // Handle 'form:cancel' event
        editIssueView.on('form:cancel', function() {
          logger.debug("Handling 'form:cancel' event");
          IssueTrackerApp.execute('issuemanager:view', id, issueModel, issueCollection);
        });

        // Handle 'form:submit' event
        editIssueView.on('form:submit', function(data) {
          logger.debug("Handling 'form:submit' event");
          logger.debug("form data:" + JSON.stringify(data));
          if(issueModel.save(data,
            {
              success: function() {
                IssueTrackerApp.execute('issuemanager:view', id, issueModel, issueCollection);
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

        logger.debug("Show IssueEditView in IssueTrackerApp.mainRegion");
        IssueTrackerApp.mainRegion.show(editIssueView);
      };

      if(model) {
        displayEditView(model, collection);
      } else {
        var fetchingIssue = IssueTrackerApp.request('issue:entity', id);
        $.when(fetchingIssue).done(function(issue) {
          displayEditView(issue, collection);
        });
      }

    },

    view: function(id, model, collection) {
      logger.debug("IssueManagerController.view id:" + id);

      var displayView = function(issueModel, issueCollection) {
        var issueView = new IssueManager.IssueView({
          model: issueModel
        });

        issueView.on('issue:list', function(args) {
          logger.debug("Handling 'issue:list' event");
          IssueTrackerApp.execute('issuemanager:list', issueCollection);
        });

        issueView.on('issue:edit', function() {
          logger.debug("Handling 'issue:edit' event");
          IssueTrackerApp.execute('issuemanager:edit', issueModel.get('id'), issueModel, issueCollection);
        });

        logger.debug("Show IssueView in IssueTrackerApp.mainRegion");
        IssueTrackerApp.mainRegion.show(issueView);
      };

      if(model) {
        displayView(model, collection);
      } else {
        var fetchingIssue = IssueTrackerApp.request('issue:entity', id);
        $.when(fetchingIssue).done(function(issue) {
          displayView(issue, collection);
        });
      }
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
  IssueTrackerApp.commands.setHandler('issuemanager:list', function(collection) {
    logger.debug("Handling 'issuemanager:list' command");
    IssueTrackerApp.navigate('issues');
    controller.list(collection);
  });

  IssueTrackerApp.commands.setHandler('issuemanager:add', function() {
    logger.debug("Handling 'issuemanager:add' command");
    controller.add();
  });

  IssueTrackerApp.commands.setHandler('issuemanager:edit', function(id, model, collection) {
    logger.debug("Handling 'issuemanager:edit' command");
    controller.edit(id, model, collection);
  });

  IssueTrackerApp.commands.setHandler('issuemanager:view', function(id, model, collection) {
    logger.debug("Handling 'issuemanager:view' command");
    IssueTrackerApp.navigate('issues/' + id);
    controller.view(id, model, collection);
  });

});
