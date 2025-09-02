import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Users from '../models/users';
import dotEnv from 'dotenv';
dotEnv.config();

declare module 'express-serve-static-core' {
	interface Request {
		user?:
			| {
					id: number;
					email: string;
					role: string;
			  }
			| JwtPayload;
	}
}

const { JWT_SECRET } = process.env;

export default async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

	const token = authHeader.split(' ')[1];
	if (!token) return res.status(401).json({ message: 'Unauthorized' });

	try {
		const decryptedData = jwt.verify(token, JWT_SECRET!) as {
			id: number;
			email: string;
			role: string;
		};

		const user = await Users.findByPk(decryptedData.id);
		if (!user)
			return res.status(401).json({ message: 'Invalid or expired token' });

		req.user = decryptedData;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Invalid or expired token' });
	}
};
