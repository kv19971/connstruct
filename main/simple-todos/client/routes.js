FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "home"});
  }
});
FlowRouter.route('/fuckall', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "hello"});
  }
});