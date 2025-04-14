import { D1Database } from '@cloudflare/workers-types';

interface CloudflareEnv {
  DB: D1Database;
  ASSETS: any;
}

export function getCloudflareContext() {
  // @ts-ignore - This is a Cloudflare Workers specific API
  const env = process.env as unknown as CloudflareEnv;
  
  return {
    env,
  };
}
