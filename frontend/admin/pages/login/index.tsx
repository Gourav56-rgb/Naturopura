import React from "react";
import { BrowserWallet } from "@meshsdk/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { login } from '../../action/authActions';

const index = () => {

  const dispatch = useDispatch();
  const [wallets, setWallets] = useState<Array<any>>([]);
  const [openWallet, setOpenWallet] = useState(false);

  async function connectToWallet(walletName: string) {
    const wallet = await BrowserWallet.enable(walletName);
    const addresses = await wallet.getUsedAddresses();
    const signature = await wallet.signData(addresses[0], 'mesh');

    dispatch(login({ key: signature.key, signature: signature.signature }));
  }

  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const error = useSelector((state: any) => state.auth.error);

  console.log(`error>>>>>>>>>>>>>>opc`, error?.responseType);


  if (typeof window !== "undefined") {
    const wallet_find = BrowserWallet.getInstalledWallets();
  }

  useEffect(() => {
    const getBrowser = BrowserWallet.getInstalledWallets();
    setWallets(getBrowser);
  }, []);

  useEffect(() => {

  }, []);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);


  useEffect(() => {
    if (error !== null && error?.responseType == 'USER_NOT_EXIST') {
      router.push("/signup");
    }
    console.log(`user`, user);
  }, [error]);

  return (
    <div className="">
      <main className="main flex items-center flex-col">
        <img src="/images/Group-230.png" alt="" className="m-4" />
        {/* <button onClick={() => connectToWallet()}>Test</button> */}
        <label htmlFor="mySelect" className="text-red-700">
          Sign-up with wallet
        </label>
        <button
          onClick={() => setOpenWallet(!openWallet)}
          type="button"
          className="text-white bg-[#ACB631] hover:bg-[#ACB631]/90 focus:ring-4 focus:outline-none focus:ring-[#f3ff63]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mt-4"
        >
          Login in with Wallet
          <svg
            fill="none"
            height="24"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        {/* <select
          id="mySelect"
          className="w-[10rem]"
          onChange={(event) => {
            // console.log(event.target.value, ">>>>>>");
            connectToWallet(event.target.value)
          }}
          
        > */}
        {/* <option>Select a wallet</option> */}
        {openWallet &&
          wallets.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => connectToWallet(item.name)}
                className="text-white bg-[#ACB631] hover:bg-[#ACB631]/90 focus:ring-4 focus:outline-none focus:ring-[#f3ff63]/50 font-medium rounded-sm text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mt-1 w-[10rem] cursor-pointer"
              >
                {item.name}
              </div>
            );
          })}
        {/* </select> */}
      </main>
    </div>
  );
};

export default index;
