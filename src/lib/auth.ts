import { createHash } from 'crypto';

/**
 * Hash a password using SHA-256
 * 
 * @param password The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex');
}

/**
 * Verify a password against a hash
 * 
 * @param password The plain text password to verify
 * @param hash The hash to verify against
 * @returns Whether the password matches the hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Generate a JWT token
 * 
 * @param payload The data to include in the token
 * @returns The JWT token
 */
export function generateToken(payload: any): string {
  // In a real application, we would use a proper JWT library
  // For this demo, we'll use a simple base64 encoding
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
  
  // In a real app, we would sign this with a secret key
  const signature = createHash('sha256')
    .update(`${encodedHeader}.${encodedPayload}.secret-key`)
    .digest('hex');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify a JWT token
 * 
 * @param token The JWT token to verify
 * @returns The decoded payload if valid, null otherwise
 */
export function verifyToken(token: string): any | null {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    // Verify signature
    const expectedSignature = createHash('sha256')
      .update(`${encodedHeader}.${encodedPayload}.secret-key`)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}
