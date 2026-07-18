"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import AuthMenu from "@/components/AuthMenu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/partners/", label: "Partners" },
  { href: "/find/", label: "Find" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeAll() {
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
            {NAV_LINKS.map((item) => (
              <div className="nav-item" key={item.href}>
                <Link href={item.href} className="nav-link" onClick={closeAll}>
                  {item.label}
                </Link>
              </div>
            ))}
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
