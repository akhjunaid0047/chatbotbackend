"use server";
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import userModel from '@/model/user.model';
import { createToken } from '@/utils/tokenManager';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  await dbConnect();

  if (await userModel.findOne({ email })) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 422 }
    );
  }

  const hashed = await hash(password, 10);
  const user = await userModel.create({ name, email, password: hashed });

  const token = createToken(user._id.toString(), user.email);
  const res = NextResponse.json(
    { message: 'User registered successfully', id: user._id },
    { status: 201 }
  );

  res.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
