"use server";

import userModel from "@/model/user.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/tokenManager";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  const cookie = await cookies();
  const token = cookie.get("auth_token")?.value;
  console.log("Token received:", token);
  if (!token)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  let payload;
  try {
    payload = verifyToken(token);
    await dbConnect();
    const user = await userModel.findById(payload.id);
    if (!user)
      return NextResponse.json(
        { message: "User not registered" },
        { status: 401 }
      );
    return NextResponse.json({ message: "CHATS RECEIVED", chats: user.chats });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
