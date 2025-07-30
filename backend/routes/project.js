import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectsByUser,
  searchProjects,
  createComment, 
  getProjectById
} from '../controllers/project.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, createProject); 
router.get('/', getProjects);
router.get('/user/:userId', getProjectsByUser);
router.get('/search', searchProjects);
router.post('/:id/comments', auth, createComment); 
router.get('/:id', getProjectById);

export default router;