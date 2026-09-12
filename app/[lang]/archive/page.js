"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar.js";
import ArchiveControls from "../../../components/ArchiveControls.js";
import EntryCard from "../../../components/EntryCard.js";
import ArchiveListItem from "../../../components/ArchiveListItem.js";
import Footer from "../../../components/Footer.js";
import NotFoundCard from "../../../components/NotFoundCard.js";
import { traditionalKhmerDesserts } from "../../../data/entries.js";
import { t } from "../../../data/translations.js";

const cleanText = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()"\'?<>\[\]|\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function ArchivePage() {
  const params = useParams();
  const language = params?.lang || "en";

  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const text = t[language] || t.en;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, sortType, itemsPerPage]);

  const suggestions = useMemo(() => {
    let result = [...traditionalKhmerDesserts];
    const query = cleanText(searchQuery);
    if (!query) return result.slice(0, 4);

    const words = query.split(" ").filter(w => w.length > 0);
    if (words.length === 0) return result.slice(0, 4);

    const atLeastOne = result.filter(entry => {
       const entryText = [
         cleanText(entry.name),
         entry.nativeName ? cleanText(entry.nativeName) : "",
         entry.englishName ? cleanText(entry.englishName) : "",
         cleanText(entry.description),
         entry.descriptionKm ? cleanText(entry.descriptionKm) : "",
         ...entry.ingredients.map(cleanText),
         ...(entry.ingredientsKm ? entry.ingredientsKm.map(cleanText) : [])
       ].join(" ");
       return words.some(word => entryText.includes(word));
    });

    if (atLeastOne.length > 0) {
      if (atLeastOne.length < 4) {
        const remaining = result.filter(e => !atLeastOne.some(a => a.id === e.id));
        return [...atLeastOne, ...remaining.slice(0, 4 - atLeastOne.length)];
      }
      return atLeastOne;
    }
    return result.slice(0, 4);
  }, [searchQuery]);

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...traditionalKhmerDesserts];

    if (filterType !== "all") {
      result = result.filter(entry => {
        const cat = Array.isArray(entry.category) 
          ? entry.category.map(c => c.toLowerCase()).join(" ") 
          : (entry.category?.toLowerCase() || "");
        if (filterType === "stickyRice") return cat.includes("sticky rice");
        if (filterType === "sweetSoups") return cat.includes("soup");
        if (filterType === "steamedSweets") return cat.includes("steamed");
        if (filterType === "snacks") return cat.includes("snack");
        return true;
      });
    }

    const query = cleanText(searchQuery);

    if (query) {
      const exactResult = result.filter(entry => 
        cleanText(entry.name).includes(query) || 
        (entry.nativeName && cleanText(entry.nativeName).includes(query)) ||
        (entry.englishName && cleanText(entry.englishName).includes(query)) ||
        cleanText(entry.description).includes(query) ||
        (entry.descriptionKm && cleanText(entry.descriptionKm).includes(query)) ||
        entry.ingredients.some(ing => cleanText(ing).includes(query)) ||
        (entry.ingredientsKm && entry.ingredientsKm.some(ing => cleanText(ing).includes(query)))
      );

      if (exactResult.length > 0) {
        result = exactResult;
      } else {
        const words = query.split(" ").filter(w => w.length > 0);
        if (words.length > 1) {
          const partialResult = result.filter(entry => {
            const entryText = [
              cleanText(entry.name),
              entry.nativeName ? cleanText(entry.nativeName) : "",
              entry.englishName ? cleanText(entry.englishName) : "",
              cleanText(entry.description),
              entry.descriptionKm ? cleanText(entry.descriptionKm) : "",
              ...entry.ingredients.map(cleanText),
              ...(entry.ingredientsKm ? entry.ingredientsKm.map(cleanText) : [])
            ].join(" ");
            return words.every(word => entryText.includes(word));
          });
          
          if (partialResult.length > 0) {
            result = partialResult;
          } else {
            result = [];
          }
        } else {
          result = [];
        }
      }
    }

    result.sort((a, b) => {
      switch (sortType) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-new":
          return b.id - a.id;
        case "date-old":
          return a.id - b.id;
        case "region":
          return (a.location || "").localeCompare(b.location || "");
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, filterType, sortType]);

  const totalPages = Math.ceil(filteredAndSortedEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredAndSortedEntries.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Navbar language={language} />
      
      <main className="container" id="archive" style={{ paddingTop: '80px', minHeight: '80vh' }}>
        <h1 style={{ marginBottom: '24px', fontSize: '2rem', color: 'var(--primary-color)' }}>
          {language === 'en' ? 'The Archive' : 'បណ្ណសារ'}
        </h1>
        
        <ArchiveControls 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
          sortType={sortType}
          onSortChange={setSortType}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          language={language}
        />

        {paginatedEntries.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="archive-grid">
                {paginatedEntries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} language={language} />
                ))}
              </div>
            ) : (
              <div className="archive-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {paginatedEntries.map(entry => (
                  <ArchiveListItem key={entry.id} entry={entry} language={language} />
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="view-btn"
                  style={{ padding: '8px 16px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', width: 'auto' }}
                >
                  {text.previous}
                </button>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {text.page} {currentPage} {text.of} {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="view-btn"
                  style={{ padding: '8px 16px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', width: 'auto' }}
                >
                  {text.next}
                </button>
              </div>
            )}
          </>
        ) : (
          <NotFoundCard searchQuery={searchQuery} suggestions={suggestions} language={language} />
        )}
      </main>

      <Footer language={language} />
    </>
  );
}
