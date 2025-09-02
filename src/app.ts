import './migration';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotEnv from 'dotenv';
import userRoutes from './routes/users';
import adminRouters from './routes/admin';
dotEnv.config();

const app = express();

app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/admin', adminRouters);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
