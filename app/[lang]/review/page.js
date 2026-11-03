import Link from 'next/link';
import Navbar from '../../../components/Navbar.js';
import Footer from '../../../components/Footer.js';
import ReviewList from '../../../components/ReviewList.js';
import { createClient } from '../../../utils/supabase/server.js';
import { t } from '../../../data/translations.js';

export default async function ReviewPage({ params }) {
  const resolvedParams = await params;
  const language = resolvedParams?.lang || 'en';
  const isKh = language === 'kh';
  const text = t[language] || t.en;

  const supabase = await createClient();
  const { data: isReviewer } = await supabase.rpc('is_reviewer');

  if (isReviewer !== true) {
    const unauthorizedMessage = isKh
      ? 'ការចូលត្រូវបានបដិសេធ។ អ្នកមិនមានការអនុញ្ញាតឱ្យចូលមើលទំព័រនេះទេ។ សូមទាក់ទងអ្នកគ្រប់គ្រងរបស់អ្នក ប្រសិនបើអ្នកគិតថាអ្នកគួរតែមានសិទ្ធិចូលប្រើ។'
      : 'Access Denied. You are not authorized to view this page. Please contact your administrator if you believe you should have access.';
    const homeBtnText = isKh ? 'ត្រឡប់ទៅទំព័រដើម' : 'Go to Homepage';

    return (
      <>
        <Navbar language={language} />
        <main className="container" style={{ padding: '4rem 1rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center', padding: '2.5rem 2rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '12px', border: '1px solid #fecaca', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.6', fontWeight: 500 }}>
              {unauthorizedMessage}
            </p>
            <div style={{ marginTop: '1.75rem' }}>
              <Link href={`/${language}`} className="btn-cta-primary" style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.65rem 1.4rem' }}>
                {homeBtnText}
              </Link>
            </div>
          </div>
        </main>
        <Footer language={language} />
      </>
    );
  }

  const { data: pendingEntries } = await supabase
    .from('entries')
    .select('*, profiles(username, full_name, organization)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return (
    <>
      <Navbar language={language} />
      <main className="container" style={{ padding: '2rem 1rem', minHeight: '70vh' }}>
        <header style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>
            {isKh ? 'ផ្នែកគ្រប់គ្រង' : 'Editorial Workflow'}
          </span>
          <h1 style={{ fontSize: '2rem', margin: '0.25rem 0' }}>
            {text.reviewQueueTitle || (isKh ? 'ជួរត្រួតពិនិត្យកំណត់ត្រា' : 'Review Queue')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            {text.reviewSubtitle || (isKh ? 'ពិនិត្យមើលភាពត្រឹមត្រូវ និងភាពពេញលេញនៃសំណើមុននឹងបោះពុម្ពផ្សាយ។' : 'Evaluate pending submissions for authenticity and completeness before publishing.')}
          </p>
        </header>

        <ReviewList initialEntries={pendingEntries || []} language={language} />
      </main>
      <Footer language={language} />
    </>
  );
}
