import { Request, Response } from "express";
import validator from "validatorjs";
import Joi from "joi";
import bcryptjs from "bcryptjs";
const saltRounds = 10;
import User from "../model/user.model";
import env from "../environment/environment";
// import { createErrorResponse,createSuccessResponse } from "../utility/helper/helper";
import { publishUserRegisteredEvent } from "../event/event";
import jwt from "jsonwebtoken";

export const userSignup = async (req: Request, res: Response) => {
  try {
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

    const { error, value } = schema.validate(req.body);

    console.log(error, ">>>>>>>>>>>>>>>>>>>");

    if (error) {
      return res.status(400).json({
        createErrorResponse: "INVALID_INPUT",
        message: "Invalid input provided.",
      });
    } else {
      const user = await User.findOne({
        key: key,
        deletedAt: { $eq: null },
      });

      if (user) {
        return res.status(400).json({
          createErrorResponse: "USER_ALREADY_EXISTS",
          message: "You have already signed up, please try logging in.",
        });
      } else {
        let hashPass: string = "";
        bcryptjs
          .genSalt(saltRounds)
          .then((salt: string) => {
            return bcryptjs.hash(signature, salt);
          })
          .then(async (hash: string) => {
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

            console.log(">>>>>>>>>>>createErrorResponse");

            await customer.save();
            // console.log(customer);

            const newCustomer = {
              isActive: customer.isActive,
              id: customer.id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              role: customer.role,
              email: customer.email,
            };

            console.log(newCustomer);

            return res.status(201).json({
              createSuccessResponse: "Successfully registered.",
              token: isRemember
                ? jwt.sign(newCustomer, env.TOKEN_SECRET, { expiresIn: "48h" })
                : "",
              ...newCustomer,
              expiresIn: "48h",
            });
          })
          .catch((err: any) => {
            console.error(err.message);
            return res.status(500).json({
              createErrorResponse: "HASH_ERROR",
              message: "Error while hashing password.",
            });
          });
      }
    }
  } catch (error) {
    return res.status(500).json({
      createErrorResponse: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { signature, key } = req.body;

  try {
    const schema = Joi.object({
      signature: Joi.string().required(),
      key: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        createErrorResponse: "INVALID_INPUT",
        message: "Invalid input provided.",
      });
    } else {
      const user = await User.findOne({
        key: key,
        deletedAt: { $eq: null },
        isActive: 1,
      });

      if (!user) {
        return res.status(400).json({
          createErrorResponse: "USER_NOT_EXIST",
          message: "Please signup first.",
        });
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

          return res.status(201).json({
            createSuccessResponse: "Successfully logged in.",
            token: jwt.sign(newCustomer, env.TOKEN_SECRET, {
              expiresIn: "48h",
            }),
            ...newCustomer,
            expiresIn: "48h",
          });
        } else {
          return res.status(400).json({
            createErrorResponse: "SIGNATURE_NOT_MATCH",
            message: "Signature does not match.",
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      createErrorResponse: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred.",
    });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  const { signature, key } = req.body;

  try {
    const schema = Joi.object({
      signature: Joi.string().required(),
      key: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        createErrorResponse: "INVALID_INPUT",
        message: "Invalid input provided.",
        details: error.details,
      });
    }

    const user = await User.findOne({
      key: key,
      deletedAt: { $eq: null },
      isActive: 1,
    });

    if (!user) {
      return res.status(400).json({
        createErrorResponse: "USER_NOT_EXIST",
        message: "Please signup first.",
      });
    }

    if (user.role === "consumer") {
      return res.status(401).json({
        createErrorResponse: "USER_NOT_AUTHORIZED",
        message: "You are not authorized for this endpoint.",
      });
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

        return res.status(201).json({
          createSuccessResponse: "Successfully logged in.",
          token: jwt.sign(newCustomer, env.TOKEN_SECRET, {
            expiresIn: "48h",
          }),
          ...newCustomer,
          expiresIn: "48h",
        });
      } else {
        return res.status(400).json({
          createErrorResponse: "SIGNATURE_NOT_MATCH",
          message: "Signature does not match.",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      createErrorResponse: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred.",
    });
  }
};

export const adminSignup = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      isRemember,
      signature,
      key,
      address,
      dialingCode,
      phone,
      addressLine1,
      country,
      state,
      city,
      zipCode,
      type,
      id
    } = req.body;

    const schema = Joi.object({
      firstName: Joi.string().min(3).max(30).required(),
      lastName: Joi.string().min(3).max(30).required(),
      signature: Joi.string().required(),
      key: Joi.string().required(),
      isRemember: Joi.boolean().required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      address: Joi.string().required(),
      dialingCode: Joi.string().min(3).required(),
      phone: Joi.number().required(),
      addressLine1: Joi.string().required(),
      country: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      zipCode: Joi.string().required(),
      id: Joi.number().required(),
      type: Joi.string()
        .valid(
          "admin",
          "farmer",
          "distributors",
          "consultant",
          "agricultural_chemicals",
          "equipment_manufacturers",
          "marketing_agencies",
          "insurance"
        )
        .required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        createErrorResponse: "INVALID_INPUT",
        message: "Invalid input provided.",
        details: error.details,
      });
    }

    const user = await User.findOne({
      email: email,
      deletedAt: { $eq: null },
    });

    if (user) {
      return res.status(400).json({
        error: {
          message: "You have already signed up. Try to log in.",
          status: "error",
        },
      });
    } else {
      bcryptjs
        .genSalt(saltRounds)
        .then((salt: string) => {
          return bcryptjs.hash(signature, salt);
        })
        .then(async (hash: string) => {
          const customer = new User({
            firstName: firstName,
            lastName: lastName,
            role: type,
            email: email,
            signature: hash,
            key: key,
            walletAddress: address,
            id: id
          });

          await customer.save()

          publishUserRegisteredEvent({
            user_id: customer._id,
            dialingCode,
            phone,
            addressLine1,
            country,
            state,
            city,
            zipCode,
          });

          const newCustomer = {
            isActive: customer.isActive,
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            role: customer.role,
            email: customer.email,
          };

          return res.status(201).json({
            createSuccessResponse: "Successfully registered.",
            token: isRemember
              ? jwt.sign(newCustomer, env.TOKEN_SECRET, { expiresIn: "48h" })
              : "",
            ...newCustomer,
            expiresIn: "48h",
          });
        })
        .catch((err: any) => {
          console.error(err.message);
          return res.status(500).json({
            createErrorResponse: "HASH_ERROR",
            message: "Error while hashing password.",
          });
        });
    }
  } catch (error) {
    return res.status(500).json({
      createErrorResponse: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred.",
    });
  }
};
