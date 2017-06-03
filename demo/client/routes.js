FlowRouter.route("/", {
    action: function() {
        BlazeLayout.render("app", {content: "home"});
    }
})

FlowRouter.route("/schedule", {
    action: function() {
        BlazeLayout.render("app", {content: "schedule"});
    }
})