import axios from "axios";

export const signUpAdmin = async (credentials: {
  // id:Number;
  firstName: string;
  lastName:string,
  email:string,
  isRemember:Boolean,
  isActive: Boolean,
  signature:string,
  walletAddress:string,
  dialingCode:string,
  addressLine:string,
  phone:string,
  country:string,
  state:string,
  city:string,
  zipCode:string,
  key: string,
  role:string
}) => {
  console.log(credentials, "5555555555555555555555555");
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