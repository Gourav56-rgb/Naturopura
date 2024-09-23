import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import AdminSignup from "./signup";
import AdminLogin from "./login";

export default function Home() {
  const router = useRouter();
  const [signature, setSignature] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const error = useSelector((state: any) => state.auth.error);

  const dispatch = useDispatch();

  useEffect(() => {
     if (user) {
      router.push("/")
     }
  }, [user, router]);

  useEffect(() => {
    if (!user) {
      router.push("/signup");
    }
  }, [user, router]);

  return (
    <>
     <h1 className="bg-red">
      {/* <AdminSignup /> */}
      {/* <AdminLogin /> */}
      Admin
     </h1>
    </>
  );
}
