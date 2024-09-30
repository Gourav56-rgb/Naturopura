export type ResponseInfo = {
  message: string;
  code: string;
};

export const ResponseDefinitions: Record<string, ResponseInfo> = {
  // Error Responses
  InvalidInput: {
    message: "Invalid input provided.",
    code: "INVALID_INPUT",
  },
  NotFound: {
    message: "Resource not found.",
    code: "NOT_FOUND",
  },
  HashError: {
    message: "Error while hashing password.",
    code: "HASH_ERROR",
  },
  SignatureError: {
    message: "Invalid signature provided.",
    code: "SIGNATURE_ERROR",
  },
  UserNotExist: {
    message: "Please signup first.",
    code: "USER_NOT_EXIST",
  },
  UserExist: {
    message: "You have already signed up, please try logging in.",
    code: "USER_ALREADY_EXISTS",
  },
  Unauthorized: {
    message: "User is not authorized.",
    code: "UNAUTHORIZED",
  },
  // Success Responses
  OperationSuccessful: {
    message: "Operation completed successfully.",
    code: "SUCCESS",
  },
  DataSaved: {
    message: "Data has been saved successfully.",
    code: "DATA_SAVED",
  },
  // Add other response definitions here
};
