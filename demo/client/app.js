/**
 * Created by kenta on 6/3/17.
 */
const links = ['/schedule', '/importcad', '/suppliers'];

Template.app.viewmodel({
    nextPage() {
        let els = $("#ui-fluid-stackable").find(".step");
        els.each(function(){
            $(this).removeClass("active");
            $( this ).addClass( "disabled" );
        });
        els.eq((_.indexOf(links, FlowRouter.current().path) + 1) % links.length).addClass("active");
        FlowRouter.go(links[(_.indexOf(links, FlowRouter.current().path) + 1) % links.length]);
    }
});
