IssueTrackerApp.module('Entities', function(Entities, IssueTrackerApp, Backbone, Marionette, $, _) {

  Entities.Issue = Backbone.Model.extend({

    defaults: {
      status: 'OPEN'
    },

    validate: function(attrs, options) {
      var errors = {};
      if (!attrs.title) {
        errors.title = 'Title is required.';
      }
      if (!attrs.description) {
        errors.description = 'Description is required.';
      }
      if (!attrs.type) {
        errors.type = 'Type is required.';
      }
      if (!attrs.priority) {
        errors.priority = 'Priority is required.';
      }
      if (! _.isEmpty(errors)) {
        return errors;
      }
    }
  
  });


  Entities.IssueCollection = Backbone.Collection.extend({

    model: Entities.Issue,
    
    url: 'http://localhost:8080/issues'
  
  });
  
  
  var EntitiesController = Marionette.Controller.extend({

    getIssues: function() {
      logger.debug("EntitiesController.getIssues");
      var issues = new Entities.IssueCollection();
      var defer = $.Deferred();
      issues.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      return defer.promise();
    }
    
  });

  var controller = new EntitiesController();

  
  IssueTrackerApp.reqres.setHandler('issue:entities', function() {
    logger.debug("received 'issue:entities' request");
    return controller.getIssues();
  });
  
});

