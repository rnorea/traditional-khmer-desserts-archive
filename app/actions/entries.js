'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../utils/supabase/server.js';

export async function addEntry(prevState, formData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to add entries.' };
  }

  const title_en = formData.get('title_en');
  const title_kh = formData.get('title_kh');
  const description_en = formData.get('description_en');
  const description_kh = formData.get('description_kh');
  const ingredients_en = formData.get('ingredients_en');
  const ingredients_kh = formData.get('ingredients_kh');
  const instructions_en = formData.get('instructions_en');
  const instructions_kh = formData.get('instructions_kh');
  const image_url = formData.get('image_url') || null;

  if (!title_en || !title_kh || !description_en || !description_kh || !ingredients_en || !ingredients_kh || !instructions_en || !instructions_kh) {
    return { error: 'Please fill in all required fields in both languages.' };
  }

  const { error } = await supabase
    .from('entries')
    .insert([{
      title_en,
      title_kh,
      description_en,
      description_kh,
      ingredients_en,
      ingredients_kh,
      instructions_en,
      instructions_kh,
      image_url,
      status: 'published',
      author_id: user.id
    }]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  
  return { success: 'Entry successfully submitted for review!' };
}

export async function updateEntry(prevState, formData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to update entries.' };
  }

  const id = formData.get('id');
  const title_en = formData.get('title_en');
  const title_kh = formData.get('title_kh');
  const description_en = formData.get('description_en');
  const description_kh = formData.get('description_kh');
  const ingredients_en = formData.get('ingredients_en');
  const ingredients_kh = formData.get('ingredients_kh');
  const instructions_en = formData.get('instructions_en');
  const instructions_kh = formData.get('instructions_kh');
  const image_url = formData.get('image_url') || null;

  if (!id || !title_en || !title_kh || !description_en || !description_kh || !ingredients_en || !ingredients_kh || !instructions_en || !instructions_kh) {
    return { error: 'Please fill in all required fields in both languages.' };
  }

  // We rely on RLS policies to allow Authors to update their own entries
  // and Admins to update anyone's entries.
  const { error } = await supabase
    .from('entries')
    .update({
      title_en,
      title_kh,
      description_en,
      description_kh,
      ingredients_en,
      ingredients_kh,
      instructions_en,
      instructions_kh,
      image_url
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  
  return { success: 'Entry successfully updated!' };
}

export async function deleteEntry(id) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to delete entries.' };
  }

  // RLS policies determine if the user is allowed to delete this (Author or Admin)
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  
  return { success: 'Entry successfully deleted.' };
}
