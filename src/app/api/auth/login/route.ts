import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

// A2, A3: POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Барлық өрістерді толтырыңыз' }, { status: 400 });
    }

    const db = await getDb();

    // A3: SELECT - поиск пользователя
    const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);

    // A2: Пользователь не найден
    if (!user) {
      return NextResponse.json({ success: false, message: 'Пайдаланушы табылмады' }, { status: 404 });
    }

    // A2: Проверка пароля
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Құпия сөз дұрыс емес' }, { status: 401 });
    }

    const token = signToken({ id: user.id, username: user.username, role: user.role });
    const response = NextResponse.json({
      success: true,
      message: 'Жүйеге кіру сәтті',
      user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name, role: user.role }
    });
    response.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Сервер қатесі' }, { status: 500 });
  }
}
