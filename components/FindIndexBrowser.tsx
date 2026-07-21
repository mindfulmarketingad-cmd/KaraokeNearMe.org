"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface FindIndexItem {
  href: string;
  title: string;
  category: string;
  location: string;
  count: number;
}

type SortOption = "location" | "category" | "count";

export default function FindIndexBrowser({
  items,
  categories,
}: {
  items: FindIndexItem[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<SortOption>("location");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items;
    if (category) list = list.filter((i) => i.category === category);
    if (q) {
      list = list.filter((i) =>
        `${i.title} ${i.location} ${i.category}`.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "location") {
      sorted.sort(
        (a, b) => a.location.localeCompare(b.location) || a.category.localeCompare(b.category)
      );
    } else if (sort === "category") {
      sorted.sort(
        (a, b) => a.category.localeCompare(b.category) || a.location.localeCompare(b.location)
      );
    } else if (sort === "count") {
      sorted.sort((a, b) => b.count - a.count || a.location.localeCompare(b.location));
    }
    return sorted;
  }, [items, query, category, sort]);

  return (
    <div className="find-index">
      <div className="find-index-controls">
        <input
          type="search"
          placeholder="Search city, state, or karaoke type"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="find-index-search"
          aria-label="Search find pages"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="find-index-select"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="find-index-select"
          aria-label="Sort"
        >
          <option value="location">Sort: City / State A–Z</option>
          <option value="category">Sort: Category</option>
          <option value="count">Sort: Most Locations</option>
        </select>
      </div>

      <p className="muted find-index-count">
        Showing {results.length.toLocaleString()} of {items.length.toLocaleString()} pages.
      </p>

      <ul className="plain-link-list find-index-list">
        {results.map((i) => (
          <li key={i.href}>
            <Link href={i.href}>{i.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
