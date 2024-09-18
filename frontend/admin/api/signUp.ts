import axios from "axios";

export const signUpUser = async (credentials: {
  firstName: string;
  lastName:string,
  email:string,
  isRemember:Boolean,
  signature:string,
  dialingCode:string,
  address:string,
  addressLine1:string,
  phone:Number,
  country:string,
  state:string,
  city:string,
  zipCode:string,
  key: string,
  type:string
}) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/auth/admin/signup",
      credentials
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};