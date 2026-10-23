// ============================================================
// App Configuration
//
// ⚠️  The Supabase `anon` key is INTENTIONALLY PUBLIC.
//     It is safe to expose it in frontend code.
//     Security is enforced via Row Level Security (RLS)
//     policies in Supabase — not by hiding this key.
//
// For Vercel deployment:
//   - These values are baked in at build time (no build tool
//     needed — they're static for a vanilla JS project).
//   - To rotate keys, update these values and redeploy.
// ============================================================

export const CONFIG = {
  supabase: {
    url: 'https://vzglzqvhbavbampdakpb.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Z2x6cXZoYmF2YmFtcGRha3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MjM1MTcsImV4cCI6MjEwODI5OTUxN30.' +
      'ZdcI6PiWy61kw2Ll1nKuDcg8N_bQ_2AGeTae6RkGqz8',
  },
  app: {
    name: 'SupaApp',
    version: '1.0.0',
    storageBucket: 'user-content',
  },
};
