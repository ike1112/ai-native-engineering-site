/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

import { NOTES_DATA } from './generated/notebook-content';
import { RESUME_DATA } from './notebook';
import { SITE_CONFIG } from './siteConfig';

const isoDate = (value: string) => String(value).slice(0, 10);

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'articles' | 'about'>('home');
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'instant' });

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'articles', label: 'Articles' },
    { id: 'about', label: 'About' },
  ] as const;

  return (
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col">

      {/* Header */}
      <header className="border-b border-line sticky top-0 bg-bg/90 backdrop-blur-md z-40">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 h-[72px] flex justify-between items-center">
          <button
            onClick={() => { setActiveTab('home'); scrollToTop(); }}
            className="font-serif font-semibold text-xl tracking-tight cursor-pointer focus:outline-none"
          >
            Isabel Ke
          </button>
          <nav className="flex items-center gap-6">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); scrollToTop(); }}
                className={`text-[13px] font-medium cursor-pointer transition-colors ${
                  activeTab === tab.id ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
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
              Isabel Ke
            </h1>
            <p className="font-serif italic text-2xl text-ink/90 mt-6 max-w-[18em]">
              Engineer. Systems Thinker. AI-Native Builder.
            </p>
            <p className="font-serif text-lg text-muted mt-5 leading-relaxed max-w-[34em]">
              I study AI-native systems, production-harden real projects, and document what I learn
              about verification, reliability, and system understanding.
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
            <div className="mb-4">
              <h2 className="font-serif font-semibold text-3xl tracking-tight text-ink">
                Articles &amp; Walkthroughs
              </h2>
              <p className="text-muted mt-2 leading-relaxed">
                Notes on AI-native engineering, systems thinking, verification, and production hardening.
              </p>
            </div>

            {NOTES_DATA.length > 0 ? (
              <div>
                {NOTES_DATA.map((note) => {
                  const isExpanded = expandedNoteId === note.id;
                  return (
                    <article key={note.id} className="border-t border-line py-8">
                      <button
                        onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                        className="w-full text-left cursor-pointer focus:outline-none group"
                      >
                        <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-faint">
                          <span className="text-accent">{note.category}</span>
                          <span>{isoDate(note.date)}</span>
                          <span>{note.readTime}</span>
                        </div>
                        <h3 className="font-serif font-semibold text-2xl sm:text-[28px] leading-snug text-ink mt-2 group-hover:text-accent transition-colors">
                          {note.title}
                        </h3>
                        {!isExpanded && (
                          <p className="font-serif text-[17px] text-muted leading-relaxed mt-2">
                            {note.summary}
                          </p>
                        )}
                      </button>

                      {isExpanded && (
                        <>
                          <div
                            className="article-body mt-7"
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
                        </>
                      )}
                    </article>
                  );
                })}
              </div>
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
              Email Isabel →
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
