import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { FaRegUser } from "react-icons/fa";
import { TbPasswordUser } from "react-icons/tb";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginService } from "../../../Services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    try {
        setLoading(true);
        const data = await loginService({email: userName, password,});
        login(data);
        toast.success(data.message || "Login successful!");
        navigate(from, { replace: true });
    } catch (error) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6 sm:px-8">
      <div className="w-full max-w-sm rounded-4xl border border-lime-500/30 bg-gray-200/95 px-6 py-6 shadow-2xl shadow-gray-500/50 backdrop-blur-xl sm:px-10">
        <div className="mb-8 text-center">
          <h1 className="mt-3 text-2xl font-bold text-lime-600 sm:text-3xl">
            Login
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Enter your credentials to continue.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>

          <label className="block">
            <span className="ml-2 text-sm font-semibold text-gray-600">
              User Email
            </span>

            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaRegUser />
              </span>

              <input 
                type="text" 
                placeholder="Enter Email" 
                className="w-full rounded-2xl border border-gray-300 bg-gray-200 px-10 py-2 outline-none transition focus:ring-2 focus:ring-lime-500/20"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </label>

          <label className="block">
            <span className="ml-2 text-sm font-semibold text-gray-600">
              Password
            </span>

            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <TbPasswordUser />
              </span>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full rounded-2xl border border-gray-300 bg-gray-200 px-10 py-2 outline-none transition focus:ring-2 focus:ring-lime-500/20"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? (
                  <VscEyeClosed className="text-gray-500" />
                ) : (
                  <VscEye className="text-gray-500" />
                )}
              </button>
            </div>
          </label>
          <button type="submit" disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 py-2 text-sm font-bold text-slate-900 shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
              {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}