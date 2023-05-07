import express from 'express';
import passport from 'passport';
import { getAllStats, getAllUsers, logout, myProfile } from '../controllers/user.js';
import { isAdmin, isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.get("/" , (req , res)=> {
    res.send("Hello");
})

router.get("/googlelogin" , passport.authenticate("google" , {
    scope: ["profile"],
}))

router.get("/login" , passport.authenticate("google") , (req , res , next) => {
    res.status(200).send("Logged In");
})

router.get("/me" , isAuthenticated , myProfile)

router.get("/logout" , logout);

router.get("/admin/users" , isAuthenticated , isAdmin , getAllUsers);
router.get("/admin/stats" , isAuthenticated , isAdmin , getAllStats);

export default router;