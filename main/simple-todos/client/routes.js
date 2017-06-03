FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "home"});
  }
});
FlowRouter.route('/info', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "info"});
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