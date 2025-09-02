export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}
export enum UserStatus {
	ACTIVE = 'active',
	BLOCKED = 'blocked',
}

export interface UserAttributes {
	id: number;
	fullName: string;
	birthDate: Date;
	email: string;
	role: UserRole;
	status: UserStatus;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
}
