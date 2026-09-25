"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../../components/Navbar.js";
import Footer from "../../../../components/Footer.js";
import EntryCard from "../../../../components/EntryCard.js";
import { createClient } from "../../../../utils/supabase/client.js";

export default function DessertDetail() {
  const params = useParams();
  const router = useRouter();
  const language = params?.lang || "en";
  const [dessert, setDessert] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const bannerRef = useRef(null);
  const recipeRef = useRef(null);
  const suggestionsRef = useRef(null);

  const [bannerVisible, setBannerVisible] = useState(false);
  const [recipeVisible, setRecipeVisible] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (params?.id) {
        const supabase = createClient();
        
        // Fetch the specific dessert
        const { data: found } = await supabase
          .from('entries')
          .select('*, profiles(full_name)')
          .eq('id', params.id)
          .eq('status', 'published')
          .single();
          
        if (found) {
          setDessert(found);
          
          // Fetch 3 other random desserts for suggestions
          const { data: others } = await supabase
            .from('entries')
            .select('*, profiles(full_name)')
            .eq('status', 'published')
            .neq('id', found.id)
            .limit(3);
            
          if (others) {
            setSuggestions(others);
          }
        } else {
          router.push(`/${language}/archive`);
        }
      }
      setLoading(false);
    };
    
    fetchData();
  }, [params?.id, router, language]);

  useEffect(() => {
    if (!dessert) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === bannerRef.current) setBannerVisible(true);
            if (entry.target === recipeRef.current) setRecipeVisible(true);
            if (entry.target === suggestionsRef.current) setSuggestionsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (bannerRef.current) observer.observe(bannerRef.current);
    if (recipeRef.current) observer.observe(recipeRef.current);
    if (suggestionsRef.current) observer.observe(suggestionsRef.current);

    return () => observer.disconnect();
  }, [dessert, suggestions.length]);

  if (loading) {
    return (
      <>
        <Navbar language={language} />
        <main className="container" style={{ paddingTop: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>{language === 'en' ? 'Loading...' : 'កំពុងផ្ទុក...'}</p>
        </main>
        <Footer language={language} />
      </>
    );
  }

  if (!dessert) return null;

  const displayName = language === 'kh' ? (dessert.title_kh || dessert.title_en) : dessert.title_en;
  const displayCategory = language === 'kh' ? 'បង្អែម' : 'Desserts';
  const displayLocation = '';
  const displayDescription = language === 'kh' ? (dessert.description_kh || dessert.description_en) : dessert.description_en;
  
  const rawIngredients = language === 'kh' ? (dessert.ingredients_kh || dessert.ingredients_en) : dessert.ingredients_en;
  const displayIngredients = rawIngredients ? rawIngredients.split('\n').filter(Boolean) : [];
  
  const rawSteps = language === 'kh' ? (dessert.instructions_kh || dessert.instructions_en) : dessert.instructions_en;
  const displaySteps = rawSteps ? rawSteps.split('\n').filter(Boolean) : [];
  
  const imageUrl = dessert.image_url || "/images/dessert_placeholder.jpg";

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
          <div
            ref={bannerRef}
            className={`sheet-banner detail-banner-animate ${bannerVisible ? "is-visible" : ""}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="meta-tag-sheet">
                {dessert.profiles?.full_name || (language === 'kh' ? 'មិនមានអ្នកនិពន្ធ' : 'Unknown Author')}
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

          <div
            ref={recipeRef}
            className={`sheet-grid detail-recipe-animate ${recipeVisible ? "is-visible" : ""}`}
          >
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
          <div
            ref={suggestionsRef}
            className={`suggestions-wrapper detail-suggestions-animate ${suggestionsVisible ? "is-visible" : ""}`}
          >
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
