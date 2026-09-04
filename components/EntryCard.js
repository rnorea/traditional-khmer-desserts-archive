import Link from 'next/link';
import { t } from '../data/translations.js';

export default function EntryCard({ entry, language }) {
  const text = t[language] || t.en;

  const displayName = language === 'kh' ? (entry.nativeName || entry.name) : entry.name;
  const displayCategory = language === 'kh' ? (entry.categoryKm || entry.category || 'បង្អែម') : (entry.category || 'Desserts');
  const displayDescription = language === 'kh' ? (entry.descriptionKm || entry.description) : entry.description;
  const displayLocation = language === 'kh' ? (entry.locationKm || entry.location) : entry.location;

  return (
    <Link href={`/archive/${entry.id}`} className="archive-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card-image-wrap">
        <span className="card-tag">{displayCategory}</span>
        <img
          src={entry.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"}
          alt={displayName}
        />
      </div>
      <div className="card-body">
        <h3 className="card-title">{displayName}</h3>
        <p className="card-description">{displayDescription}</p>
        <div className="card-footer">
          <span className="card-origin">{displayLocation}</span>
          <span className="card-action-btn">
            <span>{text.seeDetail}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
