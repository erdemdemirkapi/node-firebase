import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getUsers, getUserDetails } from '../controllers/userController';

const router = express.Router();

router.get('/', authenticateJWT, getUsers);
router.get('/:id', authenticateJWT, getUserDetails);

export default router;
