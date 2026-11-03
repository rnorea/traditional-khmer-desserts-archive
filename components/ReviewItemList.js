"use client";

const btnBase = {
  padding: '0.45rem 1rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  borderRadius: '6px',
  textAlign: 'center',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
};

export default function ReviewItemList({ entry, language, onSelect, onReview, isBusy, error }) {
  const isKh = language === 'kh';
  const displayName = isKh ? (entry.title_kh || entry.title_en) : (entry.title_en || entry.title_kh);
  const displayDescription = isKh ? (entry.description_kh || entry.description_en) : (entry.description_en || entry.description_kh);
  const submitter = entry.profiles?.full_name || entry.profiles?.username || (isKh ? 'អ្នកចូលរួម' : 'Contributor');

  const isDisabled = isBusy || Boolean(error);
  const approveStyle = { ...btnBase, backgroundColor: 'transparent', color: 'var(--green-primary, #436A0D)', border: '1.5px solid var(--green-primary, #436A0D)', cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 };
  const returnStyle = { ...btnBase, backgroundColor: '#c62828', color: '#ffffff', border: '1.5px solid #c62828', cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 };

  return (
    <div style={{ marginBottom: '1.25rem', backgroundColor: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
      <div className="list-row" onClick={() => onSelect(entry)} style={{ cursor: 'pointer', border: 'none', margin: 0 }}>
        <div className="list-photo">
          <img src={entry.image_url || "/images/dessert_placeholder.jpg"} alt={displayName} />
        </div>
        <div className="list-content">
          <div className="list-header">
            <div className="list-title-group">
              <h3 className="list-title">{displayName}</h3>
              <span className="list-badge">{entry.category || 'Desserts'}</span>
            </div>
            <div className="list-origin-tag">
              <span>{entry.region_kh || entry.region_en || ''}</span>
            </div>
          </div>
          <p className="list-description">{displayDescription}</p>
          <div className="list-meta-info" style={{ marginTop: 'auto' }}>
            <span className="list-meta-item">{submitter} &bull; {new Date(entry.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Right side stacked buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '105px', flexShrink: 0, justifyContent: 'center' }}>
          <button onClick={(e) => { e.stopPropagation(); if (!isDisabled) onReview(entry.id, 'published'); }} disabled={isDisabled} style={approveStyle}>{isKh ? 'អនុម័ត' : 'Approve'}</button>
          <button onClick={(e) => { e.stopPropagation(); if (!isDisabled) onReview(entry.id, 'returned'); }} disabled={isDisabled} style={returnStyle}>{isKh ? 'ប្រគល់ត្រឡប់' : 'Return'}</button>
        </div>
      </div>

      {error && <div style={{ padding: '0.5rem 1rem', backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.4 }}>{error}</div>}
    </div>
  );
}
