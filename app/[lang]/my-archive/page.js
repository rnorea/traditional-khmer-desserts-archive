"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import { deleteEntry } from '../../actions/entries.js';
import { createClient } from '../../../utils/supabase/client.js';
import { t } from '../../../data/translations.js';

export default function MyArchivePage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const router = useRouter();
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const text = t[language] || t.en;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.push(`/${language}/login`);
      } else {
        supabase
          .from('entries')
          .select('*')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) setEntries(data);
            setLoading(false);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push(`/${language}/login`);
      }
    });

    return () => subscription.unsubscribe();
  }, [language, router]);

  const handleDeleteEntry = async (id) => {
    const confirmMessage = language === 'en' ? 'Are you sure you want to delete this entry?' : 'តើអ្នកប្រាកដជាចង់លុបឯកសារនេះទេ?';
    if (confirm(confirmMessage)) {
      const res = await deleteEntry(id);
      if (res?.success) {
        setEntries(entries.filter(e => e.id !== id));
      } else if (res?.error) {
        alert(res.error);
      }
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

  const containerStyle = { width: '100%', maxWidth: '1200px', backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '1.5rem' };

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--green-primary)', margin: 0 }}>
              {language === 'en' ? 'My Archive' : 'បណ្ណសាររបស់ខ្ញុំ'}
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                </button>
              </div>
              <Link href={`/${language}/contribute`} className="btn-cta-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                {language === 'en' ? 'Add New Entry' : 'បន្ថែមឯកសារថ្មី'}
              </Link>
            </div>
          </div>

          {entries.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
              {language === 'en' ? "You haven't added any entries yet." : 'អ្នកមិនទាន់បានបន្ថែមឯកសារណាមួយនៅឡើយទេ។'}
            </p>
          ) : viewMode === 'grid' ? (
            <div className="archive-grid">
              {entries.map(entry => {
                const displayName = language === 'kh' ? (entry.title_kh || entry.title_en) : entry.title_en;
                const displayCategory = entry.category && text[entry.category] ? text[entry.category] : (language === 'kh' ? 'បង្អែម' : 'Desserts'); 
                const displayDescription = language === 'kh' ? (entry.description_kh || entry.description_en) : entry.description_en;
                
                return (
                  <div key={entry.id} className="archive-card">
                    <div className="card-image-wrap">
                      <span className="card-tag">{displayCategory}</span>
                      {entry.status === 'published' ? (
                        <Link href={`/${language}/archive/${entry.id}?from=my-archive`}>
                          <img
                            src={entry.image_url || "/images/dessert_placeholder.jpg"}
                            alt={displayName}
                          />
                        </Link>
                      ) : (
                        <img
                          src={entry.image_url || "/images/dessert_placeholder.jpg"}
                          alt={displayName}
                        />
                      )}
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{displayName}</h3>
                      <p className="card-description">{displayDescription}</p>
                      
                      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                        <span style={{ 
                          color: entry.status === 'published' ? 'var(--green-primary)' : 
                                 entry.status === 'rejected' ? '#d32f2f' : '#f57c00',
                          fontWeight: 600
                        }}>
                          {entry.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="card-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                        {entry.status === 'published' && (
                          <Link href={`/${language}/archive/${entry.id}?from=my-archive`} className="btn-ghost-gold" style={{ padding: '0.25rem 0.5rem', textDecoration: 'none', fontSize: '0.85rem' }}>
                            {language === 'en' ? 'View' : 'មើល'}
                          </Link>
                        )}
                        <Link href={`/${language}/edit-entry/${entry.id}`} className="btn-ghost-gold" style={{ padding: '0.25rem 0.5rem', textDecoration: 'none', fontSize: '0.85rem' }}>
                          {language === 'en' ? 'Edit' : 'កែប្រែ'}
                        </Link>
                        <button onClick={() => handleDeleteEntry(entry.id)} className="btn-ghost-gold" style={{ padding: '0.25rem 0.5rem', color: '#d32f2f', fontSize: '0.85rem' }}>
                          {language === 'en' ? 'Delete' : 'លុប'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {entries.map(entry => (
                <div key={entry.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#333' }}>
                      {language === 'en' ? entry.title_en : entry.title_kh}
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                      <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                      <span style={{ 
                        color: entry.status === 'published' ? 'var(--green-primary)' : 
                               entry.status === 'rejected' ? '#d32f2f' : '#f57c00',
                        fontWeight: 500
                      }}>
                        {entry.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {entry.status === 'published' && (
                      <Link href={`/${language}/archive/${entry.id}?from=my-archive`} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                        {language === 'en' ? 'View' : 'មើល'}
                      </Link>
                    )}
                    <Link href={`/${language}/edit-entry/${entry.id}`} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                      {language === 'en' ? 'Edit' : 'កែប្រែ'}
                    </Link>
                    <button onClick={() => handleDeleteEntry(entry.id)} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem', color: '#d32f2f' }}>
                      {language === 'en' ? 'Delete' : 'លុប'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
