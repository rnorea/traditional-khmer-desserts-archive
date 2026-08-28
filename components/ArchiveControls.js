import { t } from '../data/translations.js';

export default function ArchiveControls({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  sortType,
  onSortChange,
  viewMode,
  onViewModeChange,
  language
}) {
  const text = t[language] || t.en;

  return (
    <div className="controls-wrapper">
      <div className="controls-bar">
        
        <div className="controls-left">
          <div className="search-box">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input 
              type="text" 
              className="search-input" 
              placeholder={text.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="filter-select-group">
            <div className="select-custom">
              <select id="typeFilter" value={filterType} onChange={(e) => onFilterChange(e.target.value)}>
                <option value="all">{text.allCategories}</option>
                <option value="appetizers">{text.appetizers}</option>
                <option value="mains">{text.mains}</option>
                <option value="desserts">{text.desserts}</option>
                <option value="drinks">{text.drinks}</option>
              </select>
            </div>

            <div className="select-custom">
              <select id="sortFilter" value={sortType} onChange={(e) => onSortChange(e.target.value)}>
                <option value="name-asc">{text.sortNameAsc}</option>
                <option value="name-desc">{text.sortNameDesc}</option>
                <option value="date-new">{text.dateNewest}</option>
                <option value="date-old">{text.dateOldest}</option>
                <option value="region">{text.originRegion}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="controls-right">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
            onClick={() => onViewModeChange('grid')}
            title={text.gridView}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
            onClick={() => onViewModeChange('list')}
            title={text.listView}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
        </div>

      </div>
    </div>
  );
}
