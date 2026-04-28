export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/reviews - получение всех отзывов
export async function GET() {
  try {
    const db = await getDb();
    // A3: SELECT с JOIN
    const reviews = await db.all(`
      SELECT reviews.id, reviews.content, reviews.rating, reviews.created_at,
             users.username, users.full_name
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      ORDER BY reviews.created_at DESC
    `);

    // A3: JSON формат
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({ success: false, message: 'Пікірлерді алу сәтсіз аяқталды' }, { status: 500 });
  }
}

// POST /api/reviews - добавление отзыва
export async function POST(req: NextRequest) {
  const currentUser = getUserFromRequest(req);
  if (!currentUser) {
    return NextResponse.json({ success: false, message: 'Пікір қалдыру үшін жүйеге кіріңіз' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { content, rating } = body;

    if (!content || content.trim().length < 5) {
      return NextResponse.json({ success: false, message: 'Пікір кемінде 5 символдан тұруы керек' }, { status: 400 });
    }

    const db = await getDb();
    // A3: INSERT INTO
    const result = await db.run(
      'INSERT INTO reviews (user_id, content, rating) VALUES (?, ?, ?)',
      [currentUser.id, content.trim(), rating || 5]
    );

    if (!result.lastID) {
      return NextResponse.json({ success: false, message: 'Пікір қосу сәтсіз аяқталды' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Пікіріңіз сәтті жіберілді', id: result.lastID }, { status: 201 });
  } catch (error) {
    console.error('Post review error:', error);
    return NextResponse.json({ success: false, message: 'Сервер қатесі' }, { status: 500 });
  }
}

// DELETE /api/reviews?id=X
export async function DELETE(req: NextRequest) {
  const currentUser = getUserFromRequest(req);
  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Рұқсат жоқ' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: 'ID міндетті' }, { status: 400 });
  }

  const db = await getDb();
  // A3: DELETE
  const result = await db.run('DELETE FROM reviews WHERE id = ?', [id]);

  if (result.changes === 0) {
    return NextResponse.json({ success: false, message: 'Пікір табылмады' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Пікір жойылды' });
}
