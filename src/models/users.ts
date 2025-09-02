import { DataTypes, Model } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../client/sequelize.pg';
import {
	UserAttributes,
	UserRole,
	UserStatus,
} from './interfaces/user.interface';

const { JWT_SECRET } = process.env;

class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number;
	public fullName!: string;
	public email!: string;
	public password!: string;
	public role: UserRole;
	public birthDate!: Date;
	public status!: UserStatus;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	static hashPassword(password: string) {
		const salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(password, salt);
	}

	static async comparePassword(password: string, hash: string) {
		return bcrypt.compare(password, hash);
	}

	static createToken(payload: { id: number; email: string; role: string }) {
		return jwt.sign(payload, JWT_SECRET!, { expiresIn: '30d' });
	}
}

User.init(
	{
		id: {
			type: DataTypes.BIGINT,
			autoIncrement: true,
			primaryKey: true,
		},
		fullName: {
			type: new DataTypes.STRING(128),
			allowNull: false,
			field: 'full_name',
		},
		birthDate: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'birth_date',
		},
		role: {
			type: DataTypes.ENUM(...Object.values(UserRole)),
			allowNull: false,
			defaultValue: UserRole.USER,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(UserStatus)),
			allowNull: false,
			defaultValue: UserStatus.ACTIVE,
		},
		email: {
			type: new DataTypes.STRING(128),
			allowNull: false,
			unique: true,
		},
		password: {
			type: new DataTypes.STRING(128),
			allowNull: false,

			set(value: string) {
				this.setDataValue('password', User.hashPassword(value));
			},
		},
	},
	{
		tableName: 'users',
		sequelize,
		underscored: true,
	}
);

export default User;
