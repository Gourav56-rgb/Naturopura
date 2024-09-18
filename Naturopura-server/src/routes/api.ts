import { Router, Request, Response } from 'express';
import User from '../model/user.model';
import env from '../environment/environment';
import { adminLogin, adminSignup, userLogin, userSignup } from "../controller/auth";

const router: Router = Router();

// Define a route for user registration
router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);
router.post('/admin/signup', adminSignup);
router.post('/admin/login', adminLogin);
export default router;