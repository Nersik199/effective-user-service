import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	if (req.user.role.toLowerCase() !== 'admin') {
		return res.status(403).json({ message: 'Forbidden: Admins only' });
	}

	next();
};
