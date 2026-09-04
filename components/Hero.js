import collection from "../collection.config.js";
import { t } from '../data/translations.js';

export default function Hero({ totalEntries, language }) {
  const text = t[language] || t.en;

  return (
    <section className="hero-section">
      <div className="container" style={{ width: "100%", display: "flex" }}>
        <div className="hero-grid">
          
          <div className="hero-content">
            <div className="hero-badge animate-stagger delay-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              {text.digitalHeritage}
            </div>

            <h1 className="hero-title animate-stagger delay-2">
              {language === 'kh' ? (collection.nameKm || collection.name) : collection.name} <i>{language === 'kh' ? (collection.sourceKm || collection.source) : collection.source}</i>
            </h1>

            <p className="hero-description animate-stagger delay-3">
              {language === 'kh' ? (collection.descriptionKm || collection.description) : collection.description}
            </p>

            <div className="hero-actions animate-stagger delay-4">
              <button className="btn-capsule-dark">{text.learnAbout}</button>
              <button className="btn-ghost-gold">
                <span>{text.curatedBy} {collection.curator}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>

          <div className="hero-media hero-media-animate">
            <div className="hero-image-wrapper">
              <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1200" alt="Traditional Heritage Ingredients" />
            </div>

            <div className="hero-stamp">
              <div className="hero-stamp-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              </div>
              <div className="hero-stamp-text">
                <h4>{totalEntries} {text.entries}</h4>
                <p>{text.preserved}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
