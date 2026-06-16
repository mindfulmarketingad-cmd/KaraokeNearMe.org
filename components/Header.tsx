"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { regions, statesByRegion } from "@/lib/states";
import Logo from "@/components/Logo";
import AuthMenu from "@/components/AuthMenu";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Close the mega menu when clicking outside of it (desktop) or pressing Esc.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function closeAll() {
    setMegaOpen(false);
    setMobileOpen(false);
  }

  return (
    <header className={`site-header ${mobileOpen ? "nav-open" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={closeAll}>
          <Logo size={28} className="brand-logo" />
          Karaoke Near Me
        </Link>

        <div className="header-right">
          <nav className="nav" aria-label="Primary">
          <div className="nav-item" ref={itemRef} data-open={megaOpen}>
            <button
              className="nav-link"
              aria-haspopup="true"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((v) => !v)}
            >
              States
              <span className="nav-caret" aria-hidden="true" />
            </button>

            {megaOpen && (
              <div className="mega" role="menu" aria-label="Browse states by region">
                {regions.map((region) => (
                  <div className="mega-col" key={region}>
                    <h4>{region}</h4>
                    <ul>
                      {statesByRegion(region).map((s) => (
                        <li key={s.slug}>
                          <Link href={`/states/${s.slug}/`} onClick={closeAll}>
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mega-foot">
                  <Link href="/states/" onClick={closeAll}>
                    Browse all states &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="nav-item">
            <Link href="/listings/" className="nav-link" onClick={closeAll}>
              Listings
            </Link>
          </div>

          <div className="nav-item">
            <Link href="/services/" className="nav-link" onClick={closeAll}>
              Services
            </Link>
          </div>

          <div className="nav-item">
            <Link href="/karaoke-finder/" className="nav-link" onClick={closeAll}>
              Karaoke Finder
            </Link>
          </div>
          </nav>

          <AuthMenu />

          <button
            className="menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
