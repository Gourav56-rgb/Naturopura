import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./auth/auth";

// import "tailwindcss/tailwind.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="top-center" />
      <MeshProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          </PersistGate>
        </Provider>
      </MeshProvider>
    </>
  );
}
