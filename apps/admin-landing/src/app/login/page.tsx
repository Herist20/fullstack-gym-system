"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";
import { loginFormSchema, type LoginFormData } from "@/lib/schemas";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Login data:", data);

      toast.success("Login successful!", {
        description: "Redirecting to admin dashboard...",
      });

      // Redirect to admin dashboard (placeholder)
      setTimeout(() => {
        // In production, this would redirect to the actual admin dashboard
        // router.push('/dashboard');
        toast.info("Dashboard redirect placeholder", {
          description: "Admin dashboard integration pending.",
        });
      }, 1000);
    } catch (error) {
      toast.error("Login failed", {
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />

      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Staff Login
            </h1>
            <p className="text-lg text-gray-600">
              Access your staff account to manage gym operations
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                    placeholder="staff@gym.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:border-orange-500 outline-none transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-offset-0"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all duration-200"
                  onClick={() =>
                    toast.info("Password reset", {
                      description:
                        "Please contact your administrator for password reset.",
                    })
                  }
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-base text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/careers"
                  className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all duration-200"
                >
                  Apply for a position
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              This is a secure staff-only area. Unauthorized access is prohibited.
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-orange-50 border-2 border-orange-200 rounded-xl p-6 shadow-md">
            <h3 className="text-base font-semibold text-orange-900 mb-3">
              Need Help?
            </h3>
            <ul className="space-y-2 text-sm text-orange-800">
              <li className="flex items-center gap-2">
                <span className="text-orange-600">•</span>
                <span>Contact IT Support: <a href="mailto:support@gym.com" className="font-medium hover:underline">support@gym.com</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-600">•</span>
                <span>Call: <a href="tel:+11234567890" className="font-medium hover:underline">(123) 456-7890 ext. 100</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-600">•</span>
                <span>Hours: Monday - Friday, 9AM - 5PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
