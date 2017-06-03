import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.mainLayout.viewmodel({
    state : 0,
    sites : ['info', 'time', 'budget', 'importcad'],
    x : "pushMyButtons",
    nextPage : function(e){
        alert("jews");
        FlowRouter.go("/info");
    }
})