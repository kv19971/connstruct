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
FlowRouter.route("/importcad", {
    action: function() {
        BlazeLayout.render("app", {content: "importcad"});
    }
})

FlowRouter.route('/suppliers', {
    action: function() {
        BlazeLayout.render("app", {content: "suppliers"});
    }
})

FlowRouter.route('/forecast', {
    action: function() {
        BlazeLayout.render("app", {content: "forecast"});
    }
})