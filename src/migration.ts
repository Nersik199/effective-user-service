import User from './models/users';
const models = [User];

(async () => {
	for (const model of models) {
		await model.sync({ alter: true });
		console.log(model.name, 'synced');
	}
})();
