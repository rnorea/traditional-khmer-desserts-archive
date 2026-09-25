"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { t } from '../data/translations.js';
import { createClient } from '../utils/supabase/client.js';

export default function Navbar({ language }) {
  const text = t[language] || t.en;
  const pathname = usePathname();
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    
    // Set cookie for middleware
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    // Set local storage as user requested
    localStorage.setItem('preferredLanguage', newLang);

    let newPath = pathname;
    if (pathname.startsWith(`/${language}`)) {
      newPath = pathname.replace(`/${language}`, `/${newLang}`);
    } else if (pathname === '/') {
      newPath = `/${newLang}`;
    } else {
      newPath = `/${newLang}${pathname}`;
    }

    router.push(newPath);
    setIsMobileMenuOpen(false); // Close menu after switching language
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
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
                <Link href={`/${language}/archive`} className={`nav-link ${pathname.includes('/archive') && !pathname.includes('/my-archive') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>{text.theArchive}</Link>
                
                {user ? (
                  <Link href={`/${language}/my-archive`} className={`nav-link ${pathname.includes('/my-archive') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                    {language === 'en' ? 'My Archive' : 'បណ្ណសាររបស់ខ្ញុំ'}
                  </Link>
                ) : (
                  <Link href={`/${language}/login`} className={`nav-link`} onClick={() => setIsMobileMenuOpen(false)} title={language === 'en' ? 'Login to access your archive' : 'ចូលគណនីដើម្បីចូលប្រើបណ្ណសាររបស់អ្នក'}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      {language === 'en' ? 'My Archive' : 'បណ្ណសាររបស់ខ្ញុំ'}
                    </span>
                  </Link>
                )}

                <Link href={`/${language}/about`} className={`nav-link ${pathname.includes('/about') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>{text.aboutProject}</Link>
              </div>

              <div className="nav-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  className="btn-ghost-gold"
                  onClick={switchLanguage}
                  style={{ padding: '8px 16px', minWidth: '80px' }}
                >
                  {language === 'en' ? 'ខ្មែរ' : 'EN'}
                </button>
                {user ? (
                  <>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'none' }}>{user.email}</span>
                    <Link href={`/${language}/profile`} style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="user-email" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        {user.user_metadata?.full_name || user.user_metadata?.username || (user.email.length > 20 ? user.email.substring(0, 17) + '...' : user.email)}
                      </span>
                    </Link>
                    <button onClick={handleLogout} className="btn-ghost-gold" style={{ padding: '8px 16px' }}>
                      {language === 'en' ? 'Logout' : 'ចាកចេញ'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href={`/${language}/login`} className="btn-ghost-gold" style={{ padding: '8px 16px', textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                      {language === 'en' ? 'Log In' : 'ចូល'}
                    </Link>
                    <Link href={`/${language}/signup`} className="btn-cta-primary" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                      {language === 'en' ? 'Sign Up' : 'ចុះឈ្មោះ'}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
