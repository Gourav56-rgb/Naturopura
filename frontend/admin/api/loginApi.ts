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
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
