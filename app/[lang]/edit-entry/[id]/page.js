"use client";

import { useActionState, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar.js';
import Footer from '../../../../components/Footer.js';
import { updateEntry } from '../../../actions/entries.js';
import { createClient } from '../../../../utils/supabase/client.js';

export default function EditEntryPage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const entryId = params?.id;
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(updateEntry, null);
  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState(null);

  // Fetch entry and check auth
  useEffect(() => {
    const supabase = createClient();
    
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${language}/login`);
        return;
      }

      const { data: entryData, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', entryId)
        .eq('contributor_id', user.id)
        .single();
        
      if (error || !entryData) {
        // Entry not found or doesn't belong to user
        router.push(`/${language}/profile`);
      } else {
        setEntry(entryData);
        setLoading(false);
      }
    }
    
    loadData();
  }, [language, router, entryId]);

  if (loading) {
    return (
      <>
        <Navbar language={language} />
        <main className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>{language === 'en' ? 'Loading...' : 'កំពុងផ្ទុក...'}</p>
        </main>
        <Footer language={language} />
      </>
    );
  }

  const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' };
  const labelStyle = { fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block', fontWeight: '500' };
  
  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '80vh', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--green-primary)', marginBottom: '2rem', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
            {language === 'en' ? 'Edit Dessert' : 'កែប្រែបង្អែម'}
          </h1>
          
          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Hidden ID field */}
            <input type="hidden" name="id" value={entry.id} />

            {state?.error && (
              <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                {state.error}
              </div>
            )}

            {state?.success && (
              <div style={{ color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                {state.success}
              </div>
            )}
            
            {/* Title */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="title_en" style={labelStyle}>Title (English) *</label>
                <input id="title_en" name="title_en" type="text" defaultValue={entry.title_en} required style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="title_km" style={labelStyle}>ចំណងជើង (Khmer) *</label>
                <input id="title_km" name="title_km" type="text" defaultValue={entry.title_km} required style={inputStyle} />
              </div>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="description_en" style={labelStyle}>Description (English) *</label>
                <textarea id="description_en" name="description_en" defaultValue={entry.description_en} required rows="5" style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="description_km" style={labelStyle}>ការពិពណ៌នា (Khmer) *</label>
                <textarea id="description_km" name="description_km" defaultValue={entry.description_km} required rows="5" style={inputStyle} />
              </div>
            </div>

            {/* Ingredients */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="ingredients_en" style={labelStyle}>Ingredients (English) *</label>
                <textarea id="ingredients_en" name="ingredients_en" defaultValue={entry.ingredients_en} required rows="4" style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="ingredients_km" style={labelStyle}>គ្រឿងផ្សំ (Khmer) *</label>
                <textarea id="ingredients_km" name="ingredients_km" defaultValue={entry.ingredients_km} required rows="4" style={inputStyle} />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image_url" style={labelStyle}>
                {language === 'en' ? 'Image URL (Optional)' : 'តំណភ្ជាប់រូបភាព (ជាជម្រើស)'}
              </label>
              <input id="image_url" name="image_url" type="url" defaultValue={entry.image_url || ''} style={inputStyle} />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                onClick={() => router.push(`/${language}/profile`)}
                className="btn-ghost-gold" 
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}
              >
                {language === 'en' ? 'Back to Profile' : 'ត្រឡប់ទៅកាន់ប្រវត្តិរូប'}
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="btn-cta-primary" 
                style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}
              >
                {isPending ? (language === 'en' ? 'Saving...' : 'កំពុងរក្សាទុក...') : (language === 'en' ? 'Save Changes' : 'រក្សាទុកការផ្លាស់ប្តូរ')}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
