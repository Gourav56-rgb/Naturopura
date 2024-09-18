import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { Provider } from "react-redux";
import { store,persist } from "../store/store";
import { PersistGate } from 'redux-persist/integration/react';
// import "tailwindcss/tailwind.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <Component {...pageProps} />
      </PersistGate>
      </Provider>
    </MeshProvider>
  );
}
