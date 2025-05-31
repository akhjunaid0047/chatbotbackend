import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import userModel from '@/model/user.model';

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

  return NextResponse.json(
    { message: 'User registered successfully', id: user._id },
    { status: 201 }
  );
}
