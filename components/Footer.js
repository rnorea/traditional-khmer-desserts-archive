import Link from "next/link";
import collection from "../collection.config.js";
import { t } from '../data/translations.js';

export default function Footer({ language }) {
  const text = t[language] || t.en;
  const isKh = language === 'kh';

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link href={`/${language}`} className="brand-logo">{text.brand}</Link>
            <p style={isKh ? { lineHeight: 1.7 } : undefined}>
              {isKh ? (collection.descriptionKm || collection.description) : collection.description}
            </p>
          </div>

          <div className="footer-links-group" style={{ flexWrap: 'wrap', gap: '3rem' }}>
            <div className="footer-column">
              <h5>{text.navigation}</h5>
              <ul>
                <li><Link href={`/${language}`}>{text.home}</Link></li>
                <li><Link href={`/${language}/archive`}>{text.theArchive}</Link></li>
                <li><Link href={`/${language}/contribute`}>{text.submitEntry}</Link></li>
                <li><Link href={`/${language}/about`}>{text.aboutProject}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h5>{text.categories}</h5>
              <ul>
                <li><Link href={`/${language}/archive?category=stickyRice`}>{text.stickyRice}</Link></li>
                <li><Link href={`/${language}/archive?category=sweetSoups`}>{text.sweetSoups}</Link></li>
                <li><Link href={`/${language}/archive?category=steamedSweets`}>{text.steamedSweets}</Link></li>
                <li><Link href={`/${language}/archive?category=snacks`}>{text.snacks}</Link></li>
              </ul>
            </div>

            <div className="footer-column" style={{ maxWidth: '240px' }}>
              <h5>{text.sourcesCredits}</h5>
              <ul>
                <li style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                    {text.oralKnowledge}:
                  </span>
                  <span>{isKh ? 'អ៊ំ សុខា (ខេត្តត្បូងឃ្មុំ)' : 'Om Sokha (Tbong Khmum)'}</span>
                </li>
                <li style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                    {text.mediaCredits}:
                  </span>
                  <span>Kroya, Grantourismo, Dreamstime & YouTube</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 {isKh ? (collection.nameKm || collection.name) : collection.name}. {text.allRights}</p>
          <p>{text.curatedBy} {isKh ? (collection.curatorKm || collection.curator) : collection.curator}</p>
        </div>
      </div>
    </footer>
  );
}
