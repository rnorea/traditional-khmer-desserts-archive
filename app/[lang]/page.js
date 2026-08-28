"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar.js";
import Hero from "../../components/Hero.js";
import ArchiveCard from "../../components/ArchiveCard.js";
import Footer from "../../components/Footer.js";
import { traditionalKhmerDesserts } from "../../data/entries.js";

export default function Home() {
  const params = useParams();
  const language = params?.lang || 'en';

  const featuredEntries = traditionalKhmerDesserts.slice(0, 4);

  return (
    <>
      <Navbar language={language} />
      <Hero totalEntries={traditionalKhmerDesserts.length} language={language} />
      
      <main className="container" id="archive">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}>
            {language === 'en' ? 'Featured Archive' : 'បណ្ណសារលេចធ្លោ'}
          </h2>
        </div>

        <div className="archive-grid">
          {featuredEntries.map(entry => (
            <ArchiveCard key={entry.id} entry={entry} language={language} />
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
