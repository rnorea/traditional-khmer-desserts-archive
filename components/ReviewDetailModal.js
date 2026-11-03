"use client";

const btnBase = {
  padding: '0.5rem 1.35rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  borderRadius: '6px',
  textAlign: 'center',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default function ReviewDetailModal({ entry, language, onClose, onReview, isBusy, error }) {
  if (!entry) return null;
  const isKh = language === 'kh';
  const submitter = entry.profiles?.full_name || entry.profiles?.username || (isKh ? 'អ្នកចូលរួម' : 'Contributor');
  const dateStr = new Date(entry.created_at).toLocaleDateString(isKh ? 'km-KH' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const approveStyle = { ...btnBase, backgroundColor: 'transparent', color: 'var(--green-primary, #436A0D)', border: '1.5px solid var(--green-primary, #436A0D)', cursor: isBusy ? 'not-allowed' : 'pointer' };
  const returnStyle = { ...btnBase, backgroundColor: '#c62828', color: '#ffffff', border: '1.5px solid #c62828', cursor: isBusy ? 'not-allowed' : 'pointer' };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}>{entry.category || 'Desserts'}</span>
            <h2 style={{ margin: '0.25rem 0' }}>{entry.title_kh} {entry.title_en ? `— ${entry.title_en}` : ''}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{isKh ? 'ដាក់ស្នើដោយ' : 'Submitted by'}: <strong>{submitter}</strong> &bull; {dateStr}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: 'var(--text-secondary)', lineHeight: 1 }}>&times;</button>
        </div>

        {entry.image_url && (
          <div style={{ width: '100%', height: '260px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
            <img src={entry.image_url} alt={entry.title_en || entry.title_kh} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        {(entry.region_kh || entry.region_en || entry.source_kh || entry.source_en) && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
            <strong>{isKh ? 'ប្រភព / តំបន់' : 'Origin / Source'}:</strong> {[entry.region_kh || entry.region_en, entry.source_kh || entry.source_en].filter(Boolean).join(' • ')}
          </p>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <strong>{isKh ? 'ការពិពណ៌នា' : 'Description'}</strong>
          <p style={{ margin: '0.35rem 0 0 0', lineHeight: 1.6 }}>{isKh ? (entry.description_kh || entry.description_en) : (entry.description_en || entry.description_kh)}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div>
            <strong>{isKh ? 'គ្រឿងផ្សំ' : 'Ingredients'}</strong>
            <p style={{ margin: '0.35rem 0 0 0', whiteSpace: 'pre-line', color: 'var(--text-secondary)' }}>{isKh ? (entry.ingredients_kh || entry.ingredients_en) : (entry.ingredients_en || entry.ingredients_kh)}</p>
          </div>
          <div>
            <strong>{isKh ? 'របៀបធ្វើ' : 'Instructions'}</strong>
            <p style={{ margin: '0.35rem 0 0 0', whiteSpace: 'pre-line', color: 'var(--text-secondary)' }}>{isKh ? (entry.instructions_kh || entry.instructions_en) : (entry.instructions_en || entry.instructions_kh)}</p>
          </div>
        </div>

        {error && <div style={{ padding: '0.75rem 1rem', marginTop: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        {/* 2 Buttons on Bottom */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={() => onReview(entry.id, 'published')} disabled={isBusy} style={approveStyle}>{isKh ? 'អនុម័ត' : 'Approve'}</button>
          <button onClick={() => onReview(entry.id, 'returned')} disabled={isBusy} style={returnStyle}>{isKh ? 'ប្រគល់ត្រឡប់' : 'Return'}</button>
        </div>
      </div>
    </div>
  );
}
