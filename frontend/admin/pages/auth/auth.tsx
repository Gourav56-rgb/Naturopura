import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { adminReducerInitialState } from "../../types/reducer-types";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface DecodedUser extends JwtPayload {
  role?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode; // Define children prop type
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [decodedUser, setDecodedUser] = useState<DecodedUser | null>(null);
  const router = useRouter();
  const { admin } = useSelector(
    (state: { adminReducer: adminReducerInitialState }) => state.adminReducer
  );

  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   if (token) {
  //     const decodedToken = jwtDecode<DecodedUser>(token);
  //     setDecodedUser(decodedToken);
  //   }
  // }, []);

  useEffect(() => {
    if (admin) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [admin]);

  return <>{children}</>;
};

export default ProtectedRoute;
