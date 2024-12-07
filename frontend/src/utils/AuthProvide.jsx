/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { setUser } from "@/features/authSlice";
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
