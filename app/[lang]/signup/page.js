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

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value, otherValue = '') => {
    if (!value) return language === 'en' ? 'This field is required.' : 'ប្រអប់នេះតម្រូវឲ្យបំពេញ។';
    
    if (name === 'password') {
      if (value.length < 6) {
        return language === 'en' ? 'Password must be at least 6 characters.' : 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ។';
      }
    } else if (name === 'confirm_password') {
      if (value !== otherValue) {
        return language === 'en' ? 'Passwords do not match.' : 'ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។';
      }
    }
    return null;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const errorMsg = validateField('password', val);
    let confirmErrorMsg = fieldErrors.confirm_password;
    if (confirmPassword) {
      confirmErrorMsg = validateField('confirm_password', confirmPassword, val);
    }
    setFieldErrors(prev => ({ ...prev, password: errorMsg, confirm_password: confirmErrorMsg }));
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    const errorMsg = validateField('confirm_password', val, password);
    setFieldErrors(prev => ({ ...prev, confirm_password: errorMsg }));
  };

  const getInputStyle = (fieldName) => {
    const baseStyle = { width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem' };
    if (fieldErrors[fieldName]) {
      return { ...baseStyle, border: '2px solid #d32f2f', outline: 'none' };
    }
    return baseStyle;
  };

  const handleSubmit = (e) => {
    const passError = validateField('password', password);
    const confirmError = validateField('confirm_password', confirmPassword, password);
    
    if (passError || confirmError) {
      e.preventDefault();
      setFieldErrors(prev => ({ ...prev, password: passError, confirm_password: confirmError }));
    }
  };

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--green-primary)', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
            {language === 'en' ? 'Create an Account' : 'បង្កើតគណនី'}
          </h1>
          
          <form action={formAction} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordChange}
                style={getInputStyle('password')}
              />
              {fieldErrors.password && <div style={{ color: '#d32f2f', fontSize: '0.75rem' }}>{fieldErrors.password}</div>}
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
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordChange}
                style={getInputStyle('confirm_password')}
              />
              {fieldErrors.confirm_password && <div style={{ color: '#d32f2f', fontSize: '0.75rem' }}>{fieldErrors.confirm_password}</div>}
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
