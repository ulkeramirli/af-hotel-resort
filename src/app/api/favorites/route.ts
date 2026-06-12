import { NextResponse } from 'next/server';

// Имитация DB таблицы избранного: { "userId": ["room-id-1", "room-id-2"] }
const USER_FAVORITES_DB: Record<string, string[]> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ favorites: [] });
  }

  const userFavs = USER_FAVORITES_DB[userId] || [];
  return NextResponse.json({ favorites: userFavs });
}

export async function POST(request: Request) {
  try {
    const { userId, roomId } = await request.json();

    if (!userId || !roomId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    if (!USER_FAVORITES_DB[userId]) {
      USER_FAVORITES_DB[userId] = [];
    }

    const exists = USER_FAVORITES_DB[userId].includes(roomId);
    if (exists) {
      // Если уже есть — удаляем (Toggle-логика)
      USER_FAVORITES_DB[userId] = USER_FAVORITES_DB[userId].filter(id => id !== roomId);
    } else {
      // Если нет — добавляем
      USER_FAVORITES_DB[userId].push(roomId);
    }

    return NextResponse.json({ favorites: USER_FAVORITES_DB[userId] });
  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}