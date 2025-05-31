"use client";
import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password,
    };

    try {
      const response = await fetch("/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response data:", data);
      if (response.status !== 201) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        router.push("/chat");
      }
    } catch (error) {
      setError(`Error: ${error}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black px-4 sm:px-8">
      <div className="max-w-lg w-full p-8 bg-white dark:bg-neutral-950 rounded-lg shadow-lg dark:shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-black dark:text-white mb-6">
          Welcome to AssemblyBot
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Please provide your basic details to sign up
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label className="block text-black dark:text-white mb-2">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          <div>
            <Label className="block text-black dark:text-white mb-2">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
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
                onChange={(e) => setPassword(e.target.value)}
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
          <div>
            <Label className="block text-black dark:text-white mb-2">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black dark:text-white"
              >
                {showConfirmPassword ? (
                  <HiEyeOff size={24} />
                ) : (
                  <HiEye size={24} />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-black text-white font-semibold rounded-md hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-300"
          >
            Sign Up &rarr;
          </button>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
