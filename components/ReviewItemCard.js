"use client";

const btnBase = {
  flex: 1,
  padding: '0.45rem 0.75rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  borderRadius: '6px',
  textAlign: 'center',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default function ReviewItemCard({ entry, language, onSelect, onReview, isBusy, error }) {
  const isKh = language === 'kh';
  const displayName = isKh ? (entry.title_kh || entry.title_en) : (entry.title_en || entry.title_kh);
  const displayDescription = isKh ? (entry.description_kh || entry.description_en) : (entry.description_en || entry.description_kh);
  const submitter = entry.profiles?.full_name || entry.profiles?.username || (isKh ? 'អ្នកចូលរួម' : 'Contributor');

  const approveStyle = { ...btnBase, backgroundColor: 'transparent', color: 'var(--green-primary, #436A0D)', border: '1.5px solid var(--green-primary, #436A0D)', cursor: isBusy ? 'not-allowed' : 'pointer' };
  const returnStyle = { ...btnBase, backgroundColor: '#c62828', color: '#ffffff', border: '1.5px solid #c62828', cursor: isBusy ? 'not-allowed' : 'pointer' };

  return (
    <div className="archive-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div onClick={() => onSelect(entry)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="card-image-wrap">
          <span className="card-tag">{entry.category || 'Desserts'}</span>
          <img src={entry.image_url || "/images/dessert_placeholder.jpg"} alt={displayName} />
        </div>
        <div className="card-body">
          <h3 className="card-title">{displayName}</h3>
          <p className="card-description">{displayDescription}</p>
          <div className="card-footer" style={{ borderTop: 'none', padding: 0 }}>
            <div className="card-origin">
              <span>{submitter}</span>
              <span style={{ fontSize: '0.85em', opacity: 0.8 }}>{new Date(entry.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div style={{ padding: '0.5rem', margin: '0 0.5rem 0.5rem 0.5rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}

      {/* 2 Buttons on Bottom */}
      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#fafafa' }}>
        <button onClick={(e) => { e.stopPropagation(); onReview(entry.id, 'published'); }} disabled={isBusy} style={approveStyle}>{isKh ? 'អនុម័ត' : 'Approve'}</button>
        <button onClick={(e) => { e.stopPropagation(); onReview(entry.id, 'returned'); }} disabled={isBusy} style={returnStyle}>{isKh ? 'ប្រគល់ត្រឡប់' : 'Return'}</button>
      </div>
    </div>
  );
}
