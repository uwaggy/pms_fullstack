import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import API_ENDPOINTS from "../../../constants/api";
import { Input } from "../../../components/ui/input";
import { axiosInstance } from "../../../lib/axios";

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    balance: z.number().min(0, { message: "Balance must be 0 or greater" }).optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSuccess: (email: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.auth.register, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        balance: data.balance || 0,
        password: data.password,
      });

      if (response.status !== 201) {
        toast.error(response.data.message || "Registration failed");
        return;
      }

      toast.success("Registration successful");
      onRegisterSuccess(data.email);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-6 rounded space-y-6 bg-white text-black"
    >
      <div>
        <h2 className="text-2xl font-semibold text-black">Register</h2>
        <h1>Enter credentials to create account</h1>
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 font-medium text-black">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="border-black focus:ring-green-500 py-6"
        />
        {errors.email && (
          <p className="text-green-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="firstName" className="block mb-1 font-medium">
          First Name
        </label>
        <Input
          id="firstName"
          className="py-6"
          type="text"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-green-600 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block mb-1 font-medium">
          Last Name
        </label>
        <Input
          id="lastName"
          className="py-6"
          type="text"
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className="text-green-600 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* <div>
        <label htmlFor="balance" className="block mb-1 font-medium">
          Initial Balance (Optional)
        </label>
        <Input
          id="balance"
          className="py-6"
          type="number"
          step="0.01"
          min="0"
          {...register("balance", { valueAsNumber: true })}
        />
        {errors.balance && (
          <p className="text-green-600 text-sm mt-1">{errors.balance.message}</p>
        )}
      </div> */}

      <div className="relative">
        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <Input
          id="password"
          className="py-6"
          type={showPassword ? "text" : "password"}
          {...register("password")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-[20px] text-gray-500 py-6"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && (
          <p className="text-green-600 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="relative">
        <label htmlFor="confirmPassword" className="block mb-1 font-medium">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          className="py-6"
          type={showConfirmPassword ? "text" : "password"}
          {...register("confirmPassword")}
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute right-3 top-[45px] text-gray-500"
          tabIndex={-1}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.confirmPassword && (
          <p className="text-green-600 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-300 py-6 focus:ring-green-500"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </Button>

      <p className="text-center">
        Already have an account?{" "}
        <a href="/auth/login" className="text-green-600 hover:underline">
          Login here
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;