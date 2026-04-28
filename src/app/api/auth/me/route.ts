export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/auth/me
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Авторизацияланбаған' }, { status: 401 });
  }

  const db = await getDb();
  const userData = await db.get(
    'SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?',
    [user.id]
  );

  if (!userData) {
    return NextResponse.json({ success: false, message: 'Пайдаланушы табылмады' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user: userData });
}

// POST /api/auth/me - logout
export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Жүйеден шықтыңыз' });
  response.cookies.delete('token');
  return response;
}
