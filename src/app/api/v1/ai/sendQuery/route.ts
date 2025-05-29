import OpenAI from "openai";
import userModel from "@/model/user.model";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/utils/tokenManager";

export async function POST(req: NextRequest) {

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });

  try {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await userModel.findById(payload.id);
    if (!user)
      return NextResponse.json({
        message: "User not registered OR Token malfunctioned",
      });

    const { question, language } = await req.json();
    const query =
      question +
      (language === "HINDI" ? " Reply in Hindi" : "Reply in English");
    if (!question) {
      return NextResponse.json({
        error: "Question is required in the request body.",
      });
    }

    user.chats.push({ role: "user", content: question });
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: query,
    });
    const outputText = response.output_text;
    user.chats.push({ role: "assistant", content: response.output_text });
    await user.save();
    return NextResponse.json(outputText);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
