Template.preferences.viewmodel({
    onRendered(){
        console.log(FlowRouter.current().route)
        this.parent().state(5);
    }
})