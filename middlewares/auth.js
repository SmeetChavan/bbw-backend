import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = (req , res , next) => {

    const token = req.cookies['cookiename'];

    if(!token){
        console.log("No cookie found");
        return next(new ErrorHandler("Not Logged In" , 469));
    }

    console.log(token);

    next();
}

export const isAdmin = (req , res , next) => {

    if(req.user.role !== 'admin'){
        console.log("No admin");
        return next(new ErrorHandler("Only Admin Allowed" , 405));
    }

    next();
}