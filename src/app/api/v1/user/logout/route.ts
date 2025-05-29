import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  (await cookies()).delete("auth_token");
  return NextResponse.json({ message: "OK" }, { status: 200 });
}
