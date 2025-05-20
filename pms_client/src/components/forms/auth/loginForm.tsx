import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
      
      // Get user role from localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "ADMIN") {
          navigate("/dashboard/overview");
        } else if (user.role === "USER") {
          navigate("/dashboard/vehicles");
        }
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 rounded-xl space-y-6 bg-white shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Access your Vehicle Parking Management dashboard
          </p>
        </div>

        <div className="relative">
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder=" "
            className="peer placeholder-transparent w-full border-b-2 border-gray-300 focus:border-green-500 outline-none py-2 text-gray-900"
          />
          <label
            htmlFor="email"
            className="absolute left-0 -top-5 text-sm text-green-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all"
          >
            Email Address
          </label>
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder=" "
            className="peer placeholder-transparent w-full border-b-2 border-gray-300 focus:border-green-500 outline-none py-2 text-gray-900 pr-10"
          />
          <label
            htmlFor="password"
            className="absolute left-0 -top-5 text-sm text-green-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all"
          >
            Password
          </label>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-2 text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <div className="flex justify-between text-sm text-gray-700">
          <a href="/auth/forgotPassword" className="hover:underline">
            Forgot password?
          </a>
          <a href="/auth/register" className="text-green-600 font-semibold hover:underline">
            Register here
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;