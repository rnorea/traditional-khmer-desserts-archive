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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Close menu on scroll down
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
    setIsMobileMenuOpen(false); // Close menu after switching language
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
        boxShadow: lastScrollY > 20 || isMobileMenuOpen ? '0 4px 20px rgba(0,0,0,0.05)' : 'none'
      }}>
        <div className="container">
          <nav className="navbar" style={{ padding: (lastScrollY > 20 || isMobileMenuOpen) ? '1rem 0' : '2.2rem 0', transition: 'padding 0.3s ease-in-out' }}>
            <Link href={`/${language}`} className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>{text.brand}</Link>
            
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
            
            <div className={`nav-content ${isMobileMenuOpen ? 'is-open' : ''}`}>
              <div className="nav-links">
                <Link href={`/${language}`} className={`nav-link ${pathname === `/${language}` ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>{text.home}</Link>
                <Link href={`/${language}/archive`} className={`nav-link ${pathname.includes('/archive') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>{text.theArchive}</Link>
                <a href="#" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{text.culturalOrigins}</a>
                <a href="#" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{text.aboutProject}</a>
              </div>

              <div className="nav-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button 
                  className="btn-ghost-gold" 
                  onClick={switchLanguage}
                  style={{ padding: '8px 16px', minWidth: '80px' }}
                >
                  {language === 'en' ? 'ខ្មែរ' : 'EN'}
                </button>
                <Link href={`/${language}/archive`} className="btn-cta-primary" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                  <span>{text.exploreArchive}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
