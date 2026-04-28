import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getDb } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/user/profile
export async function GET(req: NextRequest) {
  const currentUser = getUserFromRequest(req);
  if (!currentUser) {
    return NextResponse.json({ success: false, message: 'Авторизацияланбаған' }, { status: 401 });
  }

  const db = await getDb();
  // A3: SELECT
  const user = await db.get(
    'SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?',
    [currentUser.id]
  );

  return NextResponse.json({ success: true, user });
}

// POST /api/user/profile - обновление профиля
export async function POST(req: NextRequest) {
  const currentUser = getUserFromRequest(req);
  if (!currentUser) {
    return NextResponse.json({ success: false, message: 'Авторизацияланбаған' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { full_name, phone, email, new_password } = body;
    const db = await getDb();

    if (new_password) {
      const password_hash = await bcrypt.hash(new_password, 10);
      // A3: UPDATE
      const result = await db.run(
        'UPDATE users SET full_name = ?, phone = ?, email = ?, password_hash = ? WHERE id = ?',
        [full_name, phone, email, password_hash, currentUser.id]
      );
      if (result.changes === 0) {
        return NextResponse.json({ success: false, message: 'Жаңарту сәтсіз аяқталды' }, { status: 500 });
      }
    } else {
      // A3: UPDATE
      const result = await db.run(
        'UPDATE users SET full_name = ?, phone = ?, email = ? WHERE id = ?',
        [full_name, phone, email, currentUser.id]
      );
      if (result.changes === 0) {
        return NextResponse.json({ success: false, message: 'Жаңарту сәтсіз аяқталды' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Профиль сәтті жаңартылды' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, message: 'Сервер қатесі' }, { status: 500 });
  }
}
