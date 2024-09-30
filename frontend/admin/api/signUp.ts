import axios from "axios";
import toast from "react-hot-toast";
import WithAuthRedirect from "../pages/auth/auth";
import ProtectedRoute from "../pages/auth/auth";

interface SignupResponse {
  data: {
    success: boolean;
    data: {
      token: string;
    };
  };
}

const SignUpAdmin = async (credentials: {
  firstName: string;
  lastName: string;
  email: string;
  isRemember: Boolean;
  isActive: Boolean;
  signature: string;
  walletAddress: string;
  dialingCode: string;
  addressLine: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  key: string;
  role: string;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/auth/admin/signup",
      credentials
    );
    if (response.data.success === true) {
      toast.success("Signup Successful");
    } else {
      toast.error("Signup failed");
    }
    localStorage.setItem("accessToken", response?.data?.data?.token);
    const token = localStorage.getItem("accessToken");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export default SignUpAdmin;
