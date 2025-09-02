import { Request, Response } from 'express';
import User from '../models/users';
import { UserStatus } from '../models/interfaces/user.interface';

export default {
	registerUser: async (req: Request, res: Response): Promise<Response> => {
		try {
			const userData = req.body;

			const existingUser = await User.findOne({
				where: { email: userData.email },
			});

			if (existingUser) {
				return res.status(409).json({ message: 'Email already exists' });
			}

			const newUser = await User.create(userData);
			res
				.status(201)
				.json({ message: 'User registered successfully', user: newUser });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},

	loginUser: async (req: Request, res: Response): Promise<Response> => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });

			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			if (user.status === UserStatus.BLOCKED) {
				return res.json({ message: 'Your account is already blocked' });
			}

			const isPasswordValid = await User.comparePassword(
				password,
				user.password
			);
			if (!isPasswordValid) {
				return res.status(401).json({ error: 'Invalid password' });
			}

			const token = User.createToken({
				id: user.id,
				email: user.email,
				role: user.role,
			});

			res.status(200).json({ message: 'Login successful', token });
		} catch (error) {
			res.status(500).json({ error: 'Login failed' });
		}
	},

	getMyProfile: async (req: Request, res: Response): Promise<Response> => {
		try {
			const userId = req.user.id;
			const user = await User.findByPk(userId);

			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			if (user.status === UserStatus.BLOCKED) {
				return res.json({ message: 'Your account is already blocked' });
			}

			return res.json({ message: 'Profile retrieved successfully', user });
		} catch (error) {
			res.status(500).json({ error: 'Failed to get profile' });
		}
	},

	blockMyAccount: async (req: Request, res: Response): Promise<Response> => {
		try {
			const userId = req.user.id;

			const user = await User.findByPk(userId);

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			if (user.status === UserStatus.BLOCKED) {
				return res.json({ message: 'Your account is already blocked' });
			}

			const [updated] = await User.update(
				{ status: UserStatus.BLOCKED },
				{ where: { id: userId } }
			);

			if (updated === 0) {
				return res
					.status(404)
					.json({ message: `User with id ${userId} not found` });
			}

			return res.json({ message: 'Your account has been blocked' });
		} catch (error) {
			res.status(500).json({ error: 'Failed to block account' });
		}
	},
};
