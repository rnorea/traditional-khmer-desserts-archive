"use client";

import { useActionState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import { login } from '../../actions/auth.js';

export default function LoginPage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--green-primary)', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
            {language === 'en' ? 'Welcome Back' : 'សូមស្វាគមន៍មកវិញ'}
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
            
            <button 
              type="submit" 
              disabled={isPending}
              className="btn-cta-primary" 
              style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
            >
              {isPending ? (language === 'en' ? 'Logging in...' : 'កំពុងចូល...') : (language === 'en' ? 'Log In' : 'ចូល')}
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {language === 'en' ? "Don't have an account? " : "មិនទាន់មានគណនីមែនទេ? "}
            <Link href={`/${language}/signup`} style={{ color: 'var(--green-primary)', fontWeight: '600' }}>
              {language === 'en' ? 'Sign up' : 'ចុះឈ្មោះ'}
            </Link>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
