import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

type Target = 'body' | 'query' | 'params';

export default (schema: ObjectSchema, target: Target) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const data = req[target];

		if (!data || Object.keys(data).length === 0) {
			const requiredFields = Object.keys(schema.describe().keys);
			const fields: Record<string, string> = {};
			requiredFields.forEach(f => {
				fields[f] = `${f} is required`;
			});

			return res.status(422).json({
				message: 'Validation error',
				fields,
			});
		}

		const { error } = schema.validate(data, { abortEarly: false });

		if (error) {
			const fields: Record<string, string> = {};
			error.details.forEach(detail => {
				fields[detail.path[0]] = detail.message;
			});

			return res.status(422).json({
				message: 'Validation error',
				fields,
			});
		}

		next();
	};
};
