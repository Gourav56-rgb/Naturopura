// import { Request, Response } from "express";
// import validator from "validatorjs";
// import Joi from "joi";
import bcryptjs from "bcryptjs";
const saltRounds = 10;
import User from "../model/user.model";
import env from "../environment/environment";
// import { createErrorResponse,createSuccessResponse } from "../utility/helper/helper";
import { publishUserRegisteredEvent } from "../event/event";
import jwt from "jsonwebtoken";
import ApiResponse from "../../helper/ApiResponse";
import { ResponseDefinitions } from "../responses";

// const salt = bcryptjs.genSaltSync(10)

export const userSignup = async (
  firstName: any,
  lastName: any,
  email: any,
  signature: any,
  key: any,
  address: any,
  isRemember: any,
  id: any
) => {
  try {
    // Check if user already exists with the given key
    const user = await User.findOne({
      key: key,
      deletedAt: { $eq: null },
    });

    if (user) {
      return ApiResponse.error(
        "You have already signed up, please try logging in.",
        "USER_ALREADY_EXISTS"
      );
    } else {
      let hashPass: string = "";

      // Generate salt and hash password
      bcryptjs
        .genSalt(saltRounds)
        .then((salt: string) => {
          return bcryptjs.hash(signature, salt);
        })
        .then(async (hash: string) => {
          // Create a new user instance
          const customer = new User({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            role: "consumer",
            email: email.toLowerCase(),
            signature: hash,
            key: key,
            walletAddress: address,
            id: id,
          });

          // Save the user in the database
          await customer.save();

          // Construct response object for the newly created user
          const newCustomer = {
            isActive: customer.isActive,
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            role: customer.role,
            email: customer.email,
          };

          // Return success response
          return ApiResponse.success("Successfully registered.", {
            createSuccessResponse: "Successfully registered.",
            token: isRemember
              ? jwt.sign(
                  newCustomer,
                  process.env.TOKEN_SECRET || env.TOKEN_SECRET,
                  { expiresIn: "48h" }
                )
              : "",
            ...newCustomer,
            expiresIn: "48h",
          });
        })
        .catch((err: any) => {
          console.error(err.message);
          return ApiResponse.error(
            "Error while hashing password.",
            "HASH_ERROR"
          );
        });
    }
  } catch (error) {
    // Catch and return any unexpected errors
    return ApiResponse.error(
      "An internal server error occurred.",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export const userLogin = async (signature: any, key: any) => {
  // const { signature, key } = req.body;

  try {
    const user = await User.findOne({
      key: key,
      deletedAt: { $eq: null },
      isActive: 1,
    });

    if (!user) {
      return ApiResponse.error("Please signup first.", "USER_NOT_EXIST");
    }

    bcryptjs.compare(signature, user.signature).then((resData: boolean) => {
      if (resData) {
        const newCustomer = {
          isActive: user.isActive,
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          email: user.email,
        };
        return ApiResponse.success(
          "Successfully logged in.",
          {
            token: jwt.sign(newCustomer, env.TOKEN_SECRET, {
              expiresIn: "48h",
            }),
            ...newCustomer,
            expiresIn: "48h",
          },
          "USER_LOGIN_SUCCESS"
        );
      } else {
        return ApiResponse.error(
          "Signature does not match.",
          "SIGNATURE_NOT_MATCH"
        );
      }
    });
  } catch (error) {
    return ApiResponse.error(
      "An internal server error occurred.",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export const adminLogin = async (signature: any, key: any) => {
  // const { signature, key } = req.body;

  try {
    const user = await User.findOne({
      key,
      deletedAt: { $eq: null },
      isActive: 1,
    });
    console.log("userModel", user);
    

    if (!user) {
      return ApiResponse.error("Please signup first.", "USER_NOT_EXIST");
    }

    if (user.role === "consumer") {
      return ApiResponse.error(
        "You are not authorized for this endpoint.",
        "USER_NOT_AUTHORIZED"
      );
    }
    console.log("Original Signature:", signature);
    console.log("Hashed Signature:", user.signature);
     
    return await bcryptjs
      .compare(signature, user.signature)
      .then((resData: boolean) => {
        console.log("resData", resData);
        
        if (resData) {
          const newCustomer = {
            isActive: user.isActive,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
          };
          console.log("newCustomer", newCustomer);
          

          const successResponse =  ApiResponse.success(
            ResponseDefinitions.OperationSuccessful.message,
            {
              createSuccessResponse: "Successfully logged in.",
              token: jwt.sign(newCustomer, env.TOKEN_SECRET, {
                expiresIn: "48h",
              }),
              ...newCustomer,
              expiresIn: "48h",
            },
            ResponseDefinitions.OperationSuccessful.code
          );
          console.log("successResponse", successResponse);
          return successResponse
          
        } else {
          const errorResponse = ApiResponse.error(
            "Signature does not match.",
            "SIGNATURE_NOT_MATCH"
          );
          console.log("errorResponse", errorResponse);
          return errorResponse
          
        }
      });
  } catch (error) {
    return ApiResponse.error(
      ResponseDefinitions.NotFound.message,
      ResponseDefinitions.NotFound.code
    );
  }
};

export const adminSignup = async (
  firstName: any,
  lastName: any,
  role: any,
  email: any,
  phone: any,
  isActive: any,
  key: any,
  signature: any,
  walletAddress: any,
  isRemember: any,
  dialingCode: any,
  addressLine: any,
  country: any,
  state: any,
  city: any,
  zipCode: any
) => {
  try {
    const user = await User.findOne({
      email,
      deletedAt: { $eq: null },
    });
    // console.log("user:", user);

    if (user) {
      return ApiResponse.error(
        ResponseDefinitions.InvalidInput.message,
        ResponseDefinitions.InvalidInput.code
      );
    } else if (
      !signature ||
      typeof signature !== "string" ||
      signature.trim() === ""
    ) {
      return ApiResponse.error(
        "Invalid signature provided.",
        "SIGNATURE_ERROR"
      );
    } else 

    // console.log("Signature:", signature);
    // console.log("Key:", key);

    return await bcryptjs
      .genSalt(saltRounds)
      .then(async (salt: string) => {
        console.log("Generated Salt:", salt);
        // console.log(bcryptjs.hash(signature, salt), "Hashed");

        const hashedToken = await bcryptjs.hash(signature, salt);
        // console.log("hashedToken", hashedToken);
        return hashedToken;
      })
      .then(async (hashedToken) => {
        // console.log("Hashed Signature:", hashedToken);
        const customer = new User({
          firstName,
          lastName,
          role,
          email,
          signature: hashedToken,
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
        });
        // console.log(signature, "signature");
        // console.log(hashedToken, "hashedToken");
        
        
        // console.log(customer, "customer");

        await customer.save();

        // publishUserRegisteredEvent({
        //   user_id: customer._id,
        //   dialingCode,
        //   phone,
        //   addressLine,
        //   country,
        //   state,
        //   city,
        //   zipCode,
        // });

        const newCustomer = {
          firstName: customer.firstName,
          lastName: customer.lastName,
          role: customer.role,
          email: customer.email,
          signature: customer.signature,
          isActive: customer.isActive,
          isRemember: customer.isRemember,
          key: customer.key,
          dialingCode: customer.dialingCode,
          phone: customer.phone,
          addressLine: customer.addressLine,
          country: customer.country,
          state: customer.state,
          city: customer.city,
          zipCode: customer.zipCode,
          walletAddress: customer.walletAddress,
        };
        // console.log(newCustomer, "newCustomer");

        const responseSuccess = ApiResponse.success(
          ResponseDefinitions.OperationSuccessful.message,
          {
            createSuccessResponse: "Successfully registered.",
            token: isRemember
              ? jwt.sign(newCustomer, env.TOKEN_SECRET, { expiresIn: "48h" })
              : "",
            ...newCustomer,
            expiresIn: "48h",
          },
          ResponseDefinitions.OperationSuccessful.code
        );

        // console.log("responseSuccess:", responseSuccess);

        return responseSuccess
        // console.log("Response ***")
      })
      .catch((err: any) => {
        console.log(err, "console");
        return ApiResponse.error("Error while hashing password.", "HASH_ERROR");
      });

  } catch (error) {
    const responseError = ApiResponse.error(
      ResponseDefinitions.NotFound.message,
      ResponseDefinitions.NotFound.code
    );
    // console.log("responseError", responseError);
    
    console.error("responseError", error);
    
    return responseError
  }
};

// export const adminSignup = async (req: Request, res: Response) => {
//   try {
//       const {firstName,
//           lastName,
//           role,
//           email,
//           signature,
//           isActive,
//           isRemember,
//           key,
//           dialingCode,
//           phone,
//           addressLine,
//           country,
//           state,
//           city,
//           zipCode,
//           walletAddress} = req.body

//       const user = await User.findOne({
//           email,
//           deletedAt: { $eq: null },
//         }).lean();

//       if (user) {
//     return ApiResponse.error(
//       ResponseDefinitions.InvalidInput.message,
//       ResponseDefinitions.InvalidInput.code
//     );
//   }
  
//           const salt = await bcryptjs.genSalt(saltRounds)
  
//           const hashedSignature = bcryptjs.hash(signature, salt);

//           const customer = new User({
//               firstName,
//               lastName,
//               role,
//               email,
//               signature: hashedSignature,
//               isActive,
//               isRemember,
//               key,
//               dialingCode,
//               phone,
//               addressLine,
//               country,
//               state,
//               city,
//               zipCode,
//               walletAddress,
//             });

//             await customer.save();

//             const newCustomer = {
//               firstName: customer.firstName,
//               lastName: customer.lastName,
//               role: customer.role,
//               email: customer.email,
//               signature: customer.signature,
//               isActive: customer.isActive,
//               isRemember: customer.isRemember,
//               key: customer.key,
//               dialingCode: customer.dialingCode,
//               phone: customer.phone,
//               addressLine: customer.addressLine,
//               country: customer.country,
//               state: customer.state,
//               city: customer.city,
//               zipCode: customer.zipCode,
//               walletAddress: customer.walletAddress,
//             };

//             return ApiResponse.success(
//               ResponseDefinitions.OperationSuccessful.message,
//               {
//                 createSuccessResponse: "Successfully registered.",
//                 token: isRemember
//                   ? jwt.sign(newCustomer, env.TOKEN_SECRET, { expiresIn: "48h" })
//                   : "",
//                 ...newCustomer,
//                 expiresIn: "48h",
//               },
//               ResponseDefinitions.OperationSuccessful.code
//             );

//   } catch (error) {
//       const responseError = ApiResponse.error(
//           ResponseDefinitions.NotFound.message,
//           ResponseDefinitions.NotFound.code
//         );
//         console.error("responseError", error);
        
//         return responseError 
//   }
  
// }