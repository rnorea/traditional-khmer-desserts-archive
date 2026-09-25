import Link from 'next/link';
import { t } from '../data/translations.js';

export default function ArchiveListItem({ entry, language }) {
  const text = t[language] || t.en;

  const displayName = language === 'kh' ? (entry.title_kh || entry.title_en) : entry.title_en;
  const displayCategory = language === 'kh' ? 'បង្អែម' : 'Desserts';
  const displayDescription = language === 'kh' ? (entry.description_kh || entry.description_en) : entry.description_en;
  const displayLocation = '';
  const authorName = entry.profiles?.full_name || (language === 'kh' ? 'មិនមានអ្នកនិពន្ធ' : 'Unknown Author');
  const displayPrepTime = text.na;
  
  // Extract first line of ingredients
  const ingredientsField = language === 'kh' ? (entry.ingredients_kh || entry.ingredients_en) : entry.ingredients_en;
  const displayPrimaryIng = ingredientsField ? ingredientsField.split('\n')[0] : '';

  return (
    <Link href={`/archive/${entry.id}`} className="list-row" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="list-photo">
        <img 
          src={entry.image_url || "/images/dessert_placeholder.jpg"} 
          alt={displayName} 
        />
      </div>
      <div className="list-content">
        <div className="list-header">
          <div className="list-title-group">
            <h3 className="list-title">{displayName}</h3>
            <span className="list-badge">{displayCategory}</span>
          </div>
          <div className="list-origin-tag" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span>{authorName}</span>
            {displayLocation && <span style={{ fontSize: '0.9em', opacity: 0.85 }}>{displayLocation}</span>}
          </div>
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
