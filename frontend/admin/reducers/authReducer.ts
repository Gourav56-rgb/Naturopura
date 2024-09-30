import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminReducerInitialState } from "../types/reducer-types";
import { Admin, Error } from "../types/types";

const initialState: adminReducerInitialState = {
  admin: null,
  loading: false,
  error: null,
};
// type User = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   token: string;
// };

// interface ErrorType {
//   code: string;
//   details: any;
//   message: string;
// }

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: ErrorType | null;
// }

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
// };

export const adminReducer = createSlice({
  name: "adminReducer",
  initialState,
  reducers: {
    adminExist: (state, action: PayloadAction<Admin>) => {
      state.loading = false;
      state.admin = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    adminNotExist: (state, action: PayloadAction<Error>) => {
      state.loading = false;
      state.error = action.payload;
      // state.admin = null;
    },
    // setError: (state, action: PayloadAction<ErrorType>) => {
    //   state.error = action.payload;
    //   state.loading = false;
    // },
    adminLogout: (state) => {
      state.admin = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { adminExist, adminNotExist, adminLogout, setLoading } =
  adminReducer.actions;
export default adminReducer.reducer;
