import Link from 'next/link';
import { t } from '../data/translations.js';

export default function ArchiveListItem({ entry, language }) {
  const text = t[language] || t.en;

  const displayName = language === 'kh' ? (entry.nativeName || entry.name) : entry.name;
  const displayCategory = language === 'kh' ? (entry.categoryKm || entry.category || 'បង្អែម') : (entry.category || 'Desserts');
  const displayDescription = language === 'kh' ? (entry.descriptionKm || entry.description) : entry.description;
  const displayLocation = language === 'kh' ? (entry.locationKm || entry.location) : entry.location;
  const displayPrepTime = language === 'kh' ? (entry.prepTimeKm || entry.prepTime || text.na) : (entry.prepTime || text.na);
  const displayPrimaryIng = language === 'kh' ? (entry.ingredientsKm?.[0] || entry.ingredients?.[0]) : entry.ingredients?.[0];

  return (
    <Link href={`/archive/${entry.id}`} className="list-row" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="list-photo">
        <img 
          src={entry.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"} 
          alt={displayName} 
        />
      </div>
      <div className="list-content">
        <div className="list-header">
          <div className="list-title-group">
            <h3 className="list-title">{displayName}</h3>
            <span className="list-badge">{displayCategory}</span>
          </div>
          <span className="list-origin-tag">{displayLocation}</span>
        </div>
        <p className="list-description">
          {displayDescription}
        </p>
        <div className="list-footer">
          <div className="list-meta-info">
            <span className="list-meta-item">{text.prep}: {displayPrepTime}</span>
            <span>•</span>
            <span className="list-meta-item">{text.primary}: {displayPrimaryIng ? displayPrimaryIng.substring(0, 30) + '...' : ''}</span>
          </div>
          <span className="card-action-btn">
            <span>{text.seeDetail}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
