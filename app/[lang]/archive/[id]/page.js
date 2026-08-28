"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../../components/Navbar.js";
import Footer from "../../../../components/Footer.js";
import ArchiveCard from "../../../../components/ArchiveCard.js";
import { traditionalKhmerDesserts } from "../../../../data/entries.js";

export default function DessertDetail() {
  const params = useParams();
  const router = useRouter();
  const language = params?.lang || "en";
  const [dessert, setDessert] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (params?.id) {
      const found = traditionalKhmerDesserts.find(d => d.id.toString() === params.id);
      if (found) {
        setDessert(found);
        const others = traditionalKhmerDesserts.filter(d => d.id !== found.id);
        setSuggestions(others.slice(0, 3));
      } else {
        router.push(`/${language}/archive`);
      }
    }
  }, [params?.id, router, language]);

  if (!dessert) return null;

  const displayName = language === 'kh' ? (dessert.nativeName || dessert.name) : dessert.name;
  const displayCategory = language === 'kh' ? (dessert.categoryKm || dessert.category || 'បង្អែម') : (dessert.category || 'Desserts');
  const displayLocation = language === 'kh' ? (dessert.locationKm || dessert.location) : dessert.location;
  const displayDescription = language === 'kh' ? (dessert.descriptionKm || dessert.description) : dessert.description;
  const displayIngredients = language === 'kh' ? (dessert.ingredientsKm || dessert.ingredients) : dessert.ingredients;
  const displaySteps = language === 'kh' ? (dessert.stepsKm || dessert.steps) : dessert.steps;
  const imageUrl = dessert.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200";

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link href={`/${language}/archive`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            {language === 'en' ? 'Back to Archive' : 'ត្រឡប់ទៅបណ្ណសារវិញ'}
          </Link>
        </div>

        <div className="card-sheet">
          <div className="sheet-banner" style={{ backgroundImage: `url(${imageUrl})` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="meta-tag-sheet">
                {displayLocation}
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {displayCategory}
              </span>
            </div>
            <h3 style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>{displayName}</h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.95, textShadow: '0 1px 4px rgba(0,0,0,0.5)', maxWidth: '600px', marginTop: '8px' }}>
              {displayDescription}
            </p>
          </div>

          <div className="sheet-grid">
            <div className="recipe-section recipe-section-left">
              <h4>{language === 'en' ? 'Ingredients' : 'គ្រឿងផ្សំ'}</h4>
              <ul className="ingredients-list">
                {displayIngredients?.map((ing, idx) => (
                  <li key={idx}>
                    <span><span style={{ color: 'var(--gold-accent)', marginRight: '8px' }}>•</span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sheet-divider"></div>

            <div className="recipe-section">
              <h4>{language === 'en' ? 'How to Make' : 'វិធីធ្វើ'}</h4>
              <ol className="steps-list">
                {displaySteps?.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-wrapper">
            <h3>{language === 'en' ? 'You Might Also Like' : 'បង្អែមផ្សេងទៀតដែលអ្នកអាចចូលចិត្ត'}</h3>
            <div className="suggestions-grid">
              {suggestions.map(sug => (
                <ArchiveCard key={sug.id} entry={sug} language={language} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer language={language} />
    </>
  );
}
