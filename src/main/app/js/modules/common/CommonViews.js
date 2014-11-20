IssueTrackerApp.module('Common', function(Common, IssueTrackerApp, Backbone, Marionette, $, _) {

  // Define the View for a Modal Dialog Box
  Common.DialogView = Backbone.Marionette.ItemView.extend({
  
    className: 'modal fade',

    template: 'dialog',

    triggers: {
      'click .js-primary': 'primary',
      'click .js-secondary': 'secondary'
    },

    serializeData: function() {
      return this.options;
    },

    onShow: function() {
      this.$el.modal('show');
    },

    onHide: function() {
      this.$el.modal('hide');
    }
    
  });

});

