import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(() => {
  Meteor.call('materials.get', ['HE450B','IPE270','IPE330'], 0.001, 39.768377, -86.158042, 
  1, 99999999999999, (err, res) =>
  {
    if (err) {
      alert(err);
    } else {
     console.log(res);
    }
  })
  Meteor.call('future.get', ['HE450B','IPE160','IPE330'], 0.001, 39.768377, -86.158042, 
  1, 99999999999999, 1, Date.now(), (err, res) =>
  {
    if (err) {
      alert(err);
    } else {
     console.log(res);
    }
  })
})