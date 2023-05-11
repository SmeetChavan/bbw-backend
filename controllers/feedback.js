import Feedback from "../models/Feedback.js";
import {asyncError} from "../middlewares/errorMiddleware.js";

export const postFeedback = asyncError(async (req , res , next) => {

    const {
        name,
        email,
        msg
    } = req.body;

    const user = req.user._id;

    const message = msg;

    const options = {
        name,
        email,
        message,
        user,
    };

    await Feedback.create(options);

    res.status(201).json({
        success: true,
        message: "Feedback noted",
    });
});