import { AnyAction, Dispatch } from 'redux';
import { loginUser } from '../api/loginApi';
import { ThunkDispatch } from 'redux-thunk';
import { signUpUser } from '../api/signUp';

// Action Types
export const LOGIN_REQUEST = 'auth/setLoading';
export const LOGIN_SUCCESS = 'auth/setUser';
export const LOGIN_FAILURE = 'auth/setError';
export const LOGOUT = 'auth/logout';


type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

// Action Creators
export const setLoading = (isLoad: boolean) => ({
  type: LOGIN_REQUEST,
  payload: isLoad,
});

export const loginSuccess = (user: User) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error: object) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

// Async action to handle user login
export const login = (credentials: { signature: string; key: string }) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
    console.log(`>>>>>>>>>>.3`);

    try {
      const response = await loginUser(credentials);
      console.log(`response>>>>>>>>>`, response);

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response?.token);
      }
      if (!response.success) {
        dispatch(loginFailure(response));
      } else {
        const user = response.data;
        user.token = response?.token;
        // Assuming the server returns the user object
        dispatch(loginSuccess(user));
      }

      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.error));
      dispatch(setLoading(false));
    }
  };
};




export const signUp = (credentials: {
  firstName: string;
  lastName: string;
  email: string;
  isRemember: Boolean;
  signature: string;
  dialingCode: string;
  address: string;
  addressLine1: string;
  phone: Number;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  key: string;
  type: string;
}) => {
  return async (dispatch: Dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await signUpUser(credentials);

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", response?.token);
      }
      const user = response.data;
      user.token = response?.token; // Assuming the server returns the user object
      dispatch(loginSuccess(user));
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.error));
      dispatch(setLoading(false));
    }
  };
};


