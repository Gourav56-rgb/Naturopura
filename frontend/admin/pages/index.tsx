import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [signature, setSignature] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const error = useSelector((state: any) => state.auth.error);

  const dispatch = useDispatch();

  useEffect(() => {}, [dispatch]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, []);

  return (
    <>
     <h1 className="bg-red">Admin</h1>
    </>
  );
}
