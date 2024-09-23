import { Router, Request, Response } from "express";
// import User from "../model/user.model";
// import env from "../environment/environment";
import {
  adminLogin,
  adminSignup,
  userLogin,
  userSignup,
} from "../controller/auth";
import Joi from "joi";
import ApiResponse from "../../helper/ApiResponse";
import { ResponseDefinitions } from "../responses";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// import env from "../environment/environment";

const router: Router = Router();

// Define a route for user registration
router.post("/user/signup", (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    signature,
    key,
    address,
    isRemember,
    id,
  } = req.body;

  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    signature: Joi.string().required(),
    key: Joi.string().required(),
    address: Joi.string().required(),
    isRemember: Joi.boolean().required(),
    id: Joi.number().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json(
        ApiResponse.error(
          ResponseDefinitions.InvalidInput.message,
          ResponseDefinitions.InvalidInput.code,
          error.details
        )
      );
  }
  try {
    const response = userSignup(
      firstName,
      lastName,
      email,
      signature,
      key,
      address,
      isRemember,
      id
    );
    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
  }
});

router.post("/user/login", (req: Request, res: Response) => {
  const { signature, key } = req.body;

  const schema = Joi.object({
    signature: Joi.string().required(),
    key: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json(
        ApiResponse.error(
          ResponseDefinitions.InvalidInput.message,
          ResponseDefinitions.InvalidInput.code,
          error.details
        )
      );
  }
  try {
    const response = userLogin(signature, key);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
});

router.post("/admin/signup", async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    role,
    email,
    signature,
    isActive,
    isRemember,
    key,
    dialingCode,
    phone,
    addressLine,
    country,
    state,
    city,
    zipCode,
    walletAddress,
    // id,
  } = req.body;
  // console.log(req.body, "Request Body");
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    signature: Joi.string().required(),
    key: Joi.string().required(),
    isRemember: Joi.boolean().truthy('true').falsy('false'),
    isActive: Joi.boolean().truthy('true').falsy('false'),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    dialingCode: Joi.string().min(2).required(),
    phone: Joi.string().required(),
    walletAddress: Joi.string().required(),
    addressLine: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    // image: Joi.string(),
    zipCode: Joi.string().required(),
    // id: Joi.number().required(),
    role: Joi.string()
      .valid(
        "admin",
        "consumer",
        "farmer",
        "distributors",
        "consultant",
        "agricultural_chemicals",
        "equipment_manufacturers",
        "marketing_agencies",
        "insurance",
        "cold-storage"
      )
      .required(),
  });
  // console.log(schema, "00000000000000");
  
  const { error } = schema.validate(req.body);
  // console.log(error, "111111111111111");
  // console.log(error, "Validation Error");
  // console.log(schema.validate(req.body), "SchemaValidation");
  
  if (error) {
    return res
      .status(400)
      .json(
        ApiResponse.error(
          ResponseDefinitions.InvalidInput.message,
          ResponseDefinitions.InvalidInput.code,
          error.details
        )
      );
      // console.log(resp, "3737373737373");
  }
  try {
    const response = await adminSignup(
      firstName,
      lastName,
      role,
      email,
      phone,
      isActive,
      key,
      signature,
      walletAddress,
      isRemember,
      dialingCode,
      addressLine,
      country,
      state,
      city,
      zipCode
      // id
    );

    // const token = isRemember ? jwt.sign(response, env.TOKEN_SECRET, {
    //   expiresIn: "48h",
    // }) : "";

    // res.cookie("token", token, {
    //   httpOnly: true, // Prevents client-side JS from accessing the cookie
    //   secure: true, // Only use HTTPS in production
    //   maxAge: 48 * 60 * 60 * 1000, // 48 hours
    // });
    
    // console.log(response, ">>>>>>>>>>>>>");
    // console.log(key, "090909090909");
    // console.log(signature, "77777777777");

    return res.status(201).json(response);
  } catch (error) {
    // console.log(error, "66666666666");
    console.error("Signup Error:", error);
    return res.status(500).json(ApiResponse.error(
      ResponseDefinitions.NotFound.message,
      ResponseDefinitions.NotFound.code
    ));
  }
});

router.post("/admin/login", async (req: Request, res: Response) => {
  const { signature, key } = req.body;
  console.log("reqBody:", req.body);
  
  const schema = Joi.object({
    signature: Joi.string().required(),
    key: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  console.log("error", error);
  console.log("Schema Validation:", schema.validate(req.body));
  

  if (error) {
    return res
      .status(400)
      .json(
        ApiResponse.error(
          ResponseDefinitions.InvalidInput.message,
          ResponseDefinitions.InvalidInput.code,
          error.details
        )
      );
  }
  try {
    const response = await adminLogin(signature, key);
    console.log(response);

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
});



export default router;
