import { Admin, Error } from "./types";

export interface adminReducerInitialState {
  admin: Admin | null;
  loading: boolean;
  error: Error | null;
}
