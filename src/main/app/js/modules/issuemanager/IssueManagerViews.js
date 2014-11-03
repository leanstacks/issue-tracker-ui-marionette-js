IssueTrackerApp.module('IssueManager', function(IssueManager, IssueTrackerApp, Backbone, Marionette, $, _) {
  
  // Define the View for an empty List of Issues
  IssueManager.IssueListEmptyView = Backbone.Marionette.ItemView.extend({
  
    tagName: 'tr',

    template: 'issuelistempty'
    
  });

  // Define the View for a single Issue in the List
  IssueManager.IssueListItemView = Backbone.Marionette.ItemView.extend({
  
    tagName: 'tr',

    template: 'issuelistitem'
    
  });

  // Define the View for a List of Issues
  IssueManager.IssueListView = Backbone.Marionette.CompositeView.extend({
  
    emptyView: IssueManager.IssueListEmptyView,

    childView: IssueManager.IssueListItemView,

    childViewContainer: 'tbody',

    className: 'container-fluid',

    template: 'issuelist'
    
  });

});

