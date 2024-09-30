// import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";
// import { createWrapper } from "next-redux-wrapper";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import adminReducer from "../reducers/authReducer";

// const initalState = {};

// middleware
// const middleware = [thunk];
// whitelist: ['users', 'products'],

// persist config
const persistConfig = {
  key: "root",
  storage,
  // version: 1,
  // whitelist: ["auth"],
};

const rootReducer = combineReducers({
  adminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer);
// creating store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

// assigning store to next wrapper

export const persistor = persistStore(store);
