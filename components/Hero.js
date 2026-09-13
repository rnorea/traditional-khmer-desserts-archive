import collection from "../collection.config.js";
import { t } from '../data/translations.js';
import Link from "next/link";

export default function Hero({ totalEntries, language }) {
  const text = t[language] || t.en;

  return (
    <section className="hero-section">
      <div className="container" style={{ width: "100%", display: "flex" }}>
        <div className="hero-grid">

          <div className="hero-content">
            <div className="hero-badge animate-stagger delay-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
              {text.digitalHeritage}
            </div>

            <h1 className="hero-title animate-stagger delay-2">
              {language === 'kh' ? (collection.nameKm || collection.name) : collection.name} <i>{language === 'kh' ? (collection.sourceKm || collection.source) : collection.source}</i>
            </h1>

            <p className="hero-description animate-stagger delay-3">
              {language === 'kh' ? (collection.descriptionKm || collection.description) : collection.description}
            </p>

            <div className="hero-actions animate-stagger delay-4" style={{ alignItems: 'center' }}>
              <Link href={`/${language}/about`} className="btn-capsule-dark" style={{ textDecoration: 'none' }}>
                {text.learnAbout}
              </Link>
              <div className="curator-label" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, padding: '0 12px' }}>
                <span>{text.curatedBy} {language === 'kh' ? (collection.curatorKm || collection.curator) : collection.curator}</span>
              </div>
            </div>
          </div>

          <div className="hero-media hero-media-animate">
            <div className="hero-image-wrapper">
              <img src="/images/khmer_desserts.jpg" alt="Khmer Desserts Archive" />
            </div>

            <div className="hero-stamp">
              <div className="hero-stamp-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
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
