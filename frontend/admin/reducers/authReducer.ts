import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    token:String;
  };


interface ErrorType {
  code:string,
  details:any,
  message:string
}
  
interface AuthState {
  user: User | null;
  loading: boolean;
  error: ErrorType | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<ErrorType>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
