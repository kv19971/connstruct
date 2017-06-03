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
FlowRouter.route('/showmodel', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "showmodel"});
  }
});
FlowRouter.route('/showmaterials/:m', {
    action: function(params) {
        BlazeLayout.render("mainLayout", {content: "showmaterials", params: FlowRouter.getParam("m")});
    }
});