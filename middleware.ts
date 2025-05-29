import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://3pdb8t04-5173.inc1.devtunnels.ms',
  'https://frontend-chatbot-eta.vercel.app',
  'https://frontend-chatbot-u7pk.onrender.com',
  'https://assemblybotfrontend.onrender.com',
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  // If origin is in allowed list, set CORS headers on the response
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // Otherwise, just continue without adding CORS headers
  return NextResponse.next();
}

// Apply middleware only on /api routes
export const config = {
  matcher: ['/api/:path*'],
};
