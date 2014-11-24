IssueTrackerApp.module('Entities', function(Entities, IssueTrackerApp, Backbone, Marionette, $, _) {

  // Define the Model for an Issue entity
  Entities.Issue = Backbone.Model.extend({

    urlRoot: 'http://localhost:8080/issues',

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


  // Define a Collection of Issue entities
  Entities.IssueCollection = Backbone.Collection.extend({

    model: Entities.Issue,

    url: 'http://localhost:8080/issues'

  });


  // Define the Controller for the Issue Entity
  var IssueEntityController = Marionette.Controller.extend({

    getIssue: function(issueId) {
      logger.debug("IssueEntityController.getIssue");
      var issue = new Entities.Issue({ id: issueId });
      var defer = $.Deferred();
      issue.fetch({
        success: function(data) {
          defer.resolve(data);
        }
      });
      return defer.promise();
    },

    getIssues: function() {
      logger.debug("IssueEntityController.getIssues");
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

  // Create an instance
  var issueController = new IssueEntityController();


  // Handle request for an Issue Model
  IssueTrackerApp.reqres.setHandler('issue:entity', function(id) {
    logger.debug("Handling 'issue:entity' request");
    return issueController.getIssue(id);
  });

  // Handle request for a Collection of Issue Entities
  IssueTrackerApp.reqres.setHandler('issue:entities', function() {
    logger.debug("Handling 'issue:entities' request");
    return issueController.getIssues();
  });

});
