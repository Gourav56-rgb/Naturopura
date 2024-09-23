import axios from "axios";

export const loginAdmin = async (credentials: {
  signature: string;
  key: string;
}) => {
  console.log(credentials, "credentials");
  try {
    const response = await axios.post(
      "http://localhost:4000/auth/admin/login",
      credentials
    );
    localStorage.setItem("accessToken", response.data.data.token);
    // console.log("response", response.data.data.token);

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
