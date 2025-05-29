import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import userModel from '@/model/user.model';
import { verifyToken } from '@/utils/tokenManager';

export async function GET() {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token)
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  await dbConnect();
  const user = await userModel.findById(payload.id);
  if (!user)
    return NextResponse.json({ message: 'User not registered' }, { status: 401 });

  return NextResponse.json(
    { message: 'OK', email: user.email, name: user.name },
    { status: 200 }
  );
}
