import Link from "next/link";
import Navbar from "../../components/Navbar.js";
import Hero from "../../components/Hero.js";
import EntryCard from "../../components/EntryCard.js";
import Footer from "../../components/Footer.js";
import { createClient } from "../../utils/supabase/server.js";

export default async function Home({ params }) {
  const resolvedParams = await params;
  const language = resolvedParams?.lang || 'en';

  const supabase = await createClient();
  
  // Fetch total count of published entries
  const { count } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  // Fetch featured entries (first 4)
  const { data: featuredEntries } = await supabase
    .from('entries')
    .select('*, profiles(full_name)')
    .eq('status', 'published')
    .order('created_at', { ascending: true })
    .limit(4);

  return (
    <>
      <Navbar language={language} />
      <Hero totalEntries={count || 0} language={language} />
      
      <main className="container" id="archive">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}>
            {language === 'en' ? 'Featured Archive' : 'បណ្ណសារលេចធ្លោ'}
          </h2>
        </div>

        <div className="archive-grid">
          {featuredEntries?.map(entry => (
            <EntryCard key={entry.id} entry={entry} language={language} />
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '40px' }}>
          <Link href={`/${language}/archive`} className="btn-cta-primary" style={{ textDecoration: 'none' }}>
            {language === 'en' ? 'See all archive' : 'មើលបណ្ណសារទាំងអស់'}
          </Link>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
