import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const signup = async (req, res) => {
  const { username, email, password, name } = req.body;
  try {
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email or username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name
    });
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ result: newUser.toObject(), token }); 
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Something went wrong during signup', details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ result: existingUser.toObject(), token }); 
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Something went wrong during login', details: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }
  try {
    const user = await User.findById(req.userId).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: 'Failed to fetch current user', details: error.message });
  }
};