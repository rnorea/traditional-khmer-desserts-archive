'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../utils/supabase/server.js';

export async function login(prevState, formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // User requested plain error handling: on failed login show only "Invalid email or password"
    return { error: 'Invalid email or password' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(prevState, formData) {
  const supabase = await createClient();

  const terms = formData.get('terms');
  if (!terms) {
    return { error: 'You must agree to the terms and conditions' };
  }

  let username = formData.get('username');
  if (!username || username.trim() === '') {
    username = 'user_' + Math.random().toString(36).substring(2, 10);
  }

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      data: {
        username: username,
        full_name: formData.get('full_name') || '',
        organization: formData.get('organization') || ''
      }
    }
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
