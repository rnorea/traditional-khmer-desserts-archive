'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../utils/supabase/server.js';

export async function updateProfile(prevState, formData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const username = formData.get('username');
  const full_name = formData.get('full_name') || '';
  const organization = formData.get('organization') || '';

  if (!username || username.trim() === '') {
    return { error: 'Username is required' };
  }

  // Update public.profiles
  const { error: dbError } = await supabase
    .from('profiles')
    .update({ username, full_name, organization })
    .eq('id', user.id);

  if (dbError) {
    // Check if it's a unique constraint violation
    if (dbError.code === '23505') {
      return { error: 'Username is already taken.' };
    }
    return { error: dbError.message };
  }

  // Update auth.users metadata so Navbar updates immediately
  const { error: authError } = await supabase.auth.updateUser({
    data: { username, full_name, organization }
  });

  if (authError) {
    return { error: authError.message };
  }

  revalidatePath('/', 'layout');
  
  return { success: 'Profile updated successfully!' };
}

export async function updateEmail(prevState, formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const email = formData.get('email');
  if (!email || email.trim() === '') return { error: 'Email is required' };

  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  return { success: 'Check your new email inbox to confirm the change.' };
}

export async function updatePassword(prevState, formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const password = formData.get('password');
  if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  return { success: 'Password updated successfully!' };
}
