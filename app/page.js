"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar.js";
import Hero from "../components/Hero.js";
import EntryCard from "../components/EntryCard.js";
import Footer from "../components/Footer.js";
import { traditionalKhmerDesserts } from "../data/entries.js";

export default function Home() {
  const [language, setLanguage] = useState("en");

  const featuredEntries = traditionalKhmerDesserts.slice(0, 4);

  return (
    <>
      <Navbar language={language} onLanguageChange={setLanguage} />
      <Hero totalEntries={traditionalKhmerDesserts.length} language={language} />

      <main className="container" id="archive">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}>
            {language === 'en' ? 'Featured Archive' : 'បណ្ណសារលេចធ្លោ'}
          </h2>
        </div>

        <div className="archive-grid">
          {featuredEntries.map(entry => (
            <EntryCard key={entry.id} entry={entry} language={language} />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '40px' }}>
          <Link href="/archive" className="btn-cta-primary" style={{ textDecoration: 'none' }}>
            {language === 'en' ? 'See all archive' : 'មើលបណ្ណសារទាំងអស់'}
          </Link>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
