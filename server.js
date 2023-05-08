import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import {connectPassport} from './utils/Provider.js'
// import session from 'express-session';
import cookieSession from 'cookie-session';

import Razorpay from 'razorpay';

import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import passport from 'passport';

import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

import cors from 'cors';

mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log("Connected to db")})
.catch((error) => {console.log(error)})


const app = express();
// app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({extended: true}));

dotenv.config({
    path:"./config/.env",
});


export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
})


// Using Middlewares

// app.use(session({
//     name: 'cookiename',
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,

//     cookie:{
//         secure: false,
//         httpOnly: false,
//         sameSite: false,
//     }
// }));

app.use(cookieSession({
    name: 'cookiename',
    secret: process.env.COOKIE_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false,
    httpOnly: false,
    sameSite: false,
}));




app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET" , "POST" , "PUT" , "DELETE"],
}));


app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");

connectPassport();

app.get("/", (req, res, next) => {
    res.send("<h1>Working</h1>");
});

app.use("/api/v1" , userRoutes);
app.use("/api/v1" , orderRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT , () => {
    console.log(`Listening on port ${process.env.PORT}... You are in ${process.env.NODE_ENV} mode`);
})