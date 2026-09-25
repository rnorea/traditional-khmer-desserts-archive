import Link from 'next/link';
import { t } from '../data/translations.js';

export default function EntryCard({ entry, language }) {
  const text = t[language] || t.en;

  const displayName = language === 'kh' ? (entry.title_kh || entry.title_en) : entry.title_en;
  // Fallback to empty string since categories aren't in the db anymore
  const displayCategory = language === 'kh' ? 'បង្អែម' : 'Desserts'; 
  const displayDescription = language === 'kh' ? (entry.description_kh || entry.description_en) : entry.description_en;
  const displayLocation = ''; // Removed from schema
  const authorName = entry.profiles?.full_name || (language === 'kh' ? 'មិនមានអ្នកនិពន្ធ' : 'Unknown Author');

  return (
    <Link href={`/archive/${entry.id}`} className="archive-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card-image-wrap">
        <span className="card-tag">{displayCategory}</span>
        <img
          src={entry.image_url || "/images/dessert_placeholder.jpg"}
          alt={displayName}
        />
      </div>
      <div className="card-body">
        <h3 className="card-title">{displayName}</h3>
        <p className="card-description">{displayDescription}</p>
        <div className="card-footer">
          <div className="card-origin" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>{authorName}</span>
            {displayLocation && <span style={{ fontSize: '0.9em', opacity: 0.85 }}>{displayLocation}</span>}
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
