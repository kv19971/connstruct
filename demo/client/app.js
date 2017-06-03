/**
 * Created by kenta on 6/3/17.
 */
const links = ['/schedule', '/suppliers'];

Template.app.viewmodel({
    nextPage() {
        FlowRouter.go(links[(_.indexOf(links, FlowRouter.current().path) + 1) % links.length]);
    }
});
