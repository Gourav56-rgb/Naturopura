import { adminExist, adminNotExist, setLoading } from "../reducers/authReducer"; // Adjust the import path
import LoginAdmin from "../api/loginApi"; // Adjust the import path
import { Dispatch } from "redux";

// interface LoginResponse {
//   data: {
//     token: string;
//   };
// }

// Update the function type to use ThunkAction
const Login = (credentials: { signature: string; key: string }) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    console.log(`>>>>>>>>>>.3`);

    try {
      const response = await LoginAdmin(credentials); // Make sure LoginAdmin returns a Promise<LoginResponse>
      console.log("called ----------------", response);

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response.data.token);
      }

      if (!response) {
        dispatch(adminNotExist(response));
        dispatch(setLoading(false));
      } else {
        const admin = response.data;
        admin.token = response.token; // Correctly access token
        dispatch(adminExist(admin));
        dispatch(setLoading(false));
      }
    } catch (error: any) {
      dispatch(adminNotExist(error));
      dispatch(setLoading(false));
    }
  };
};

export default Login;
