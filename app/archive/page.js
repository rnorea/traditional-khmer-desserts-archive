"use client";

import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar.js";
import ArchiveControls from "../../components/ArchiveControls.js";
import EntryCard from "../../components/EntryCard.js";
import ArchiveListItem from "../../components/ArchiveListItem.js";
import Footer from "../../components/Footer.js";
import { traditionalKhmerDesserts } from "../../data/entries.js";

export default function ArchivePage() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("name-asc");
  const [language, setLanguage] = useState("en");

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...traditionalKhmerDesserts];

    // 1. Filter by category
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

    // 2. Search by text
    const query = searchQuery.toLowerCase();
    if (query) {
      result = result.filter(entry => 
        entry.name.toLowerCase().includes(query) || 
        (entry.nativeName && entry.nativeName.includes(query)) ||
        (entry.englishName && entry.englishName.toLowerCase().includes(query)) ||
        entry.description.toLowerCase().includes(query) ||
        (entry.descriptionKm && entry.descriptionKm.includes(query)) ||
        entry.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
        (entry.ingredientsKm && entry.ingredientsKm.some(ing => ing.includes(query)))
      );
    }

    // 3. Sort
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

  return (
    <>
      <Navbar language={language} onLanguageChange={setLanguage} />
      
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
          language={language}
        />

        {viewMode === "grid" ? (
          <div className="archive-grid">
            {filteredAndSortedEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} language={language} />
            ))}
          </div>
        ) : (
          <div className="archive-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredAndSortedEntries.map(entry => (
              <ArchiveListItem key={entry.id} entry={entry} language={language} />
            ))}
          </div>
        )}
      </main>

      <Footer language={language} />
    </>
  );
}
