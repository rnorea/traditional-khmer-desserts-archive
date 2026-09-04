"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar.js";
import Footer from "../../../components/Footer.js";
import EntryCard from "../../../components/EntryCard.js";
import { traditionalKhmerDesserts } from "../../../data/entries.js";

export default function DessertDetail() {
  const params = useParams();
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [dessert, setDessert] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (params?.id) {
      const found = traditionalKhmerDesserts.find(d => d.id.toString() === params.id);
      if (found) {
        setDessert(found);
        // Get 3 other desserts for suggestions
        const others = traditionalKhmerDesserts.filter(d => d.id !== found.id);
        // Just take the first 3 for simplicity, or shuffle if preferred
        setSuggestions(others.slice(0, 3));
      } else {
        router.push("/archive");
      }
    }
  }, [params?.id, router]);

  if (!dessert) return null; // or a loading spinner

  const displayName = language === 'km' ? (dessert.nativeName || dessert.name) : dessert.name;
  const displayCategory = language === 'km' ? (dessert.categoryKm || dessert.category || 'បង្អែម') : (dessert.category || 'Desserts');
  const displayLocation = language === 'km' ? (dessert.locationKm || dessert.location) : dessert.location;
  const displayDescription = language === 'km' ? (dessert.descriptionKm || dessert.description) : dessert.description;
  const displayIngredients = language === 'km' ? (dessert.ingredientsKm || dessert.ingredients) : dessert.ingredients;
  const displaySteps = language === 'km' ? (dessert.stepsKm || dessert.steps) : dessert.steps;
  const imageUrl = dessert.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200";

  return (
    <>
      <Navbar language={language} onLanguageChange={setLanguage} />
      
      <main className="container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
        
        {/* Back Button */}
        <div style={{ marginBottom: '20px' }}>
          <Link href="/archive" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            {language === 'en' ? 'Back to Archive' : 'ត្រឡប់ទៅបណ្ណសារវិញ'}
          </Link>
        </div>

        {/* Floating Recipe Sheet */}
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
            {/* Ingredients (Left Column) */}
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

            {/* Method (Right Column) */}
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

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="suggestions-wrapper">
            <h3>{language === 'en' ? 'You Might Also Like' : 'បង្អែមផ្សេងទៀតដែលអ្នកអាចចូលចិត្ត'}</h3>
            <div className="suggestions-grid">
              {suggestions.map(sug => (
                <EntryCard key={sug.id} entry={sug} language={language} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer language={language} />
    </>
  );
}
