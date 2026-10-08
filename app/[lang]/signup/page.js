"use client";

import { useActionState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import { signup } from '../../actions/auth.js';

export default function SignupPage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--green-primary)', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
            {language === 'en' ? 'Create an Account' : 'បង្កើតគណនី'}
          </h1>
          
          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {state?.error && (
              <div style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '0.75rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                {state.error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Email' : 'អ៊ីមែល'}
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="password" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Password' : 'ពាក្យសម្ងាត់'}
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="confirm_password" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Confirm Password' : 'បញ្ជាក់ពាក្យសម្ងាត់'}
              </label>
              <input 
                id="confirm_password" 
                name="confirm_password" 
                type="password" 
                required 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="full_name" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Full Name (optional)' : 'ឈ្មោះពេញ (ជាជម្រើស)'}
              </label>
              <input 
                id="full_name" 
                name="full_name" 
                type="text" 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
              <input 
                id="terms" 
                name="terms" 
                type="checkbox" 
                required 
                style={{ marginTop: '0.25rem' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'I agree to the terms and conditions' : 'ខ្ញុំយល់ព្រមតាមលក្ខខណ្ឌ'}
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={isPending}
              className="btn-cta-primary" 
              style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
            >
              {isPending ? (language === 'en' ? 'Signing up...' : 'កំពុងចុះឈ្មោះ...') : (language === 'en' ? 'Sign Up' : 'ចុះឈ្មោះ')}
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {language === 'en' ? "Already have an account? " : "មានគណនីរួចហើយមែនទេ? "}
            <Link href={`/${language}/login`} style={{ color: 'var(--green-primary)', fontWeight: '600' }}>
              {language === 'en' ? 'Log in' : 'ចូល'}
            </Link>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
