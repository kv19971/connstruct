import {progressbar} from 'meteor/ldk:bootstrap-progressbar';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '../../shared/filescollections.js';
import './upload.html';

/*Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return Images.find();
  }
});*/
$('.progress .progress-bar').progressbar(); 
Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      if (file) {
        var uploadInstance = Images.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          template.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
          if (error) {
            window.alert('Error during upload: ' + error.reason);
          } else {
            window.alert('File "' + fileObj.name + '" successfully uploaded');
            ViewModel.findOne('importcad').onUploaded();
          }
          template.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  }
});