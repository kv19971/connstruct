/**
 * Created by kenta on 6/3/17.
 */
const links = ['/schedule', '/importcad', '/suppliers', '/forecast'];

Template.app.viewmodel({
    activeStep(stepIndex) {
FlowRouter.watchPathChange();
        return stepIndex == _.indexOf(links, FlowRouter.current().path) ? 'active' : 'disabled';
    },
    nextPage() {
        FlowRouter.go(links[(_.indexOf(links, FlowRouter.current().path) + 1) % links.length]);
    }
});
 