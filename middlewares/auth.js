import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = (req , res , next) => {

    const token = req.cookies['cookiename'];

    if(!token){
        return next(new ErrorHandler("Not Logged In" , 400));
    }

    if(!req.user){
        return res.status(406).json({
            success: false,
            message: "Please log in",
        });
    }

    next();
};

export const isAdmin = (req , res , next) => {

    if(req.user.role !== 'admin'){
        return next(new ErrorHandler("Only Admin Allowed" , 405));
    }
    next();
}