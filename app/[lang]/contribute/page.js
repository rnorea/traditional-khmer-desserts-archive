"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import { createClient } from '../../../utils/supabase/client.js';

export default function ContributePage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, []);

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

  if (!user) {
    return (
      <>
        <Navbar language={language} />
        <main className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>{language === 'en' ? 'You must be logged in to contribute.' : 'អ្នកត្រូវតែចូលគណនីដើម្បីចូលរួមចំណែក។'}</p>
          <Link href={`/${language}/login`} className="btn-primary">
            {language === 'en' ? 'Log in' : 'ចូលគណនី'}
          </Link>
        </main>
        <Footer language={language} />
      </>
    );
  }

  const validateForm = (data) => {
    const errors = {};
    const rules = {
      title_en: { max: 100, req: true },
      title_kh: { max: 100, req: true },
      description_en: { max: 5000, req: true },
      description_kh: { max: 5000, req: true },
      ingredients_en: { max: 5000, req: true },
      ingredients_kh: { max: 5000, req: true },
      instructions_en: { max: 5000, req: true },
      instructions_kh: { max: 5000, req: true },
    };

    for (const [field, rule] of Object.entries(rules)) {
      if (rule.req && !data[field]) {
        errors[field] = 'This field is required.';
      } else if (data[field] && data[field].length > rule.max) {
        errors[field] = `Cannot exceed ${rule.max} characters.`;
      }
    }
    
    if (!data.photo || data.photo.size === 0) {
      errors.photo = 'A photo is required.';
    } else {
      const file = data.photo;
      if (file.size > 5242880) {
        errors.photo = 'Photo must be under 5MB.';
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        errors.photo = 'Only JPEG, PNG, and WebP are allowed.';
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      title_en: formData.get('title_en').trim(),
      title_kh: formData.get('title_kh').trim(),
      description_en: formData.get('description_en').trim(),
      description_kh: formData.get('description_kh').trim(),
      ingredients_en: formData.get('ingredients_en').trim(),
      ingredients_kh: formData.get('ingredients_kh').trim(),
      instructions_en: formData.get('instructions_en').trim(),
      instructions_kh: formData.get('instructions_kh').trim(),
      category: formData.get('category'),
      region_en: formData.get('region_en').trim(),
      region_kh: formData.get('region_kh').trim(),
      source_en: formData.get('source_en').trim(),
      source_kh: formData.get('source_kh').trim(),
      photo: formData.get('photo'),
    };

    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // Upload photo
      const file = data.photo;
      const ext = file.name.split('.').pop() || 'jpg';
      const uuid = crypto.randomUUID();
      const path = `${user.id}/${uuid}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(path, file, { upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setErrorMsg('Failed to upload photo. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(path);

      const imageUrl = publicUrlData.publicUrl;

      // Insert entry
      const { data: insertData, error: insertError } = await supabase
        .from('entries')
        .insert({
          title_en: data.title_en,
          title_kh: data.title_kh,
          description_en: data.description_en,
          description_kh: data.description_kh,
          ingredients_en: data.ingredients_en,
          ingredients_kh: data.ingredients_kh,
          instructions_en: data.instructions_en,
          instructions_kh: data.instructions_kh,
          category: data.category,
          region_en: data.region_en || null,
          region_kh: data.region_kh || null,
          source_en: data.source_en || null,
          source_kh: data.source_kh || null,
          image_url: imageUrl,
          author_id: user.id,
          status: 'published'
        })
        .select()
        .single();

      if (insertError || !insertData) {
        console.error('Insert error:', insertError);
        let msg = language === 'en' ? 'Failed to save entry. Please try again.' : 'បរាជ័យក្នុងការរក្សាទុកឯកសារ។ សូមព្យាយាមម្តងទៀត។';
        
        if (insertError?.message?.includes('violates check constraint')) {
          if (insertError.message.includes('check_inst_kh_length')) {
            msg = language === 'en' ? 'Khmer instructions cannot be empty or exceed 5000 characters.' : 'ការណែនាំ (Khmer) មិនអាចទទេ ឬលើសពី ៥០០០ តួអក្សរបានទេ។';
          } else if (insertError.message.includes('check_inst_en_length')) {
            msg = language === 'en' ? 'English instructions cannot be empty or exceed 5000 characters.' : 'ការណែនាំ (English) មិនអាចទទេ ឬលើសពី ៥០០០ តួអក្សរបានទេ។';
          } else if (insertError.message.includes('check_ingr_kh_length')) {
            msg = language === 'en' ? 'Khmer ingredients cannot be empty or exceed 5000 characters.' : 'គ្រឿងផ្សំ (Khmer) មិនអាចទទេ ឬលើសពី ៥០០០ តួអក្សរបានទេ។';
          } else if (insertError.message.includes('check_ingr_en_length')) {
            msg = language === 'en' ? 'English ingredients cannot be empty or exceed 5000 characters.' : 'គ្រឿងផ្សំ (English) មិនអាចទទេ ឬលើសពី ៥០០០ តួអក្សរបានទេ។';
          } else if (insertError.message.includes('check_desc_kh_length')) {
            msg = language === 'en' ? 'Khmer description cannot be empty or exceed 5000 characters.' : 'ការពិពណ៌នា (Khmer) មិនអាចទទេ ឬលើសពី ៥០០០ តួអក្សរបានទេ។';
          } else if (insertError.message.includes('check_desc_en_length')) {
            msg = language === 'en' ? 'English description cannot be empty or exceed 5000 characters.' : 'ការពិពណ៌នា (English) មិនអាចទទេ ឬលើសពី ៥០០០ តួអក្សរបានទេ។';
          } else if (insertError.message.includes('check_title')) {
            msg = language === 'en' ? 'Title cannot be empty or exceed 100 characters.' : 'ចំណងជើងមិនអាចទទេ ឬលើសពី ១០០ តួអក្សរបានទេ។';
          } else {
             msg = language === 'en' ? 'One of your fields has an invalid length. Please check your text.' : 'ប្រអប់អក្សររបស់អ្នកមួយមានប្រវែងមិនត្រឹមត្រូវ។ សូមត្រួតពិនិត្យអត្ថបទរបស់អ្នក។';
          }
        }
        
        setErrorMsg(msg);
        setIsSubmitting(false);
        return;
      }

      router.push(`/${language}/archive/${insertData.id}`);

    } catch (err) {
      console.error('Unexpected error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' };
  const labelStyle = { fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block', fontWeight: '500' };
  const errorStyle = { color: '#d32f2f', fontSize: '0.75rem', marginTop: '0.25rem' };

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '80vh', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--green-primary)', marginBottom: '2rem', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
            {language === 'en' ? 'Contribute an Entry' : 'ចូលរួមឯកសារ'}
          </h1>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {errorMsg && (
              <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}
            
            {/* Title */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="title_en" style={labelStyle}>Title (English) *</label>
                <input id="title_en" name="title_en" type="text" style={inputStyle} />
                {fieldErrors.title_en && <div style={errorStyle}>{fieldErrors.title_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="title_kh" style={labelStyle}>ចំណងជើង (Khmer) *</label>
                <input id="title_kh" name="title_kh" type="text" style={inputStyle} />
                {fieldErrors.title_kh && <div style={errorStyle}>{fieldErrors.title_kh}</div>}
              </div>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="description_en" style={labelStyle}>Description (English) *</label>
                <textarea id="description_en" name="description_en" rows="5" style={inputStyle} />
                {fieldErrors.description_en && <div style={errorStyle}>{fieldErrors.description_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="description_kh" style={labelStyle}>ការពិពណ៌នា (Khmer) *</label>
                <textarea id="description_kh" name="description_kh" rows="5" style={inputStyle} />
                {fieldErrors.description_kh && <div style={errorStyle}>{fieldErrors.description_kh}</div>}
              </div>
            </div>

            {/* Ingredients */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="ingredients_en" style={labelStyle}>Ingredients (English) *</label>
                <textarea id="ingredients_en" name="ingredients_en" rows="4" style={inputStyle} />
                {fieldErrors.ingredients_en && <div style={errorStyle}>{fieldErrors.ingredients_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="ingredients_kh" style={labelStyle}>គ្រឿងផ្សំ (Khmer) *</label>
                <textarea id="ingredients_kh" name="ingredients_kh" rows="4" style={inputStyle} />
                {fieldErrors.ingredients_kh && <div style={errorStyle}>{fieldErrors.ingredients_kh}</div>}
              </div>
            </div>

            {/* Instructions */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="instructions_en" style={labelStyle}>Instructions (English) *</label>
                <textarea id="instructions_en" name="instructions_en" rows="5" style={inputStyle} />
                {fieldErrors.instructions_en && <div style={errorStyle}>{fieldErrors.instructions_en}</div>}
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="instructions_kh" style={labelStyle}>ការណែនាំ (Khmer) *</label>
                <textarea id="instructions_kh" name="instructions_kh" rows="5" style={inputStyle} />
                {fieldErrors.instructions_kh && <div style={errorStyle}>{fieldErrors.instructions_kh}</div>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" style={labelStyle}>
                {language === 'en' ? 'Category' : 'ប្រភេទ'}
              </label>
              <select id="category" name="category" style={inputStyle} defaultValue="stickyRice">
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
                <input id="region_en" name="region_en" type="text" style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="region_kh" style={labelStyle}>តំបន់ (Khmer) - ជាជម្រើស</label>
                <input id="region_kh" name="region_kh" type="text" style={inputStyle} />
              </div>
            </div>

            {/* Source */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="source_en" style={labelStyle}>Source Provider (English) - Optional</label>
                <input id="source_en" name="source_en" type="text" style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label htmlFor="source_kh" style={labelStyle}>ប្រភពផ្តល់ព័ត៌មាន (Khmer) - ជាជម្រើស</label>
                <input id="source_kh" name="source_kh" type="text" style={inputStyle} />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label htmlFor="photo" style={labelStyle}>
                {language === 'en' ? 'Photo (Required, max 5MB, JPEG/PNG/WebP)' : 'រូបថត (ចាំបាច់, អតិបរមា 5MB, JPEG/PNG/WebP)'}
              </label>
              <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" style={inputStyle} />
              {fieldErrors.photo && <div style={errorStyle}>{fieldErrors.photo}</div>}
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-cta-primary" 
              style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}
            >
              {isSubmitting ? (language === 'en' ? 'Submitting...' : 'កំពុងបញ្ជូន...') : (language === 'en' ? 'Submit Entry' : 'បញ្ជូនឯកសារ')}
            </button>
          </form>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
