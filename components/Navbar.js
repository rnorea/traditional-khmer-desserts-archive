"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { t } from '../data/translations.js';

export default function Navbar({ language }) {
  const text = t[language] || t.en;
  const pathname = usePathname();
  const router = useRouter();
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const switchLanguage = () => {
    const newLang = language === 'en' ? 'kh' : 'en';
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    
    // Replace the language prefix in the URL
    // Handle cases where the URL might just be /en or /kh
    let newPath = pathname;
    if (pathname.startsWith(`/${language}`)) {
      newPath = pathname.replace(`/${language}`, `/${newLang}`);
    } else {
      newPath = `/${newLang}${pathname}`;
    }
    
    router.push(newPath || `/${newLang}`);
  };

  return (
    <>
      <div style={{ height: '100px' }} aria-hidden="true" />
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'var(--bg-cream)',
        zIndex: 100,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        boxShadow: lastScrollY > 20 ? '0 4px 20px rgba(0,0,0,0.05)' : 'none'
      }}>
        <div className="container">
          <nav className="navbar" style={{ padding: lastScrollY > 20 ? '1rem 0' : '2.2rem 0', transition: 'padding 0.3s ease-in-out' }}>
            <Link href={`/${language}`} className="brand-logo">{text.brand}</Link>
            
            <div className="nav-links">
              <Link href={`/${language}`} className={`nav-link ${pathname === `/${language}` ? 'active' : ''}`}>{text.home}</Link>
              <Link href={`/${language}/archive`} className={`nav-link ${pathname.includes('/archive') ? 'active' : ''}`}>{text.theArchive}</Link>
              <a href="#" className="nav-link">{text.culturalOrigins}</a>
              <a href="#" className="nav-link">{text.aboutProject}</a>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                className="btn-ghost-gold" 
                onClick={switchLanguage}
                style={{ padding: '8px 16px', minWidth: '80px' }}
              >
                {language === 'en' ? 'ខ្មែរ' : 'EN'}
              </button>
              <Link href={`/${language}/archive`} className="btn-cta-primary" style={{ textDecoration: 'none' }}>
                <span>{text.exploreArchive}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
