import userModel from "@/model/user.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/tokenManager";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;
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
    user.chats.splice(0, user.chats.length);
    await user.save();
    return NextResponse.json({ message: "CHATS DELETED" });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
