import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/features/authSlice";
import { enqueueSnackbar } from "notistack";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Login successful", {
          variant: "success",
          autoHideDuration: 1000,
        });
        navigate("/");
      })
      .catch((error) => {
        enqueueSnackbar(error[0] || error, {
          variant: "error",
          autoHideDuration: 1000,
        });
      });
    setEmail("");
    setPassword("");
  };

  return (
    <main className="min-h-screen w-full flex justify-center items-center">
      <div className="w-[28%] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col space-y-4 border rounded-lg border-gray-900 shadow-xl p-10"
        >
          <h1 className="font-semibold text-3xl uppercase text-center">
            Login to see your todos
          </h1>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="demo@gmail.com"
            className="placeholder:text-xs border border-zinc-800 focus:border focus:border-zinc-800"
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="password"
            className="placeholder:text-xs border border-zinc-800 focus:border focus:border-zinc-800"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
export default Login;
