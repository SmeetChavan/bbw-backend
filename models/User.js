import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: String,
    photo: String,

    googleId:{
        type: String,
        required: true,
        unique: true,
    },

    role:{
        type: String,
        enum: ["admin" , "user"],
        default: "user",
    },

} , {timestamps: true});

const User = mongoose.model('User' , userSchema);

export default User;