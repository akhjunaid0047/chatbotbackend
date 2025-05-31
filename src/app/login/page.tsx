"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const { status } = useSession();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setRedirecting(true);
      setTimeout(() => {
        router.push("/chat");
      }, 100);
    }
  }, [status, router]);

  if (redirecting)
    return (
      <div className="flex items-center justify-center w-full py-10">
        <span className="w-10 h-10 border-4 border-t-[#00fffc] border-gray-300 rounded-full animate-spin"></span>
        <span className="ml-3 text-lg font-semibold text-white-700">
          Redirecting…
        </span>
      </div>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    // Call NextAuth signIn function
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black px-4 sm:px-8">
      <div className="max-w-lg w-full p-8 bg-white dark:bg-neutral-950 rounded-lg shadow-lg dark:shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-black dark:text-white mb-6">
          Welcome Back to AssemblyBOT
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Please log in with your credentials
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <Label className="block text-black dark:text-white mb-2">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Password Field */}
          <div>
            <Label className="block text-black dark:text-white mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black dark:text-white"
              >
                {showPassword ? <HiEyeOff size={24} /> : <HiEye size={24} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-black text-white font-semibold rounded-md hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-300"
          >
            Log In &rarr;
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {/* Link to Register Page */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 dark:text-blue-400">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
