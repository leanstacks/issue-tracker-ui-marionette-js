IssueTrackerApp.module('Footer', function(Footer, IssueTrackerApp, Backbone, Marionette, $, _) {

  Footer.FooterView = Backbone.Marionette.ItemView.extend({
  
    className: 'container-fluid',
    template: 'footer'

  });
  
});
