import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    shippingInfo:{

        locality: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
    },

    orderItems : {

        cheeseBurger: {
            price:{
                type: Number,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        },
        vegCheeseBurger: {
            price:{
                type: Number,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        },
        burgerWithFries: {
            price:{
                type: Number,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        },
    },

    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },

    paymentMethod: {
        type: String,
        enum: ["COD" , "Online"],
        default: "COD",
    },

    paymentInfo: {
        type: mongoose.Types.ObjectId,
        ref: "Payment",
    },

    paidAt: Date,

    itemsPrice: {
        type: Number,
        default: 0,
    },
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingCharges: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },

    orderStatus: {
        type: String,
        enum: ["Preparing" , "Shipped" , "Delivered"],
        default: "Preparing",
    },

    deliveredDate: Date

} , {timestamps: true});

const Order = mongoose.model("Order" , orderSchema);

export default Order;