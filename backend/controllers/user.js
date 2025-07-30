import User from '../models/User.js';
import mongoose from 'mongoose'; 

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); 
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, bio, avatar } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { name, bio, avatar } }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: 'Update failed', details: err.message });
  }
};


export const searchUsers = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(200).json([]); 

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ]
    }).limit(10); 

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: 'Search failed', details: error.message });
  }
};