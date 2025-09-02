import { Request, Response } from 'express';
import User from '../models/users';
import { UserStatus } from '../models/interfaces/user.interface';

export default {
	getUserById: async (req: Request, res: Response): Promise<Response> => {
		try {
			const { userId } = req.params;
			const user = await User.findByPk(Number(userId));

			if (!user) {
				return res
					.status(404)
					.json({ message: `User with id ${userId} not found` });
			}

			return res.json(user);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	},

	getAllUsers: async (_req: Request, res: Response): Promise<Response> => {
		try {
			const users = await User.findAll({
				order: [['id', 'DESC']],
			});

			if (!users || users.length === 0) {
				return res.status(404).json({ message: 'No users found' });
			}

			return res.json(users);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	},

	blockUser: async (req: Request, res: Response): Promise<Response> => {
		try {
			const { userId } = req.params;

			const existBlocked = await User.findByPk(Number(userId));

			if (!existBlocked) {
				return res
					.status(404)
					.json({ message: `User with id ${userId} not found` });
			}

			if (existBlocked.status === UserStatus.BLOCKED) {
				return res.json({ message: 'User is already blocked' });
			}

			const [updated] = await User.update(
				{ status: UserStatus.BLOCKED },
				{ where: { id: Number(userId) } }
			);

			if (updated === 0) {
				return res
					.status(404)
					.json({ message: `User with id ${userId} not found` });
			}

			return res.json({ message: `User ${userId} has been blocked` });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	},
};
