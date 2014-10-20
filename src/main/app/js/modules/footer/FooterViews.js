IssueTrackerApp.module('Footer', function(Footer, IssueTrackerApp, Backbone, Marionette, $, _) {

  Footer.FooterView = Backbone.Marionette.ItemView.extend({
  
    tagName: 'div',
    className: 'container-fluid',
    template: 'footer'

  });
  
});
