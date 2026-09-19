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
  const title_km = formData.get('title_km');
  const description_en = formData.get('description_en');
  const description_km = formData.get('description_km');
  const ingredients_en = formData.get('ingredients_en');
  const ingredients_km = formData.get('ingredients_km');
  const image_url = formData.get('image_url') || null;

  if (!title_en || !title_km || !description_en || !description_km || !ingredients_en || !ingredients_km) {
    return { error: 'Please fill in all required fields in both languages.' };
  }

  const { error } = await supabase
    .from('entries')
    .insert([{
      title_en,
      title_km,
      description_en,
      description_km,
      ingredients_en,
      ingredients_km,
      image_url,
      contributor_id: user.id
    }]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  
  return { success: 'Entry successfully added to the archive!' };
}

export async function updateEntry(prevState, formData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to update entries.' };
  }

  const id = formData.get('id');
  const title_en = formData.get('title_en');
  const title_km = formData.get('title_km');
  const description_en = formData.get('description_en');
  const description_km = formData.get('description_km');
  const ingredients_en = formData.get('ingredients_en');
  const ingredients_km = formData.get('ingredients_km');
  const image_url = formData.get('image_url') || null;

  if (!id || !title_en || !title_km || !description_en || !description_km || !ingredients_en || !ingredients_km) {
    return { error: 'Please fill in all required fields in both languages.' };
  }

  const { error } = await supabase
    .from('entries')
    .update({
      title_en,
      title_km,
      description_en,
      description_km,
      ingredients_en,
      ingredients_km,
      image_url
    })
    .eq('id', id)
    .eq('contributor_id', user.id);

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

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)
    .eq('contributor_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  
  return { success: 'Entry successfully deleted.' };
}
