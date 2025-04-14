import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
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
      // Find user by username
      const userQuery = `
        SELECT id, username, email, password_hash FROM users WHERE username = ?
      `;
      const user = await db
        .prepare(userQuery)
        .bind(username)
        .first();

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
      });

      // Return user info and token
      return NextResponse.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login', details: error.message },
      { status: 500 }
    );
  }
}
