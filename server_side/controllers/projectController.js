const Project = require("../models/projects");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, ".." , "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

exports.createProject = async (req, res, next) => {
  upload.single("file") (req, res, async function (err) {
    if (err){
      return res.status(500).json({error: "Internal Server error"});
    }
    try {
      const {
        name,
        description,
        administrators,
        deadline,
        skills,
        resources,
      } = req.body;
      const createdBy = req.user.email;
      const pending = req.user.role === "ADMIN" ? false : true;

      // Create new project instance
      const newProject = new Project({
        name,
        description,
        fileUrl: req.file.filename,
        administrators,
        deadline,
        skills,
        resources,
        createdBy,
        pending,
      });

      // Save new project to the database
      await newProject.save();

      return res.status(201).json(newProject);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  });
};

exports.getProjects = async (req, res) => {
  try {
    const {pending} = req.query;
    if (req.user.role !== "ADMIN") {
        const projects = await Project.find({createdBy: req.user.email}).sort({ createdAt: -1 });
        return res.status(200).json(projects);
    }
    if (pending === 'true') {
      const projects = await Project.find({pending:true}).sort({ createdAt: -1 });
      return res.status(200).json(projects);
    } else if (pending === 'false') {
      const projects = await Project.find({pending:false}).sort({ createdAt: -1 });
      return res.status(200).json(projects);
    } else {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json(projects);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

exports.getProjectPdf = async (req, res) => {
    try {
      const { _id } = req.params;
      const project = await Project.findById(_id);
      const {pdf} = req.query;

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      if (pdf === "false") {
        return res.status(200).json(project);
      }
      const filePath = path.resolve(__dirname, "..", "..","uploads", project.fileUrl);
      return res.download(filePath);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
};

exports.getProjectsCreatedByClient = async (req, res) => {
  const payload = req.user;

  try {
    const projects = await Project.find({createdBy: payload.email});
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({error: "internal server error"});
  }
}

exports.deleteProject = async (req, res) => {
    try {
      const projectId = req.params._id;

      if (req.user.role === "CLIENT") {
        return res.status(401).json({error: "Unauthorized to access"});
      }
      // Find the project to delete
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      // Remove the PDF file from the uploads folder
      fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', project.fileUrl));
  
      // Delete the project from the database
      await Project.findByIdAndDelete(projectId);
  
      return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
};

exports.approveProject = async (req, res) => {
  try {
    const projectId = req.params._id;

    // Find the project to delete
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete the project from the database
    await Project.findByIdAndUpdate(projectId, {pending: false});

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};



