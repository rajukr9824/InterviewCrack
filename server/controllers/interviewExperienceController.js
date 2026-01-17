const InterviewExperience = require("../models/InterviewExperience");

// Add interview experience
const addInterviewExperience = async (req, res) => {
  try {
    const { companyName, role, rounds, description, difficulty } = req.body;

    if (!companyName || !role || !rounds || !description || !difficulty) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const experience = await InterviewExperience.create({
      user: req.userId,
      companyName,
      role,
      rounds,
      description,
      difficulty,
    });

    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all / filter by company
// Get all / filter by company (WITH PAGINATION)
const getInterviewExperiences = async (req, res) => {
  try {
    const { company } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = company
      ? { companyName: { $regex: company, $options: "i" } }
      : {};

    const totalItems = await InterviewExperience.countDocuments(filter);

    const experiences = await InterviewExperience.find(filter)
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: experiences,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Get logged-in user's experiences
const getMyInterviewExperiences = async (req, res) => {
  try {
    const experiences = await InterviewExperience.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update experience (owner only)
const updateInterviewExperience = async (req, res) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Not found" });
    }

    if (experience.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await InterviewExperience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete experience (owner only)
const deleteInterviewExperience = async (req, res) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Not found" });
    }

    if (experience.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await experience.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
 addInterviewExperience,
  getInterviewExperiences,
  getMyInterviewExperiences,
  updateInterviewExperience,
  deleteInterviewExperience,
};
