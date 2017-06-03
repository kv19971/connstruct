import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './showmaterials.html';
Template.showmaterials.helpers({
    material : function(){
        return FlowRouter.getParam("m");
    }
})

