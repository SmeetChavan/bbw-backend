import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = (req , res , next) => {

    const token = req.cookies['cookiename'];

    if(token){
        return next();
    }
    return next(new ErrorHandler("Not Logged In" , 469));
}

export const isAdmin = (req , res , next) => {

    if(req.user.role !== 'admin'){
        return next(new ErrorHandler("Only Admin Allowed" , 405));
    }
    next();
}