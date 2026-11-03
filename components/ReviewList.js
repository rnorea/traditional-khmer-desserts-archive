"use client";

import { useState } from 'react';
import { createClient } from '../utils/supabase/client.js';
import ReviewItemCard from './ReviewItemCard.js';
import ReviewItemList from './ReviewItemList.js';
import ReviewDetailModal from './ReviewDetailModal.js';

export default function ReviewList({ initialEntries, language }) {
  const [entries, setEntries] = useState(initialEntries || []);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [errors, setErrors] = useState({});

  const isKh = language === 'kh';
  const emptyMsg = isKh
    ? 'មិនមានសំណើរង់ចាំការត្រួតពិនិត្យទេ។ រាល់កំណត់ត្រាទាំងអស់ត្រូវបានដំណើរការរួចរាល់។'
    : 'No pending submissions to review. All entries have been processed.';
  const failMsg = isKh
    ? 'មិនអាចធ្វើបច្ចុប្បន្នភាពស្ថានភាពកំណត់ត្រាបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។'
    : 'Failed to update entry status. Please check your connection and try again.';

  const handleReview = async (entryId, decision) => {
    setBusyId(entryId);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('review_entry', {
        entry_id: entryId,
        decision
      });

      if (error || data !== true) {
        setErrors(prev => ({ ...prev, [entryId]: failMsg }));
      } else {
        setEntries(prev => prev.filter(e => e.id !== entryId));
        if (selectedEntry?.id === entryId) setSelectedEntry(null);
        setErrors(prev => {
          const next = { ...prev };
          delete next[entryId];
          return next;
        });
      }
    } catch {
      setErrors(prev => ({ ...prev, [entryId]: failMsg }));
    } finally {
      setBusyId(null);
    }
  };

  if (!entries.length) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px', backgroundColor: '#fff', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: '1.1rem', margin: 0 }}>{emptyMsg}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', gap: '0.5rem' }}>
        <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid View">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </button>
        <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List View">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="archive-grid">
          {entries.map(entry => (
            <ReviewItemCard key={entry.id} entry={entry} language={language} onSelect={setSelectedEntry} onReview={handleReview} isBusy={busyId === entry.id} error={errors[entry.id]} />
          ))}
        </div>
      ) : (
        <div className="archive-list-wrap">
          {entries.map(entry => (
            <ReviewItemList key={entry.id} entry={entry} language={language} onSelect={setSelectedEntry} onReview={handleReview} isBusy={busyId === entry.id} error={errors[entry.id]} />
          ))}
        </div>
      )}

      <ReviewDetailModal entry={selectedEntry} language={language} onClose={() => setSelectedEntry(null)} onReview={handleReview} isBusy={busyId === selectedEntry?.id} error={errors[selectedEntry?.id]} />
    </div>
  );
}
