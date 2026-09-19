"use client";

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import { signup } from '../../actions/auth.js';

export default function SignupPage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const [state, formAction, isPending] = useActionState(signup, null);
  const [step, setStep] = useState(1);

  const handleNext = (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput.reportValidity() && passwordInput.reportValidity()) {
      setStep(2);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

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

            <div style={{ display: step === 1 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
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
            
            <button 
              onClick={handleNext}
              className="btn-cta-primary" 
              style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
            >
              {language === 'en' ? 'Next' : 'បន្ទាប់'}
            </button>
          </div>

          <div style={{ display: step === 2 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="username" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Username (optional)' : 'ឈ្មោះអ្នកប្រើប្រាស់ (ជាជម្រើស)'}
              </label>
              <input 
                id="username" 
                name="username" 
                type="text" 
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="organization" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Organization (optional)' : 'ស្ថាប័ន (ជាជម្រើស)'}
              </label>
              <input 
                id="organization" 
                name="organization" 
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
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button 
                onClick={handleBack}
                className="btn-ghost-gold" 
                style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0.75rem' }}
              >
                {language === 'en' ? 'Back' : 'ត្រឡប់ថយក្រោយ'}
              </button>
              <button 
                type="submit" 
                disabled={isPending}
                className="btn-cta-primary" 
                style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
              >
                {isPending ? (language === 'en' ? 'Signing up...' : 'កំពុងចុះឈ្មោះ...') : (language === 'en' ? 'Sign Up' : 'ចុះឈ្មោះ')}
              </button>
            </div>
          </div>
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
