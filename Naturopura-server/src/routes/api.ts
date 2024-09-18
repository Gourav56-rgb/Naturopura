import { Router, Request, Response } from 'express';
import User from '../model/user.model';
import env from '../environment/environment';
import { adminLogin, adminSignup, userLogin, userSignup } from "../controller/auth";
import Joi from 'joi';
import ApiResponse from '../../helper/ApiResponse';

const router: Router = Router();

// Define a route for user registration
router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);
router.post('/admin/signup', adminSignup);
router.post('/admin/login', (req: Request, res: Response) => {
    const { signature, key } = req.body;
    const schema = Joi.object({
        signature: Joi.string().required(),
        key: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json(ApiResponse.error('Invalid input provided.', 'INVALID_INPUT', error.details));
    }
    try {
        const response = adminLogin(signature, key);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
});
export default router;