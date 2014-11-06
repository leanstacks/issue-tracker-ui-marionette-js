IssueTrackerApp.module('Header', function(Header, IssueTrackerApp, Backbone, Marionette, $, _) {
  
  Header.NavBarView = Backbone.Marionette.ItemView.extend({
  
    template: 'navbar',

    ui: {
      'navigation': '.js-nav'
    },

    events: {
      'click @ui.navigation': 'onNavigationClicked'
    },

    onNavigationClicked: function(e) {
      e.preventDefault();
      var commandName = $(e.target).attr('data-nav-target');
      IssueTrackerApp.execute(commandName);
    }
    
  });

});

