IssueTrackerApp.module('IssueManager', function(IssueManager, IssueTrackerApp, Backbone, Marionette, $, _) {

  // Define the View for an empty List of Issues
  IssueManager.IssueListEmptyView = Backbone.Marionette.ItemView.extend({

    tagName: 'tr',

    template: 'issuelistempty'

  });

  // Define the View for a single Issue in the List
  IssueManager.IssueListItemView = Backbone.Marionette.ItemView.extend({

    tagName: 'tr',

    template: 'issuelistitem',

    modelEvents: {
      'change': 'render'
    },

    triggers: {
      'click .js-view': 'issue:view',
      'click .js-edit': 'issue:edit',
      'click .js-delete': 'issue:delete'
    }

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
      'click @ui.createButton': 'onCreateClicked'
    },

    triggers: {
      'click @ui.cancelButton': 'form:cancel'
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


  // Define the View for Editing an Issue
  IssueManager.IssueEditView = Backbone.Marionette.ItemView.extend({

    className: 'container-fluid',

    template: 'issueedit',

    ui: {
      updateButton: 'button.js-update',
      cancelButton: 'button.js-cancel'
    },

    events: {
      'click @ui.updateButton': 'onUpdateClicked',
    },

    triggers: {
      'click @ui.cancelButton': 'form:cancel'
    },

    onUpdateClicked: function(e) {
      logger.debug("IssueEditView.onUpdateClicked");
      e.preventDefault();
      this.showProcessingState();
      var data = Backbone.Syphon.serialize(this);
      this.trigger('form:submit', data);
    },

    showProcessingState: function() {
      var spinnerContent = '<i class="fa fa-circle-o-notch fa-spin"></i> ';
      this.ui.updateButton.button('loading');
      this.ui.updateButton.prepend(spinnerContent);
    },

    hideProcessingState: function() {
      this.ui.updateButton.button('reset');
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


  // Define the View for a Single Issue
  IssueManager.IssueView = Backbone.Marionette.ItemView.extend({

    className: 'container-fluid',

    template: 'issueview',

    triggers: {
      'click .js-list': 'issue:list',
      'click .js-edit': 'issue:edit'
    }

  });

});
