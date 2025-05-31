import userModel from "@/model/user.model";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  try {
    await dbConnect();
    const user = await userModel.findById(session.user._id);
    if (!user)
      return NextResponse.json(
        { message: "User not registered" },
        { status: 401 }
      );
    user.chats.splice(0, user.chats.length);
    await user.save();
    return NextResponse.json({ message: "CHATS DELETED" });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
