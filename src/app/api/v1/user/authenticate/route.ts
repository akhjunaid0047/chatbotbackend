"use server";
import { useSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import userModel from '@/model/user.model';


export async function GET() {
 const {data:session,status} = useSession();
  if (status !== 'authenticated') {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 });
  }

  await dbConnect();
  const user = await userModel.findById(session.user._id);
  if (!user)
    return NextResponse.json({ message: 'User not registered' }, { status: 401 });

  return NextResponse.json(
    { message: 'OK', email: user.email, name: user.name },
    { status: 200 }
  );
}
