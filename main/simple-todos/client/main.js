import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var state;
var siteURLs;
var buttonTexts;
var buttonText;

Template.mainLayout.viewmodel({
    state : 0,
    siteURLs : ['time', 'myLocation', 'budget', 'importcad', 'showmodel', 'showmaterials'],
    buttonTexts : ['Set location', 'Set budget', 'Import model', 'View model', 'Show materials', 'Finish'],
    buttonText : buttonTexts[state],
    nextPage : function(e){
        buttonText = buttonTexts[state];
        state = state + 1;
        if(state == 6){
            alert("Finished");
        }
        else{
            Console.log("Routing!!");
            FlowRouter.go("/" + siteURLs[state]);
        }
    }
})