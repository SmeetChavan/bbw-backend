import { asyncError } from "../middlewares/errorMiddleware.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const myProfile = (req , res , next) => {

    res.status(200).send({
        success : true,
        user : (req.user) ? req.user : "not logged in",
    });
};

export const logout = (req , res , next) => {

    req.session.destroy((err) => {

        if(err) return next(err);

        // res.clearCookie('CookieName');
        res.clearCookie("cookie.sid" , {
            secure: false,
            httpOnly: false,
            sameSite: false,
        });

        res.status(200).json({
            message: "Logged Out",
        })

    });
}

export const getAllUsers = asyncError(async (req , res , next) => {

    const users = await User.find({});

    res.status(200).json({
        success: true,
        users,
    })
});

export const getAllStats = asyncError(async (req , res , next) => {

    const usersCount = await User.countDocuments();

    const orders = await Order.find({});

    const preparingOrders = orders.filter((i) => i.orderStatus === "Preparing");
    const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
    const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");

    let totalIncome = 0;
    orders.forEach((i) => {
        totalIncome += i.totalAmount;
    })

    res.status(200).json({
        success: true,
        usersCount,
        ordersCount: {
            total: orders.length,
            preparing: preparingOrders.length,
            shipped: shippedOrders.length,
            delivered: deliveredOrders.length,
        },
        totalIncome,
    })
});