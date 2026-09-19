"use client";

import { useActionState, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import { updateProfile, updateEmail, updatePassword } from '../../actions/profile.js';
// import { deleteEntry } from '../../actions/entries.js';
import { createClient } from '../../../utils/supabase/client.js';

export default function ProfilePage() {
  const params = useParams();
  const language = params?.lang || 'en';
  const router = useRouter();
  
  const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, null);
  const [emailState, emailAction, isEmailPending] = useActionState(updateEmail, null);
  const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, null);
  
  const [userMetadata, setUserMetadata] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  // const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.push(`/${language}/login`);
      } else {
        setUserMetadata(user.user_metadata);
        setUserEmail(user.email);
        /* supabase
          .from('entries')
          .select('*')
          .eq('contributor_id', user.id)
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) setEntries(data);
          }); */
      }
      setLoading(false);
    });
  }, [language, router]);

  useEffect(() => {
    if (profileState?.success) {
      setEditingProfile(false);
      createClient().auth.getUser().then(({ data: { user } }) => {
        if (user) setUserMetadata(user.user_metadata);
      });
    }
  }, [profileState]);

  useEffect(() => {
    if (emailState?.success) {
      setEditingEmail(false);
      createClient().auth.getUser().then(({ data: { user } }) => {
        if (user) setUserEmail(user.email);
      });
    }
  }, [emailState]);

  useEffect(() => {
    if (passwordState?.success) setEditingPassword(false);
  }, [passwordState]);

/*  const handleDeleteEntry = async (id) => {
    const confirmMessage = language === 'en' ? 'Are you sure you want to delete this entry?' : 'តើអ្នកប្រាកដជាចង់លុបឯកសារនេះទេ?';
    if (confirm(confirmMessage)) {
      const res = await deleteEntry(id);
      if (res?.success) {
        setEntries(entries.filter(e => e.id !== id));
      } else if (res?.error) {
        alert(res.error);
      }
    }
  }; */

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
  const labelStyle = { fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' };
  const valueStyle = { fontSize: '1rem', color: '#333', fontWeight: '500' };
  const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '1rem' };
  const errorStyle = { color: '#d32f2f', backgroundColor: '#ffebee', padding: '0.75rem', borderRadius: '4px', fontSize: '0.875rem', marginBottom: '1rem' };
  const successStyle = { color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '0.75rem', borderRadius: '4px', fontSize: '0.875rem', marginBottom: '1rem' };
  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)' };

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
        
        <div style={containerStyle}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--green-primary)', marginBottom: '1.5rem' }}>
            {language === 'en' ? 'Account Details' : 'ព័ត៌មានលម្អិតគណនី'}
          </h2>
          
          <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
            {!editingEmail ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={labelStyle}>{language === 'en' ? 'Email' : 'អ៊ីមែល'}</div>
                  <div style={valueStyle}>{userEmail}</div>
                </div>
                <button onClick={() => setEditingEmail(true)} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem' }}>
                  {language === 'en' ? 'Edit' : 'កែប្រែ'}
                </button>
              </div>
            ) : (
              <form action={emailAction}>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="email" style={labelStyle}>{language === 'en' ? 'New Email' : 'អ៊ីមែលថ្មី'}</label>
                  <input id="email" name="email" type="email" defaultValue={userEmail} required style={inputStyle} />
                </div>
                {emailState?.error && <div style={errorStyle}>{emailState.error}</div>}
                {emailState?.success && <div style={successStyle}>{emailState.success}</div>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setEditingEmail(false)} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem', flex: 1 }}>
                    {language === 'en' ? 'Cancel' : 'បោះបង់'}
                  </button>
                  <button type="submit" disabled={isEmailPending} className="btn-cta-primary" style={{ padding: '0.5rem 1rem', flex: 1 }}>
                    {isEmailPending ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            )}
            {!editingEmail && emailState?.success && <div style={{...successStyle, marginTop: '1rem'}}>{emailState.success}</div>}
          </div>

          <div>
            {!editingPassword ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={labelStyle}>{language === 'en' ? 'Password' : 'ពាក្យសម្ងាត់'}</div>
                  <div style={valueStyle}>********</div>
                </div>
                <button onClick={() => setEditingPassword(true)} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem' }}>
                  {language === 'en' ? 'Edit' : 'កែប្រែ'}
                </button>
              </div>
            ) : (
              <form action={passwordAction}>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="password" style={labelStyle}>{language === 'en' ? 'New Password' : 'ពាក្យសម្ងាត់ថ្មី'}</label>
                  <input id="password" name="password" type="password" required minLength={6} style={inputStyle} />
                </div>
                {passwordState?.error && <div style={errorStyle}>{passwordState.error}</div>}
                {passwordState?.success && <div style={successStyle}>{passwordState.success}</div>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setEditingPassword(false)} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem', flex: 1 }}>
                    {language === 'en' ? 'Cancel' : 'បោះបង់'}
                  </button>
                  <button type="submit" disabled={isPasswordPending} className="btn-cta-primary" style={{ padding: '0.5rem 1rem', flex: 1 }}>
                    {isPasswordPending ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            )}
            {!editingPassword && passwordState?.success && <div style={{...successStyle, marginTop: '1rem'}}>{passwordState.success}</div>}
          </div>
        </div>

        <div style={containerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--green-primary)', margin: 0 }}>
              {language === 'en' ? 'Profile Details' : 'ព័ត៌មានប្រវត្តិរូប'}
            </h2>
            {!editingProfile && (
              <button onClick={() => setEditingProfile(true)} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem' }}>
                {language === 'en' ? 'Edit' : 'កែប្រែ'}
              </button>
            )}
          </div>

          {!editingProfile ? (
            <div>
              <div style={rowStyle}>
                <div style={labelStyle}>{language === 'en' ? 'Username' : 'ឈ្មោះអ្នកប្រើប្រាស់'}</div>
                <div style={valueStyle}>{userMetadata?.username || '-'}</div>
              </div>
              <div style={rowStyle}>
                <div style={labelStyle}>{language === 'en' ? 'Full Name' : 'ឈ្មោះពេញ'}</div>
                <div style={valueStyle}>{userMetadata?.full_name || '-'}</div>
              </div>
              <div style={{ ...rowStyle, borderBottom: 'none' }}>
                <div style={labelStyle}>{language === 'en' ? 'Organization' : 'ស្ថាប័ន'}</div>
                <div style={valueStyle}>{userMetadata?.organization || '-'}</div>
              </div>
            </div>
          ) : (
            <form action={profileAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profileState?.error && <div style={errorStyle}>{profileState.error}</div>}
              {profileState?.success && <div style={successStyle}>{profileState.success}</div>}
              
              <div>
                <label htmlFor="username" style={labelStyle}>{language === 'en' ? 'Username' : 'ឈ្មោះអ្នកប្រើប្រាស់'}</label>
                <input id="username" name="username" type="text" defaultValue={userMetadata?.username || ''} required style={inputStyle} />
              </div>
              <div>
                <label htmlFor="full_name" style={labelStyle}>{language === 'en' ? 'Full Name' : 'ឈ្មោះពេញ'}</label>
                <input id="full_name" name="full_name" type="text" defaultValue={userMetadata?.full_name || ''} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="organization" style={labelStyle}>{language === 'en' ? 'Organization' : 'ស្ថាប័ន'}</label>
                <input id="organization" name="organization" type="text" defaultValue={userMetadata?.organization || ''} style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingProfile(false)} className="btn-ghost-gold" style={{ padding: '0.5rem 1rem', flex: 1 }}>
                  {language === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>
                <button type="submit" disabled={isProfilePending} className="btn-cta-primary" style={{ padding: '0.5rem 1rem', flex: 1 }}>
                  {isProfilePending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
          {!editingProfile && profileState?.success && <div style={{...successStyle, marginTop: '1rem'}}>{profileState.success}</div>}
        </div>

        {/* My Entries Section */}
        {/*
        <div style={containerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--green-primary)', margin: 0 }}>
              {language === 'en' ? 'My Entries' : 'ឯកសាររបស់ខ្ញុំ'}
            </h2>
            <Link href={`/${language}/add-entry`} className="btn-cta-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
              {language === 'en' ? 'Add New' : 'បន្ថែមថ្មី'}
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
                      {language === 'en' ? entry.title_en : entry.title_km}
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(entry.created_at).toLocaleDateString()} &middot; {entry.status}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
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
        */}

      </main>

      <Footer language={language} />
    </>
  );
}
