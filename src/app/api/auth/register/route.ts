export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

// A2, A3: POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, full_name } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: 'Барлық өрістерді толтырыңыз' }, { status: 400 });
    }

    const db = await getDb();

    // A2: Проверка дублирования username
    const existing = await db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing) {
      return NextResponse.json({ success: false, message: 'Бұл пайдаланушы аты немесе email тіркелген' }, { status: 409 });
    }

    // A2: Хеширование пароля (маска)
    const password_hash = await bcrypt.hash(password, 10);

    // A3: INSERT INTO
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)',
      [username, email, password_hash, full_name || '']
    );

    if (!result.lastID) {
      return NextResponse.json({ success: false, message: 'Тіркелу сәтсіз аяқталды' }, { status: 500 });
    }

    const token = signToken({ id: result.lastID, username, role: 'user' });
    const response = NextResponse.json({ success: true, message: 'Тіркелу сәтті аяқталды' }, { status: 201 });
    response.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, message: 'Сервер қатесі' }, { status: 500 });
  }
}
