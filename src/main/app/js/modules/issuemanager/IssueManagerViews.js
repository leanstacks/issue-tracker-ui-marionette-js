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

  // Define the View for Adding an Issue
  IssueManager.IssueAddView = Backbone.Marionette.ItemView.extend({

    className: 'container-fluid',

    template: 'issueadd',
    
    ui: {
      createButton: 'button.js-create',
      cancelButton: 'button.js-cancel'
    },

    events: {
      'click @ui.createButton': 'onCreateClicked',
      'click @ui.cancelButton': 'onCancelClicked'
    },

    onCancelClicked: function(e) {
      logger.debug("IssueAddView.onCancelClicked");
      e.preventDefault();
      IssueTrackerApp.execute('issuemanager:list');
    },

    onCreateClicked: function(e) {
      logger.debug("IssueAddView.onCreateClicked");
      e.preventDefault();
      this.showProcessingState();
      var data = Backbone.Syphon.serialize(this);
      this.trigger('form:submit', data);
    },

    showProcessingState: function() {
      var spinnerContent = '<i class="fa fa-circle-o-notch fa-spin"></i> ';
      this.ui.createButton.button('loading');
      this.ui.createButton.prepend(spinnerContent);
    },

    hideProcessingState: function() {
      this.ui.createButton.button('reset');
    },

    onFormValidationFailed: function(errors) {
      this.hideProcessingState();
      this.hideFormErrors();
      _.each(errors, this.showFormError, this);
    },

    showFormError: function(errorMessage, fieldKey) {
      var $formControl = this.$el.find('[name="'+fieldKey+'"]');
      var $controlGroup = $formControl.parents('.form-group');
      var errorContent = '<span class="help-block js-form-error">'+errorMessage+'</span>';
      $formControl.after(errorContent);
      $controlGroup.addClass('has-error');
    },

    hideFormErrors: function() {
      this.$el.find('.js-form-error').each(function() {
        $(this).remove();
      });
      this.$el.find('.form-group.has-error').each(function() {
        $(this).removeClass('has-error');
      });
    }
  
  });


});

