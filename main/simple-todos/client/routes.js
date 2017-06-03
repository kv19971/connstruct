FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "home"});
  }
});
FlowRouter.route('/time', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "time"});
    }
});
FlowRouter.route('/location', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "myLocation"});
    }
});
FlowRouter.route('/budget', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "budget"});
    }
});
FlowRouter.route('/importcad', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "importcad"});
  }    
});
FlowRouter.route('/preferences', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "preferences"});
  }
});
FlowRouter.route('/show/', {
    action: function(params) {
        BlazeLayout.render("mainLayout", {content: "show"});
    }
});
FlowRouter.route('/summary/', {
    action: function(params) {
        BlazeLayout.render("mainLayout", {content: "summary"});
    }
});