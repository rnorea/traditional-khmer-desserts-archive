"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar.js";
import ArchiveControls from "../../../components/ArchiveControls.js";
import ArchiveCard from "../../../components/ArchiveCard.js";
import ArchiveListItem from "../../../components/ArchiveListItem.js";
import Footer from "../../../components/Footer.js";
import { traditionalKhmerDesserts } from "../../../data/entries.js";

export default function ArchivePage() {
  const params = useParams();
  const language = params?.lang || "en";

  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("name-asc");

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...traditionalKhmerDesserts];

    if (filterType !== "all") {
      result = result.filter(entry => {
        const cat = entry.category?.toLowerCase() || "";
        if (filterType === "appetizers") return cat.includes("appetizer") || cat.includes("snack");
        if (filterType === "mains") return cat.includes("main");
        if (filterType === "desserts") return cat.includes("dessert");
        if (filterType === "drinks") return cat.includes("drink") || cat.includes("beverage");
        return true;
      });
    }

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
          language={language}
        />

        {viewMode === "grid" ? (
          <div className="archive-grid">
            {filteredAndSortedEntries.map(entry => (
              <ArchiveCard key={entry.id} entry={entry} language={language} />
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
