import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userModel from "@/model/user.model";
import { compare } from "bcrypt";
import dbConnect from "@/lib/dbConnect";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        await dbConnect();
        console.log(credentials);
        const user = await userModel.findOne({ email: credentials?.email });
        // console.log(user);
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = 
          await compare(
            credentials?.password as string,
            user.password as string
          );
        if (isValid) {
            // console.log(user);
          return user;
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();

      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id?.toString();

      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
