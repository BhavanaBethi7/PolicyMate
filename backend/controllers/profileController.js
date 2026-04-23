const Profile = require("../models/Profile");

// Get user profile
const getProfile = async (req, res) => {
  try {
    console.log("=== GET PROFILE START ===");
    const userId = req.user.id;
    console.log("Getting profile for user:", userId);
    console.log("Step 1: User ID extracted");

    console.log("Step 2: About to query Profile.findOne");
    const profile = await Profile.findOne({ userId });
    console.log("Step 3: Profile query completed");
    console.log("Profile result:", profile);

    if (!profile) {
      console.log("Step 4: No profile found, returning null");
      return res.status(200).json({
        success: true,
        profile: null,
        message: "No profile found"
      });
    }

    console.log("Step 5: Profile found, preparing response");
    const response = {
      success: true,
      profile
    };
    console.log("Step 6: Response prepared:", response);
    
    res.status(200).json(response);
    console.log("Step 7: Response sent");
  } catch (error) {
    console.error("Get profile error:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message
    });
  }
};

// Save or update user profile
const saveProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    console.log("Saving profile for user:", userId);
    console.log("Profile data:", profileData);

    // Remove system fields
    delete profileData._id;
    delete profileData.__v;
    delete profileData.userId;
    delete profileData.createdAt;
    delete profileData.updatedAt;

    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update existing profile
      console.log("Updating existing profile:", profile._id);
      Object.assign(profile, profileData);
      await profile.save();
      console.log("Profile updated successfully");
    } else {
      // Create new profile
      console.log("Creating new profile");
      profile = new Profile({
        userId,
        ...profileData
      });
      await profile.save();
      console.log("Profile created successfully:", profile._id);
    }

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      profile
    });
  } catch (error) {
    console.error("Save profile error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error saving profile",
      error: error.message
    });
  }
};

// Delete user profile
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    await Profile.findOneAndDelete({ userId });

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });
  } catch (error) {
    console.error("Delete profile error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting profile",
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  saveProfile,
  deleteProfile
};