"use server";
import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import userModel from '@/model/user.model';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await dbConnect();

  const user = await userModel.findOne({ email });
  if (!user)
    return NextResponse.json({ message: 'User not registered' }, { status: 401 });

  const ok = await compare(password, user.password);
  if (!ok)
    return NextResponse.json({ message: 'Incorrect password' }, { status: 403 });

  return NextResponse.json({ message: 'User logged in' }, { status: 200 });

}
