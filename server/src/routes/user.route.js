import { Router } from 'express';
import {
  getUsers,
  getUsersByPhone,
  createUser,
  getUsersCount,
} from '../controllers/user.controller';

const router = Router();

router.get('/listUsers', getUsers);
router.get('/search', getUsersByPhone);
router.get('/count', getUsersCount);
router.post('/new', createUser);

export default router;
