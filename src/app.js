import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import AuthRouter from "./routes/auth.routes.js";
import AdminRouter from "./routes/userInfo.routes.js";
import userRouter from "./routes/getAllInfo.routes.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join(process.cwd(), 'src', 'uploads')));

// Routes
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/admin', AdminRouter);
app.use('/api/v1/user', userRouter);


export default app;
