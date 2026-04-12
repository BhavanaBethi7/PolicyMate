const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true
    },

    // Personal Details
    name: String,
    age: String,
    gender: String,
    category: String,

    // Location
    state: String,
    placeOfBirth: String,
    locationType: String,

    // Education
    educationLevel: String,
    course: String,
    passingYear: String,

    // Career Preferences
    preferredSector: [String],
    otherSector: String,
    lookingFor: [String],

    // Financial
    income: String,
    incomeCertificate: String,
    parentOccupation: String,
    firstGraduate: String,

    // Metadata
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Profile", profileSchema);