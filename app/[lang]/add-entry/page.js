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
  const [fieldErrors, setFieldErrors] = useState({});

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push(`/${language}/login`);
      }
    });

    return () => subscription.unsubscribe();
  }, [language, router]);

  const validateField = (name, value) => {
    const isRequired = ['title_en', 'title_kh', 'description_en', 'description_kh', 'ingredients_en', 'ingredients_kh', 'instructions_en', 'instructions_kh'].includes(name);
    
    if (!value || value.trim() === '') {
      return isRequired ? (language === 'en' ? 'This field is required.' : 'ប្រអប់នេះតម្រូវឲ្យបំពេញ។') : null;
    }

    const fieldBase = name.replace(/_en$|_kh$/, '');
    const isEnglish = name.endsWith('_en');

    if (isEnglish) {
      const hasKhmer = /[\u1780-\u17FF]/.test(value);
      if (hasKhmer) return language === 'en' ? 'Cannot contain Khmer characters.' : 'មិនអាចមានតួអក្សរខ្មែរទេ។';
      
      const wordCount = value.trim().split(/\s+/).filter(w => w.length > 0).length;
      let minWords = 1;
      if (fieldBase === 'description' || fieldBase === 'ingredients') minWords = 5;
      else if (fieldBase === 'instructions') minWords = 10;
      
      if (wordCount < minWords) {
        return language === 'en' ? `Must contain at least ${minWords} word${minWords > 1 ? 's' : ''}.` : `ត្រូវមានយ៉ាងហោចណាស់ ${minWords} ពាក្យ។`;
      }
    } else if (name.endsWith('_kh')) {
      const hasEnglish = /[a-zA-Z]/.test(value);
      if (hasEnglish) return language === 'en' ? 'Cannot contain English characters.' : 'មិនអាចមានតួអក្សរអង់គ្លេសទេ។';
      
      const charCount = value.trim().length;
      let minChars = 2;
      if (fieldBase === 'description' || fieldBase === 'ingredients' || fieldBase === 'instructions') minChars = 10;
      
      if (charCount < minChars) {
        return language === 'en' ? `Must be at least ${minChars} characters long.` : `ត្រូវមានយ៉ាងហោចណាស់ ${minChars} តួអក្សរ។`;
      }
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.endsWith('_en') || name.endsWith('_kh')) {
      const errorMsg = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleSubmit = (e) => {
    const formData = new FormData(e.currentTarget);
    let hasError = false;
    const newErrors = {};
    
    ['title_en', 'title_kh', 'description_en', 'description_kh', 'ingredients_en', 'ingredients_kh', 'instructions_en', 'instructions_kh'].forEach(field => {
      const val = formData.get(field);
      const errorMsg = validateField(field, val);
      if (errorMsg) {
        newErrors[field] = errorMsg;
        hasError = true;
      }
    });
    
    if (hasError) {
      e.preventDefault();
      setFieldErrors(prev => ({ ...prev, ...newErrors }));
    }
  };

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

  const getInputStyle = (fieldName) => {
    const baseStyle = { width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' };
    if (fieldErrors[fieldName]) {
      return { ...baseStyle, border: '2px solid #d32f2f', outline: 'none' };
    }
    return baseStyle;
  };

  const labelStyle = { fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block', fontWeight: '500' };
  const errorTextStyle = { color: '#d32f2f', fontSize: '0.75rem', marginTop: '0.25rem' };
  
  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '80vh', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--green-primary)', marginBottom: '2rem', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
            {language === 'en' ? 'Add a New Dessert' : 'បន្ថែមបង្អែមថ្មី'}
          </h1>
          
          <form action={formAction} onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                <input id="title_en" name="title_en" type="text" required onChange={handleChange} style={getInputStyle('title_en')} />
                {fieldErrors.title_en && <div style={errorTextStyle}>{fieldErrors.title_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="title_kh" style={labelStyle}>ចំណងជើង (Khmer) *</label>
                <input id="title_kh" name="title_kh" type="text" required onChange={handleChange} style={getInputStyle('title_kh')} />
                {fieldErrors.title_kh && <div style={errorTextStyle}>{fieldErrors.title_kh}</div>}
              </div>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="description_en" style={labelStyle}>Description (English) *</label>
                <textarea id="description_en" name="description_en" required rows="5" onChange={handleChange} style={getInputStyle('description_en')} />
                {fieldErrors.description_en && <div style={errorTextStyle}>{fieldErrors.description_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="description_kh" style={labelStyle}>ការពិពណ៌នា (Khmer) *</label>
                <textarea id="description_kh" name="description_kh" required rows="5" onChange={handleChange} style={getInputStyle('description_kh')} />
                {fieldErrors.description_kh && <div style={errorTextStyle}>{fieldErrors.description_kh}</div>}
              </div>
            </div>

            {/* Ingredients */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="ingredients_en" style={labelStyle}>Ingredients (English) *</label>
                <textarea id="ingredients_en" name="ingredients_en" required rows="4" onChange={handleChange} style={getInputStyle('ingredients_en')} placeholder="E.g., Coconut milk, Palm sugar..." />
                {fieldErrors.ingredients_en && <div style={errorTextStyle}>{fieldErrors.ingredients_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="ingredients_kh" style={labelStyle}>គ្រឿងផ្សំ (Khmer) *</label>
                <textarea id="ingredients_kh" name="ingredients_kh" required rows="4" onChange={handleChange} style={getInputStyle('ingredients_kh')} placeholder="ឧទាហរណ៍៖ ខ្ទិះដូង, ស្ករត្នោត..." />
                {fieldErrors.ingredients_kh && <div style={errorTextStyle}>{fieldErrors.ingredients_kh}</div>}
              </div>
            </div>

            {/* Instructions */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="instructions_en" style={labelStyle}>Instructions (English) *</label>
                <textarea id="instructions_en" name="instructions_en" required rows="5" onChange={handleChange} style={getInputStyle('instructions_en')} placeholder="Press Enter to separate steps (e.g.,&#10;1. Boil water&#10;2. Add sugar)" />
                {fieldErrors.instructions_en && <div style={errorTextStyle}>{fieldErrors.instructions_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="instructions_kh" style={labelStyle}>ការណែនាំ (Khmer) *</label>
                <textarea id="instructions_kh" name="instructions_kh" required rows="5" onChange={handleChange} style={getInputStyle('instructions_kh')} placeholder="ចុច Enter ដើម្បីបំបែកជំហាននីមួយៗ (ឧ.&#10;១. ដាំទឹកឱ្យពុះ&#10;២. ដាក់ស្ករ)" />
                {fieldErrors.instructions_kh && <div style={errorTextStyle}>{fieldErrors.instructions_kh}</div>}
              </div>
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" style={labelStyle}>
                {language === 'en' ? 'Category' : 'ប្រភេទ'}
              </label>
              <select id="category" name="category" style={getInputStyle('category')} defaultValue="stickyRice">
                <option value="stickyRice">{language === 'en' ? 'Sticky Rice' : 'នំដំណើប'}</option>
                <option value="sweetSoups">{language === 'en' ? 'Sweet Soups' : 'បង្អែមទឹក'}</option>
                <option value="steamedSweets">{language === 'en' ? 'Steamed Sweets' : 'នំចំហុយ'}</option>
                <option value="snacks">{language === 'en' ? 'Snacks' : 'ចំណីចំណុក'}</option>
              </select>
            </div>

            {/* Region */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="region_en" style={labelStyle}>Region (English) - Optional</label>
                <input id="region_en" name="region_en" type="text" onChange={handleChange} style={getInputStyle('region_en')} placeholder="E.g., Battambang" />
                {fieldErrors.region_en && <div style={errorTextStyle}>{fieldErrors.region_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="region_kh" style={labelStyle}>តំបន់ (Khmer) - ជាជម្រើស</label>
                <input id="region_kh" name="region_kh" type="text" onChange={handleChange} style={getInputStyle('region_kh')} placeholder="ឧទាហរណ៍៖ បាត់ដំបង" />
                {fieldErrors.region_kh && <div style={errorTextStyle}>{fieldErrors.region_kh}</div>}
              </div>
            </div>

            {/* Source */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="source_en" style={labelStyle}>Source Provider (English) - Optional</label>
                <input id="source_en" name="source_en" type="text" onChange={handleChange} style={getInputStyle('source_en')} placeholder="E.g., Om Sokha" />
                {fieldErrors.source_en && <div style={errorTextStyle}>{fieldErrors.source_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="source_kh" style={labelStyle}>ប្រភពផ្តល់ព័ត៌មាន (Khmer) - ជាជម្រើស</label>
                <input id="source_kh" name="source_kh" type="text" onChange={handleChange} style={getInputStyle('source_kh')} placeholder="ឧទាហរណ៍៖ អ៊ុំសុខា" />
                {fieldErrors.source_kh && <div style={errorTextStyle}>{fieldErrors.source_kh}</div>}
              </div>
            </div>
            {/* Image URL */}
            <div>
              <label htmlFor="image_url" style={labelStyle}>
                {language === 'en' ? 'Image URL (Optional)' : 'តំណភ្ជាប់រូបភាព (ជាជម្រើស)'}
              </label>
              <input id="image_url" name="image_url" type="url" style={getInputStyle('image_url')} placeholder="https://example.com/image.jpg" />
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
