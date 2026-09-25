"use client";

import { useActionState, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import { addEntry } from '../../actions/entries.js';
import { createClient } from '../../../utils/supabase/client.js';

export default function AddEntryPage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(addEntry, null);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push(`/${language}/login`);
      } else {
        setLoading(false);
      }
    });
  }, [language, router]);

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
            {language === 'en' ? 'Add a New Dessert' : 'បន្ថែមបង្អែមថ្មី'}
          </h1>
          
          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                <input id="title_en" name="title_en" type="text" required style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="title_kh" style={labelStyle}>ចំណងជើង (Khmer) *</label>
                <input id="title_kh" name="title_kh" type="text" required style={inputStyle} />
              </div>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="description_en" style={labelStyle}>Description (English) *</label>
                <textarea id="description_en" name="description_en" required rows="5" style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="description_kh" style={labelStyle}>ការពិពណ៌នា (Khmer) *</label>
                <textarea id="description_kh" name="description_kh" required rows="5" style={inputStyle} />
              </div>
            </div>

            {/* Ingredients */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="ingredients_en" style={labelStyle}>Ingredients (English) *</label>
                <textarea id="ingredients_en" name="ingredients_en" required rows="4" style={inputStyle} placeholder="E.g., Coconut milk, Palm sugar..." />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="ingredients_kh" style={labelStyle}>គ្រឿងផ្សំ (Khmer) *</label>
                <textarea id="ingredients_kh" name="ingredients_kh" required rows="4" style={inputStyle} placeholder="ឧទាហរណ៍៖ ខ្ទិះដូង, ស្ករត្នោត..." />
              </div>
            </div>

            {/* Instructions */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="instructions_en" style={labelStyle}>Instructions (English) *</label>
                <textarea id="instructions_en" name="instructions_en" required rows="5" style={inputStyle} placeholder="Press Enter to separate steps (e.g.,&#10;1. Boil water&#10;2. Add sugar)" />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="instructions_kh" style={labelStyle}>ការណែនាំ (Khmer) *</label>
                <textarea id="instructions_kh" name="instructions_kh" required rows="5" style={inputStyle} placeholder="ចុច Enter ដើម្បីបំបែកជំហាននីមួយៗ (ឧ.&#10;១. ដាំទឹកឱ្យពុះ&#10;២. ដាក់ស្ករ)" />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image_url" style={labelStyle}>
                {language === 'en' ? 'Image URL (Optional)' : 'តំណភ្ជាប់រូបភាព (ជាជម្រើស)'}
              </label>
              <input id="image_url" name="image_url" type="url" style={inputStyle} placeholder="https://example.com/image.jpg" />
            </div>
            
            <button 
              type="submit" 
              disabled={isPending || state?.success}
              className="btn-cta-primary" 
              style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}
            >
              {isPending ? (language === 'en' ? 'Submitting...' : 'កំពុងបញ្ជូន...') : (language === 'en' ? 'Submit Entry' : 'បញ្ជូនឯកសារ')}
            </button>
          </form>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
