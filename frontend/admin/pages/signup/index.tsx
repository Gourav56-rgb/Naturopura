import React from "react";
import { useEffect, useState } from "react";
import { BrowserWallet } from "@meshsdk/core";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../action/authActions";
import { useRouter } from "next/router";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";

const AdminSignup = () => {
  const [wallets, setWallets] = useState<Array<any>>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phone: "",
    dialingCode: "+91",
    addressLine: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    walletName: "",
  });
  const [role, setRole] = useState<Array<string>>([
    "admin",
    "consumer",
    "farmer",
    "distributors",
    "consultant",
    "agricultural_chemicals",
    "equipment_manufacturers",
    "marketing_agencies",
    "insurance",
    "cold-storage",
  ]);
  // console.log("formdata", formData);
  const user = useSelector((state: any) => state.auth.user);
  const error = useSelector((state: any) => state.auth.error);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    // console.log("name", name);
    // console.log("value", value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Perform form submission logic here
    const wallet = await BrowserWallet.enable(formData.walletName);
    const addresses = await wallet.getUsedAddresses();

    const signature = await wallet.signData(addresses[0], "mesh");
    // console.log("signature", signature);
    // console.log("signature.signature", signature.signature);

    dispatch(
      signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        isRemember: true,
        isActive: true,
        signature: signature.signature,
        walletAddress: addresses[0],
        dialingCode: formData.dialingCode,
        addressLine: formData.addressLine,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipCode: formData.zipCode,
        key: signature.key,
        role: formData.role,
      })
    );
    // console.log(addresses, ">>>>>>>>");
    // console.log(typeof signature.key);

    // console.log(typeof signature, "99999999999999");
  };

  useEffect(() => {
    const getBrowser = BrowserWallet.getInstalledWallets();
    // console.log(getBrowser, "getBrowser");
    setWallets(getBrowser);
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    // console.log(`error`, error);
  }, [error, user, router]);

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Registration Form
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              First Name
            </label>
            <div className="mt-2.5">
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Last Name
            </label>
            <div className="mt-2.5">
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@flowbite.com"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Phone Number
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <select
                  id="dialingCode"
                  title="dialingCode"
                  name="dialingCode"
                  onChange={handleChange}
                  value={formData.dialingCode}
                  className="h-full rounded-md border-0 bg-transparent py-0 pl-2 text-black sm:text-sm"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  {/* Add more dialing codes as necessary */}
                </select>
              </div>

              <input
                id="phone"
                name="phone"
                title="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="wallet"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Wallet
            </label>
            <div className="relative mt-2.5">
              <div className="">
                <select
                  id="walletName"
                  name="walletName"
                  title="walletName"
                  required
                  value={formData.walletName}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option>Select a wallet</option>
                  {wallets.map((item, index) => {
                    return (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="role"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Role
            </label>
            <div className="relative mt-2.5">
              <div className="">
                <select
                  id="role"
                  name="role"
                  title="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option>Select Type</option>
                  {role.map((item, index) => {
                    return <option key={index}>{item}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="addressLine"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Address Line
            </label>
            <div className="mt-2.5">
              <input
                id="addressLine"
                name="addressLine"
                type="text"
                value={formData.addressLine}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="country"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Country
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="state"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              State
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="city"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              City
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="zipCode"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              ZIP Code
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Register New Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSignup;
