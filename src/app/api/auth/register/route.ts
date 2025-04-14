import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // In Cloudflare Workers environment, we need to use a different approach
    // since we can't directly access the DB binding from getCloudflareContext
    
    // Get DB from environment
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
      // Check if username or email already exists
      const existingUserQuery = `
        SELECT id FROM users WHERE username = ? OR email = ?
      `;
      const existingUser = await db
        .prepare(existingUserQuery)
        .bind(username, email)
        .first();

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username or email already exists' },
          { status: 409 }
        );
      }

      // Insert new user
      const insertQuery = `
        INSERT INTO users (username, email, password_hash) 
        VALUES (?, ?, ?)
      `;
      const result = await db
        .prepare(insertQuery)
        .bind(username, email, passwordHash)
        .run();

      return NextResponse.json(
        { 
          message: 'User created successfully', 
          userId: result.meta?.last_row_id || 0 
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user', details: error.message },
      { status: 500 }
    );
  }
}
