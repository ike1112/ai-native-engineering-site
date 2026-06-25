/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { MouseEvent, useEffect, useState } from 'react';

import CommunityBlock from './components/CommunityBlock';
import { NOTES_DATA } from './generated/notebook-content';
import { RESUME_DATA } from './notebook';
import { AppRoute, browserPathForRoute, redirectAppPathFromSearch, routeForAppPath, routeForBrowserPath } from './routing';
import { SITE_CONFIG } from './siteConfig';

const isoDate = (value: string) => String(value).slice(0, 10);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (value: string) => {
  const [y, m, d] = isoDate(value).split('-');
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
};

export default function App() {
  const basePath = import.meta.env.BASE_URL;
  const readRouteFromLocation = () => {
    const redirectedAppPath = redirectAppPathFromSearch(window.location.search);

    if (redirectedAppPath) {
      const redirectedRoute = routeForAppPath(redirectedAppPath);
      window.history.replaceState(null, '', browserPathForRoute(redirectedRoute, basePath));
      return redirectedRoute;
    }

    return routeForBrowserPath(window.location.pathname, basePath);
  };

  const [activeTab, setActiveTab] = useState<AppRoute>(() => readRouteFromLocation());
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'instant' });

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'articles', label: 'Articles' },
    { id: 'about', label: 'About' },
  ] as const;

  useEffect(() => {
    const syncRouteFromLocation = () => {
      setActiveTab(readRouteFromLocation());
      scrollToTop();
    };

    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, []);

  const navigateTo = (route: AppRoute) => {
    const nextPath = browserPathForRoute(route, basePath);

    if (`${window.location.pathname}${window.location.search}` !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }

    setExpandedNoteId(null);
    setActiveTab(route);
    scrollToTop();
  };

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, route: AppRoute) => {
    event.preventDefault();
    navigateTo(route);
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col">

      {/* Header */}
      <header className="border-b border-line sticky top-0 bg-bg/90 backdrop-blur-md z-40">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 h-[72px] flex justify-between items-center">
          <a
            href={browserPathForRoute('home', basePath)}
            onClick={(event) => onNavClick(event, 'home')}
            className="font-serif font-semibold text-xl tracking-tight cursor-pointer focus:outline-none"
          >
            {RESUME_DATA.name}
          </a>
          <nav className="flex items-center gap-6">
            {navItems.map((tab) => (
              <a
                key={tab.id}
                href={browserPathForRoute(tab.id, basePath)}
                onClick={(event) => onNavClick(event, tab.id)}
                className={`text-[13px] font-medium cursor-pointer transition-colors ${
                  activeTab === tab.id ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[680px] mx-auto px-6 sm:px-10">

        {/* HOME */}
        {activeTab === 'home' && (
          <section className="py-20">
            <div className="text-faint text-[11px] uppercase tracking-[0.2em] mb-5">
              Public Engineering Notebook
            </div>
            <h1 className="font-serif font-semibold text-5xl sm:text-6xl leading-[1.05] tracking-tight text-ink">
              {RESUME_DATA.name}
            </h1>
            <div className="mt-6 max-w-[34em] space-y-4">
              <p className="font-serif italic text-2xl text-ink/90">
                Engineer. Systems thinker. Writing from real project work.
              </p>
              <p className="font-serif text-lg text-muted leading-relaxed">
                I write about how building with AI changes engineering work in practice.
              </p>
            </div>
            <p className="font-serif text-lg text-muted mt-5 leading-relaxed max-w-[34em]">
              This notebook documents real projects, verification work, reliability lessons,
              system understanding, and the engineering judgment behind what I build.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-faint">
              <span>{RESUME_DATA.location}</span>
              <span>—</span>
              <a href={`mailto:${RESUME_DATA.email}`} className="text-accent font-medium hover:underline">
                {RESUME_DATA.email}
              </a>
            </div>
          </section>
        )}

        {/* ARTICLES */}
        {activeTab === 'articles' && (
          <section className="py-16">
            {NOTES_DATA.length > 0 ? (
              NOTES_DATA.map((note, idx) => {
                const isExpanded = expandedNoteId === note.id;
                return (
                  <article key={note.id} className={idx > 0 ? 'border-t border-line pt-14 mt-14' : ''}>
                    <button
                      onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                      className="w-full text-left cursor-pointer focus:outline-none group"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                        {note.category}
                      </div>
                      <h1 className="font-serif font-semibold text-[32px] sm:text-[44px] leading-[1.12] tracking-tight text-ink mt-3 group-hover:text-accent transition-colors">
                        {note.title}
                      </h1>
                      <div className="text-[12px] uppercase tracking-wider text-faint mt-3">
                        {fmtDate(note.date)} · {note.readTime}
                      </div>
                      {!isExpanded && (
                        <p className="font-serif text-lg text-muted leading-relaxed mt-5">
                          {note.summary}
                        </p>
                      )}
                    </button>

                    {isExpanded && (
                      <>
                        <div
                          className="article-body mt-8 pt-8 border-t border-line"
                          dangerouslySetInnerHTML={{ __html: note.contentHtml ?? note.content }}
                        />
                        <div className="flex items-center gap-2 mt-10 pt-5 border-t border-line flex-wrap">
                          <span className="text-[10px] font-medium uppercase tracking-widest text-faint mr-1">Tags</span>
                          {note.tags.map((tag) => (
                            <span key={tag} className="text-[12px] text-muted bg-panel border border-line rounded px-2.5 py-0.5">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <CommunityBlock term={note.id} />
                      </>
                    )}
                  </article>
                );
              })
            ) : (
              <p className="text-muted">No articles published yet.</p>
            )}
          </section>
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <section className="py-16 max-w-[42em]">
            <div className="border-b border-line pb-6">
              <h2 className="font-serif font-semibold text-3xl tracking-tight text-ink">{RESUME_DATA.name}</h2>
              <p className="text-muted text-sm mt-2">{RESUME_DATA.title} — {RESUME_DATA.location}</p>
            </div>
            <p className="font-serif text-lg text-prose leading-relaxed mt-7">
              {RESUME_DATA.summary}
            </p>
            <a
              href={`mailto:${RESUME_DATA.email}`}
              className="inline-block mt-7 text-sm font-medium text-accent border border-line rounded-md px-4 py-2 hover:border-accent transition-colors"
            >
              Email {RESUME_DATA.name.split(' ')[0]} →
            </a>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-line mt-12 py-10">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 flex justify-between items-center text-sm text-faint">
          <span>{SITE_CONFIG.siteName}</span>
          <span className="text-muted">Truth &amp; Verification</span>
        </div>
      </footer>

    </div>
  );
}
