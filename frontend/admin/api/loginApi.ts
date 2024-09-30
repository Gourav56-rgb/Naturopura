import axios from "axios";
import toast from "react-hot-toast";
import WithAuthRedirect from "../pages/auth/auth";
import ProtectedRoute from "../pages/auth/auth";

interface LoginResponse {
  data: {
    success: boolean;
    data: {
      token: string;
    };
  };
}

const LoginAdmin = async (credentials: {
  signature: string;
  key: string;
  // token: string;
  // createSuccessResponse: string;
  // email: string;
  // expiresIn: string;
  // firstName: string;
  // isActive: boolean;
  // lastName: string;
  // role: string;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/auth/admin/login",
      credentials
    );
    console.log("adminLogin", response);
    if (response.data.success === true) {
      toast.success("Sign in Successful");
    } else {
      toast.error("Admin Account Not Found, Please Sign up");
    }
    localStorage.setItem("accessToken", response?.data?.data?.token);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export default LoginAdmin;
