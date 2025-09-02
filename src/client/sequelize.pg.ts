import dotEnv from 'dotenv';

import { Sequelize } from 'sequelize';

dotEnv.config();
const {
	POSTGRES_HOST,
	POSTGRES_PORT,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_DB,
} = process.env;

const sequelize = new Sequelize(
	POSTGRES_DB!,
	POSTGRES_USER!,
	POSTGRES_PASSWORD!,
	{
		host: POSTGRES_HOST,
		port: Number(POSTGRES_PORT),
		dialect: 'postgres',
		logging: false,
	}
);

(async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (err) {
		console.error('Unable to connect to the database:', err);
	}
})();

export default sequelize;
