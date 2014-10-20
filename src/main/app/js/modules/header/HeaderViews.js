IssueTrackerApp.module('Header', function(Header, IssueTrackerApp, Backbone, Marionette, $, _) {
  
  Header.NavBarView = Backbone.Marionette.ItemView.extend({
  
    template: 'navbar'
    
  });

});

