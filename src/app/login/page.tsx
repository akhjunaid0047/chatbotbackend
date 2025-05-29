"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import eye_open from "../assets/watch.png";
import eye_close from "../assets/closed-eyes.png";

const Login = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const auth = useAuth();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!values.email) newErrors.email = "Email is required";
    if (!values.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      toast.loading("Signing In", { id: "login" });
      await auth?.login(values.email, values.password);
      toast.success("Signed In Successfully", { id: "login" });
    } catch (err) {
      toast.error("Failed to Sign In", { id: "login" });
    }
  };

  useEffect(() => {
    if (auth?.user) {
      router.push("/chat");
    }
  }, [auth?.user, router]);

  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    return () => {
      document.body.style.overflow = "";
      document.body.style.margin = "";
    };
  }, []);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 500);
    checkWidth(); // check on mount

    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // --- Styles ---
  // (Keep your existing inline styles here...)

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000000",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#121212",
          padding: isMobile ? "24px" : "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.9)",
        }}
        autoComplete="off"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "2.2rem",
              fontWeight: "700",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Login
          </h2>
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#FFFFFF",
              margin: "10px 0",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "6px",
                backgroundColor: "#1C1C1C",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Image src={email_icon} alt="Email Icon" width={24} height={24} />
              <input
                type="email"
                name="email"
                placeholder="Email Id"
                value={values.email}
                onChange={handleInput}
                style={{
                  flex: 1,
                  height: "2.6rem",
                  background: "transparent",
                  outline: "none",
                  color: "#E0E0E0",
                  fontSize: "1rem",
                  border: "none",
                  padding: "0 10px",
                }}
              />
            </div>
            {errors.email && (
              <div
                style={{
                  color: "#CF6679",
                  fontSize: "12px",
                  marginTop: "4px",
                  paddingLeft: "8px",
                }}
              >
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderRadius: "6px",
                backgroundColor: "#1C1C1C",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Image
                src={password_icon}
                alt="Password Icon"
                width={24}
                height={24}
              />
              <input
                type={visible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleInput}
                style={{
                  flex: 1,
                  height: "2.6rem",
                  background: "transparent",
                  outline: "none",
                  color: "#E0E0E0",
                  fontSize: "1rem",
                  border: "none",
                  padding: "0 10px",
                }}
              />
              <div
                onClick={() => setVisible(!visible)}
                style={{ cursor: "pointer", marginLeft: "8px" }}
              >
                <Image
                  src={visible ? eye_open : eye_close}
                  alt="Toggle Visibility"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            {errors.password && (
              <div
                style={{
                  color: "#CF6679",
                  fontSize: "12px",
                  marginTop: "4px",
                  paddingLeft: "8px",
                }}
              >
                {errors.password}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <button
            type="submit"
            style={{
              cursor: "pointer",
              padding: "12px 24px",
              background: "#333333",
              color: "#FFFFFF",
              borderRadius: "50px",
              fontSize: "1.1rem",
              width: isMobile ? "80%" : "60%",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#444444")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#333333")}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
