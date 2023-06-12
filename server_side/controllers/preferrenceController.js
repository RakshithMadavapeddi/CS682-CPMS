const Preference = require('../models/preferences');


exports.getPreferencesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("touched");
    const preferences = await Preference.find({ course: courseId }).populate('student').populate('projectPreferences.project');
    console.log(preferences);
    res.status(200).json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting preferences' });
  }
};

// Create a preference for a given course and user
exports.createPreference = async (req, res) => {
  const { course, projectPreferences } = req.body;
  const student = req.user._id;

  try {
    // Check if the preference already exists
    const existingPreference = await Preference.findOne({ course, student });
    if (existingPreference) {
      return res.status(400).json({ message: 'Preference already exists for this course and user' });
    }

    // Create the preference
    const preference = new Preference({ course, student, projectPreferences });
    const savedPreference = await preference.save();
    res.status(201).json(savedPreference);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updatePreference = async (req, res) => {
    try {
      const { course, projectPreferences } = req.body;
      const user = req.user._id;
  
      const preference = await Preference.findOneAndUpdate(
        { course, student: user },
        { $set: { projectPreferences } },
        { new: true, upsert: true }
      );
  
      res.status(200).json(preference);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

