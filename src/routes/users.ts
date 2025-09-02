import { Router } from 'express';
import usersControllers from '../controllers/controllers.users';
import validate from '../middlewares/validate';
import { registerSchema, loginSchema } from '../Schema/userSchemas';

import checkToken from '../middlewares/checkToken';

const router = Router();

router.post(
	'/register',
	validate(registerSchema, 'body'),
	usersControllers.registerUser
);

router.post(
	'/login',
	validate(loginSchema, 'body'),
	usersControllers.loginUser
);

router.get('/profile', checkToken, usersControllers.getMyProfile);

router.patch('/profile/block', checkToken, usersControllers.blockMyAccount);

export default router;
