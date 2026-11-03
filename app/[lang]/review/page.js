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
      ? 'ការចូលប្រើត្រូវបានកម្រិត។ អ្នកត្រូវតែជាអ្នកត្រួតពិនិត្យដើម្បីចូលមើលទំព័រនេះ។'
      : 'Access restricted. You must be an administrator/reviewer to view the review queue.';

    return (
      <>
        <Navbar language={language} />
        <main className="container" style={{ padding: '3rem 1rem', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '12px', border: '1px solid #fecaca' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>
              {unauthorizedMessage}
            </p>
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
