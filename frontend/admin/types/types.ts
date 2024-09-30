export type Admin = {
  createSuccessResponse: string;
  email: string;
  expiresIn: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  role: string;
  token: string;
};

export type Error = {
  code: string;
  details: any;
  message: string;
  responseType: string | undefined | null;
};
