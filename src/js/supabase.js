import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { CONFIG } from './config.js';

// ─────────────────────────────────────────────────────────────
// Client
// ─────────────────────────────────────────────────────────────
export const supabase = createClient(
  CONFIG.supabase.url,
  CONFIG.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────
export async function signUp(email, password, username, fullName) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { username, full_name: fullName } },
  });
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut(scope = 'local') {
  return supabase.auth.signOut({ scope });
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword });
}

// ─────────────────────────────────────────────────────────────
// Profiles
// ─────────────────────────────────────────────────────────────
export async function getProfile(userId) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}

export async function updateProfile(userId, updates) {
  return supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
}

// ─────────────────────────────────────────────────────────────
// Posts
// ─────────────────────────────────────────────────────────────
export async function getPosts(limit = 30) {
  return supabase
    .from('posts')
    .select('*, profiles(username, full_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function getUserPosts(userId) {
  return supabase
    .from('posts')
    .select('*, profiles(username, full_name, avatar_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function createPost(userId, title, content, imageUrl = null) {
  return supabase
    .from('posts')
    .insert({ user_id: userId, title, content, image_url: imageUrl })
    .select()
    .single();
}

export async function deletePost(postId) {
  return supabase.from('posts').delete().eq('id', postId);
}

// ─────────────────────────────────────────────────────────────
// Storage helpers
// ─────────────────────────────────────────────────────────────
const BUCKET = CONFIG.app.storageBucket;

function getPublicUrl(path) {
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}

export async function uploadFile(filePath, file, upsert = false) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert });
  if (error) return { data: null, error };
  return { data: { path: filePath, publicUrl: getPublicUrl(filePath) }, error: null };
}

export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop().toLowerCase();
  return uploadFile(`profile-pictures/${userId}/avatar.${ext}`, file, true);
}

export async function uploadPostImage(userId, file) {
  const ext = file.name.split('.').pop().toLowerCase();
  return uploadFile(`posts/${userId}/${Date.now()}.${ext}`, file, false);
}

export async function listUserFiles(userId) {
  const folders = ['profile-pictures', 'posts', 'misc'];
  const results = await Promise.all(
    folders.map(folder =>
      supabase.storage
        .from(BUCKET)
        .list(`${folder}/${userId}`)
        .then(({ data, error }) => ({
          folder,
          files: (data || []).map(f => ({
            ...f,
            folder,
            path: `${folder}/${userId}/${f.name}`,
            publicUrl: getPublicUrl(`${folder}/${userId}/${f.name}`),
          })),
          error,
        }))
    )
  );
  return results.flatMap(r => r.files);
}

export async function deleteFile(path) {
  return supabase.storage.from(BUCKET).remove([path]);
}

// ─────────────────────────────────────────────────────────────
// Realtime
// ─────────────────────────────────────────────────────────────
export function subscribeToNewPosts(callback) {
  return supabase
    .channel('realtime:posts')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'posts' },
      callback
    )
    .subscribe();
}
