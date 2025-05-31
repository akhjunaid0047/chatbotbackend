// 'use client';

// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { checkAuthStatus, loginUser, logoutUser, signupUser } from "@/helper/apiComminicator";

// type User = {
//   name: string;
//   email: string;
// };

// type UserAuth = {
//   isLoggedIn: boolean;
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<UserAuth | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     async function checkStatus() {
//       try {
//         const data = await checkAuthStatus();
//         if (data) {
//           setUser({ email: data.email, name: data.name });
//           setIsLoggedIn(true);
//         }
//       } catch {
//         // User not authenticated or error - stay logged out
//         setUser(null);
//         setIsLoggedIn(false);
//       }
//     }
//     checkStatus();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const data = await loginUser(email, password);
//       if (data) {
//         setUser({ email: data.email, name: data.name });
//         setIsLoggedIn(true);
//       }
//     } catch (error) {
//       setUser(null);
//       setIsLoggedIn(false);
//       throw error;
//     }
//   };

//   const signup = async (name: string, email: string, password: string) => {
//     try {
//       const data = await signupUser(name, email, password);
//       if (data) {
//         setUser({ email: data.email, name: data.name });
//         setIsLoggedIn(true);
//       }
//     } catch (error) {
//       setUser(null);
//       setIsLoggedIn(false);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await logoutUser();
//     } finally {
//       setIsLoggedIn(false);
//       setUser(null);
//       // Optionally force full reload to reset app state
//       if (typeof window !== "undefined") {
//         window.location.reload();
//       }
//     }
//   };

//   const value: UserAuth = {
//     isLoggedIn,
//     user,
//     login,
//     signup,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
