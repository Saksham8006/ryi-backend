const mongoose = require('mongoose');

const FormData = new mongoose.Schema(
  {
    educationRatings: {
      type: String,
    },
    infrastructureRatings: {
      type: String,
    },
    facultyRatings: {
      type: String,
    },
    locationRatings: {
      type: String,
    },
    joiningYear: {
      type: String,
    },
    email: {
      type: String,
    },
    course: {
      type: String,
    },
    otherEntranceExamValue: {
      type: String,
    },
    experience: {
      type: Object,
    },
    instiName: {
      type: String,
    },
    instiLocation: {
      type: String,
    },
    paragraph: {
      type: String,
    },
    average: {
      type: Number,
    },
    createdOn: {
      type: Date,
      default: Date.now, // Set the default value to the current date and time
    },
    status: {
      type: String,
    },
  },
  { collection: 'rmi-form' }
);

const model = mongoose.model('FormData', FormData);

module.exports = model;
