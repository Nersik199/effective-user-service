import { Router } from 'express';
import adminControllers from '../controllers/controllers.admin';
import checkToken from '../middlewares/checkToken';
import checkRole from '../middlewares/checkRole';

const router = Router();

router.get(
	'/users/:userId',
	checkToken,
	checkRole,
	adminControllers.getUserById
);

router.get('/users', checkToken, checkRole, adminControllers.getAllUsers);

router.patch(
	'/:userId/block',
	checkToken,
	checkRole,
	adminControllers.blockUser
);

export default router;
