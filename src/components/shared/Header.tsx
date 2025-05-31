// "use client";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Logo from "./logo";
// // import { useAuth } from "@/context/AuthContext";
// import NavigationLink from "./NavigationLink";
// import { useSession } from "next-auth/react";
// import { signOut } from "next-auth/react";

// function Header() {
//   // const auth = useAuth();
//   const { status } = useSession();

//   return (
//     <AppBar
//       sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
//     >
//       <Toolbar sx={{ display: "flex" }}>
//         <Logo />
//         <div>
//           {status === "authenticated" || status === "loading" ? (
//             <>
//               <NavigationLink
//                 bg="#00fffc"
//                 to="/chat"
//                 text="Go to Chat"
//                 textColor="black"
//               />
//               <NavigationLink
//                 bg="#51538f"
//                 to="/"
//                 text="Logout"
//                 textColor="white"
//                 onClick={() => signOut()}
//               />
//             </>
//           ) : (
//             <>
//               <NavigationLink
//                 bg="#00fffc"
//                 to="/login"
//                 text="Login"
//                 textColor="black"
//               />
//               <NavigationLink
//                 bg="#51538f"
//                 to="/signup"
//                 text="Signup"
//                 textColor="white"
//               />
//             </>
//           )}
//         </div>
//       </Toolbar>
//     </AppBar>
//   );
// }

// export default Header;

"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { status } = useSession();
  const router = useRouter();

  return (
    <header className="w-full bg-transparent shadow-none px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/openai.png" // Swap to your image or Logo component
          alt="Logo"
          width={44}
          height={44}
          className="rounded-full border border-gray-200"
        />
        {/* Or use <Logo /> */}
      </div>
      {/* Navigation */}
      <div className="flex gap-3">
        {status === "authenticated" || status === "loading" ? (
          <>
            <Button
              style={{
                backgroundColor: "#00fffc",
                color: "black",
                borderRadius: "1.25rem",
              }}
              className="shadow font-semibold hover:scale-105 transition"
              onClick={() => router.push("/chat")}
            >
              Go to Chat
            </Button>
            <Button
              style={{
                backgroundColor: "#51538f",
                color: "white",
                borderRadius: "1.25rem",
              }}
              className="shadow font-semibold hover:scale-105 transition"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              style={{
                backgroundColor: "#00fffc",
                color: "black",
                borderRadius: "1.25rem",
              }}
              className="shadow font-semibold hover:scale-105 transition"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              style={{
                backgroundColor: "#51538f",
                color: "white",
                borderRadius: "1.25rem",
              }}
              className="shadow font-semibold hover:scale-105 transition"
              onClick={() => router.push("/signup")}
            >
              Signup
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

