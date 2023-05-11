import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({

    name: String,
    email: String,
    message: String,
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },

} , {timestamps: true});

const Feedback = mongoose.model("Feedback" , feedbackSchema);

export default Feedback;