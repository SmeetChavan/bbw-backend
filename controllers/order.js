import Order from "../models/Order.js";
import {Payment} from "../models/Payment.js";
import {asyncError} from "../middlewares/errorMiddleware.js";
import ErrorHandler from "../utils/ErrorHandler.js";

import { instance } from "../server.js";
import crypto from "crypto";

export const placeOrder = asyncError(

    async (req , res , next) => {

        const {
            shippingInfo,
            paymentMethod,
            orderItems, 
            itemsPrice,
            taxPrice, 
            shippingCharges,
            totalAmount

        } = req.body;

        const user = req.user._id;

        const orderOptions = {
            shippingInfo,
            paymentMethod,
            orderItems, 
            itemsPrice,
            taxPrice, 
            shippingCharges, 
            totalAmount,
            user
        };

        if(paymentMethod === "Online"){

            const options = {
                amount: Number(totalAmount) * 100,
                currency: "INR"
            }
            const order = await instance.orders.create(options);

            return res.status(201).json({
                success: true,
                order,
                orderOptions,
            });
        }

        await Order.create(orderOptions);

        res.status(201).json({
            success: true,
            message: "Order placed successfully via Cash On Delivery",
        });
    }
)

export const paymentVerification = asyncError(async (req , res , next) => {

    const {razorpay_order_id , razorpay_payment_id , razorpay_signature , orderOptions} = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac("sha256" , process.env.RAZORPAY_API_SECRET).update(body).digest("hex");

    if(expectedSignature === razorpay_signature){

        const payment = await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        await Order.create({
            ...orderOptions,
            paymentInfo: payment._id,
            paidAt: new Date(Date.now()),
        });

        res.status(201).json({
            success: true,
            message: `Order Placed Successfully. Payment ID: ${payment._id}`,
        });
    }
    else{
        return next(new ErrorHandler("Payment Failed!" , 400));
    }
});

export const getMyOrders = asyncError(async (req , res , next) => {

    const orders = await Order.find({
        user: req.user._id,
    }).sort({createdAt : -1}).populate('user' , 'name');

    res.status(200).json({
        success: true,
        orders,
    })
});

export const getAdminOrders = asyncError(async (req , res , next) => {

    const orders = await Order.find({}).sort({createdAt : -1}).populate("user" , "name");

    res.status(200).json({
        success: true,
        orders,
    });
});

export const processOrder = asyncError(async (req , res , next) => {

    const order = await Order.findById(req.params.id);

    if(!order) return next(new ErrorHandler("Invalid Order ID" , 404));

    if(order.orderStatus === "Preparing") order.orderStatus = "Shipped";
    else if(order.orderStatus === "Shipped"){

        order.orderStatus = "Delivered";
        order.deliveredDate = new Date(Date.now());
    }
    else if(order.orderStatus === "Delivered") return next(new ErrorHandler("Food already delivered" , 400));

    await order.save();

    res.status(200).json({
        success: true,
        message: "Status updated successfully",
    })
});

export const getOrderDetails = asyncError(async (req , res , next) => {

    const order = await Order.findById(req.params.id).populate('user' , 'name');

    if(!order) return next(new ErrorHandler("Invalid Order ID" , 404));

    res.status(200).json({
        success: true,
        order,
    });
})