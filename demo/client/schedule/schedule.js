/**
 * Created by kenta on 6/3/17.
 */

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
           minDate: new Date()
       });
   }
});