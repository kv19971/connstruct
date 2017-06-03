import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

var siteURLs = ['time', 'location', 'budget', 'importcad', 'preferences', 'show', 'summary'];
var buttonTexts = ['Proceed', 'Set location', 'Set budget', 'Import model', 'Set preferences', 'Proceed', 'Finish'];
var buttonText;

Template.mainLayout.viewmodel({
    state : 0,
    buttonText : null,
    onCreated() {
      this.buttonText(buttonTexts[this.state()])
    },
    nextPage : function(e){
        this.state(this.state() + 1);
        console.log(this.state())
        this.buttonText(buttonTexts[this.state()]);
        if(this.state() == buttonTexts.length){
            alert("Finished");
        }
        else{
            console.log("Routing!!");
            FlowRouter.go("/" + siteURLs[this.state()]);
        }
    }
})