/**
 * Created by kenta on 6/3/17.
 */
import { Session } from 'meteor/session'
import "air-datepicker"
import "air-datepicker/dist/css/datepicker.css";

$.fn.datepicker.language['en'] = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'mm/dd/yyyy',
    timeFormat: 'hh:ii aa',
    firstDay: 0
};

Template.schedule.viewmodel({
   onRendered() {
       $(".deadline-picker").datepicker({
           language: 'en',
           range: true,
           multipleDatesSeparator: ' to ',
           clearButton: true,
           minDate: new Date(),
           onSelect: function(dateText) { 
                Session.set("deadline", dateText); 
            }
       });

       $('#quality-slider').ionRangeSlider({
           min: 0,
           max: 100,
           grid: true,
           onChange: function(data){
               Session.set("quality", data.from);
           },
           onFinish: function(data){
               Session.set("quality", data.from);
           }
       });

       $('#budget-slider').ionRangeSlider({
           min: 10,
           max: 1000000000,
           grid: true
       });
       $("#budget-input").on('change', function(e){
           Session.set("budget", parseFloat($(this).val()));
       });
   }
});