"use client";

import { useState } from "react";
import EntryCard from './EntryCard.js';

export default function NotFoundCard({ searchQuery, suggestions, language }) {
  const [showAll, setShowAll] = useState(false);
  const displayedSuggestions = showAll ? suggestions : suggestions.slice(0, 8);

  return (
    <div className="not-found-container" style={{
      textAlign: 'center',
      padding: '40px 20px',
      background: 'var(--bg-cream)',
      borderRadius: '12px',
      border: '1px solid var(--border-subtle)',
      marginTop: '20px'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <svg 
          width="48" height="48" viewBox="0 0 24 24" 
          fill="none" stroke="var(--gold-accent)" strokeWidth="1.5" 
          strokeLinecap="round" strokeLinejoin="round" 
          style={{ marginBottom: '16px' }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="9" y1="9" x2="13" y2="13"></line>
          <line x1="13" y1="9" x2="9" y2="13"></line>
        </svg>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {language === 'kh' ? 'រកមិនឃើញបង្អែមទេ' : 'No dessert found'}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {language === 'kh' 
            ? `យើងរកមិនឃើញបង្អែមដែលត្រូវនឹង "${searchQuery}" ទេ។ អ្នកអាចសាកល្បងបង្អែមទាំងនេះ៖` 
            : `We couldn't find any dessert matching "${searchQuery}". You may like these instead:`}
        </p>
      </div>

      <div className="archive-grid" style={{ textAlign: 'left' }}>
        {displayedSuggestions.map(entry => (
          <EntryCard key={entry.id} entry={entry} language={language} />
        ))}
      </div>

      {suggestions.length > 8 && !showAll && (
        <button 
          onClick={() => setShowAll(true)}
          style={{
            marginTop: '32px',
            padding: '10px 24px',
            background: 'none',
            border: '1px solid var(--gold-accent)',
            borderRadius: '30px',
            color: 'var(--gold-accent)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.target.style.background = 'var(--gold-accent)'; e.target.style.color = '#fff'; }}
          onMouseOut={(e) => { e.target.style.background = 'none'; e.target.style.color = 'var(--gold-accent)'; }}
        >
          {language === 'kh' ? 'មើលអនុសាសន៍ទាំងអស់' : 'See all recommendations'}
        </button>
      )}
    </div>
  );
}
