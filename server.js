import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import {connectPassport} from './utils/Provider.js'
import session from 'express-session';

import Razorpay from 'razorpay';

import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import passport from 'passport';

import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

import cors from 'cors';

const app = express();

dotenv.config({
    path:"./config/.env",
});


export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
})


// Using Middlewares

app.use(session({
    name: "CookieName",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie:{
        secure: (process.env.NODE_ENV === "development") ? false : true,
        httpOnly: (process.env.NODE_ENV === "development") ? false : true,
        sameSite: (process.env.NODE_ENV === "development") ? false : "none",
    }
}));

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({extended: true}));

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET" , "POST" , "PUT" , "DELETE"],
}));

connectPassport();


app.use("/api/v1/" , userRoutes);
app.use("/api/v1/" , orderRoutes);

app.enable("trust proxy");

app.use(errorMiddleware);


mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log("Connected to db")})
.catch((error) => {console.log(error)})

app.listen(process.env.PORT , () => {
    console.log(`Listening on port ${process.env.PORT}... You are in ${process.env.NODE_ENV} mode`);
})