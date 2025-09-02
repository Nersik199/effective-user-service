import Joi from 'joi';

export const registerSchema = Joi.object({
	fullName: Joi.string().min(3).required().messages({
		'any.required': 'Full name is required',
		'string.min': 'Full name must be at least 3 characters',
		'string.empty': 'Full name cannot be empty',
	}),
	email: Joi.string().email().required().messages({
		'any.required': 'Email is required',
		'string.email': 'Email must be valid',
		'string.empty': 'Email cannot be empty',
	}),
	password: Joi.string().min(6).required().messages({
		'any.required': 'Password is required',
		'string.min': 'Password must be at least 6 characters',
		'string.empty': 'Password cannot be empty',
	}),
	birthDate: Joi.date().iso().required().messages({
		'any.required': 'Birth date is required',
		'date.format': 'Birth date must be in ISO format',
	}),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'any.required': 'Email is required',
		'string.email': 'Email must be valid',
		'string.empty': 'Email cannot be empty',
	}),
	password: Joi.string().min(6).required().messages({
		'any.required': 'Password is required',
		'string.min': 'Password must be at least 6 characters',
		'string.empty': 'Password cannot be empty',
	}),
});
