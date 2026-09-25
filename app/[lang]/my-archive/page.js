"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import { deleteEntry } from '../../actions/entries.js';
import { createClient } from '../../../utils/supabase/client.js';

export default function MyArchivePage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const router = useRouter();
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const containerStyle = { width: '100%', maxWidth: '800px', backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '1.5rem' };

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--green-primary)', margin: 0 }}>
              {language === 'en' ? 'My Archive' : 'បណ្ណសាររបស់ខ្ញុំ'}
            </h2>
            <Link href={`/${language}/add-entry`} className="btn-cta-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
              {language === 'en' ? 'Add New Entry' : 'បន្ថែមឯកសារថ្មី'}
            </Link>
          </div>

          {entries.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
              {language === 'en' ? "You haven't added any entries yet." : 'អ្នកមិនទាន់បានបន្ថែមឯកសារណាមួយនៅឡើយទេ។'}
            </p>
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
                      <Link href={`/${language}/archive/${entry.id}`} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
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
