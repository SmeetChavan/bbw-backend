import Feedback from "../models/Feedback.js";
import {asyncError} from "../middlewares/errorMiddleware.js";

export const postFeedback = asyncError(async (req , res , next) => {

    const {
        name,
        email,
        msg
    } = req.body;

    const user = req.user._id;

    await Feedback.create({name , email , message: msg , user});

    res.status(205).json({
        success: true,
        message: "Feedback noted",
    });
});