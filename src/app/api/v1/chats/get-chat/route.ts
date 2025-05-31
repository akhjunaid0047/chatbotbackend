"use server";
import userModel from "@/model/user.model";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { log } from "console";


export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    log(session);
    if (!session)
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const user = await userModel.findById(session.user._id);
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
