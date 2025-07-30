import { Router } from 'express';
import { signup, login, getCurrentUser } from '../controllers/auth.js';
import { updateUser, getUserById, searchUsers } from '../controllers/user.js'; 
import auth from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/current', auth, getCurrentUser); 
router.get('/:id', getUserById);          
router.put('/:id', auth, updateUser);     
router.get('/search', searchUsers); 

export default router;