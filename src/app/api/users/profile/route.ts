import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // In Cloudflare Workers environment, we need to use a different approach
    // @ts-ignore - Cloudflare Workers specific
    const env = process.env as any;
    const db = env.DB;
    
    if (!db) {
      console.error('Database connection not available');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    try {
      // Get user profile
      const userQuery = `
        SELECT id, username, email, created_at FROM users WHERE id = ?
      `;
      const user = await db
        .prepare(userQuery)
        .bind(payload.userId)
        .first();

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Count user's videos
      const videoCountQuery = `
        SELECT COUNT(*) as count FROM videos WHERE user_id = ?
      `;
      const videoCount = await db
        .prepare(videoCountQuery)
        .bind(user.id)
        .first();

      // Return user profile
      return NextResponse.json({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        video_count: videoCount ? videoCount.count : 0
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile', details: error.message },
      { status: 500 }
    );
  }
}
