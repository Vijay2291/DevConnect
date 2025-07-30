import Project from '../models/Project.js';
import User from '../models/User.js'; 
import Comment from '../models/Comment.js'; 

export const createProject = async (req, res) => {
  const { title, description, imageUrl, projectUrl } = req.body;
  try {
    const project = await Project.create({
      title,
      description,
      imageUrl,
      projectUrl,
      userId: req.userId 
    });
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: 'Failed to create project', details: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('userId', 'name avatar username')
      .populate({
        path: 'comments',
        select: '_id content userId createdAt',
        populate: { path: 'userId', select: 'name avatar username' } 
      })
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
};

export const getProjectsByUser = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId })
      .populate('userId', 'name username avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ message: 'Failed to fetch user projects', details: error.message });
  }
};

export const createComment = async (req, res) => {
  const { id: projectId } = req.params; 
  const { content } = req.body;
  const userId = req.userId; 

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required." });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Comment content cannot be empty." });
  }
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User not identified." });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const comment = await Comment.create({ content, projectId, userId });
    project.comments.push(comment._id);
    await project.save();
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'name avatar username');
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ message: 'Failed to post comment', error: err.message });
  }
};


export const searchProjects = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(200).json([]); 

  try {
    const projects = await Project.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
      .populate('userId', 'name username avatar')
      .limit(10); 

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error searching projects:", error);
    res.status(500).json({ message: 'Search failed', details: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('userId', 'name avatar username') 
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'name avatar username' } 
      });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error("Error fetching project by ID:", err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

