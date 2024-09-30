import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();
  const [signature, setSignature] = useState("");

  return (
    <>
      <h1 className="bg-red">
        Admin
        {/* {decodedUser ? (
          <>
            <p>role : {decodedUser.role}</p>
          </>
        ) : (
          <p>No Admin is logged in</p>
        )} */}
      </h1>
    </>
  );
}

export default Home;
