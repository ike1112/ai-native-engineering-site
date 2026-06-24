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
    { id: 'home', label: 'home' },
    { id: 'articles', label: 'articles' },
    { id: 'about', label: 'about' },
  ] as const;

  return (
    <div className="min-h-screen bg-bg text-ink font-mono flex flex-col selection:bg-accent">

      {/* Header */}
      <header className="border-b border-line sticky top-0 bg-bg/90 backdrop-blur-md z-40">
        <div className="max-w-[780px] mx-auto px-7 h-[68px] flex justify-between items-center">
          <button
            onClick={() => { setActiveTab('home'); scrollToTop(); }}
            className="font-mono font-bold text-sm tracking-tight cursor-pointer focus:outline-none"
          >
            isabel<span className="text-accent">.ke</span>
          </button>
          <nav className="flex items-center gap-5">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); scrollToTop(); }}
                className={`text-xs cursor-pointer transition-colors ${
                  activeTab === tab.id ? 'text-accent' : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[780px] mx-auto px-7 py-4">

        {/* HOME */}
        {activeTab === 'home' && (
          <section className="py-16">
            <div className="text-faint text-[11px] uppercase tracking-[0.22em] mb-5">
              Public Engineering Notebook
            </div>
            <h1 className="font-mono font-bold text-4xl sm:text-[40px] leading-tight tracking-tight">
              Isabel Ke
            </h1>
            <p className="text-accent2 text-[15px] font-medium mt-5">
              Engineer. Systems Thinker. AI-Native Builder.
            </p>
            <p className="font-serif text-lg text-muted mt-5 max-w-[36em] leading-relaxed">
              Exploring how software engineering changes when implementation is delegated to AI.
              {' '}{RESUME_DATA.summary}
            </p>

            <div className="mt-8 text-[13px] text-faint grid grid-cols-[max-content_1fr] gap-y-1 gap-x-5">
              <span className="text-muted">location</span><span>{RESUME_DATA.location}</span>
              <span className="text-muted">contact</span>
              <a href={`mailto:${RESUME_DATA.email}`} className="text-accent hover:underline">{RESUME_DATA.email}</a>
              <span className="text-muted">focus</span><span>verification · hardening · system understanding</span>
            </div>
          </section>
        )}

        {/* ARTICLES */}
        {activeTab === 'articles' && (
          <section className="py-12 space-y-8">
            <div>
              <h2 className="font-mono font-bold text-2xl tracking-tight">Articles &amp; Walkthroughs</h2>
              <p className="font-serif text-muted mt-2 max-w-[40em] leading-relaxed">
                Notes on AI-native engineering, systems thinking, verification, and production hardening.
              </p>
            </div>

            {NOTES_DATA.length > 0 ? (
              <div className="space-y-4">
                {NOTES_DATA.map((note) => {
                  const isExpanded = expandedNoteId === note.id;
                  return (
                    <article key={note.id} className="border border-line bg-panel rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                        className="w-full text-left p-6 flex justify-between items-start gap-4 cursor-pointer focus:outline-none"
                      >
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-wider text-faint">
                            <span className="text-accent">{note.category}</span>
                            <span>{isoDate(note.date)}</span>
                            <span>{note.readTime}</span>
                          </div>
                          <h3 className="font-serif font-medium text-xl sm:text-[26px] leading-snug text-ink">
                            {note.title}
                          </h3>
                          {!isExpanded && (
                            <p className="font-serif text-muted leading-relaxed max-w-[40em]">
                              {note.summary}
                            </p>
                          )}
                        </div>
                        <span className="text-accent text-sm shrink-0 mt-1">{isExpanded ? '[ - ]' : '[ + ]'}</span>
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-8 border-t border-line pt-6">
                          <div
                            className="article-body max-w-[42em]"
                            dangerouslySetInnerHTML={{ __html: note.contentHtml ?? note.content }}
                          />
                          <div className="flex items-center gap-2 pt-6 mt-6 border-t border-line flex-wrap">
                            <span className="text-[10px] uppercase tracking-widest text-faint mr-1">tags:</span>
                            {note.tags.map((tag) => (
                              <span key={tag} className="text-[11px] text-muted border border-line rounded px-2 py-0.5">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted">No articles published yet.</p>
            )}
          </section>
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <section className="py-12 space-y-7 max-w-[42em]">
            <div className="border-b border-line pb-6">
              <h2 className="font-mono font-bold text-2xl tracking-tight">{RESUME_DATA.name}</h2>
              <p className="text-faint text-[13px] mt-2">{RESUME_DATA.title} — {RESUME_DATA.location}</p>
            </div>

            <p className="font-serif text-lg text-muted leading-relaxed">
              {RESUME_DATA.summary}
            </p>

            <a
              href={`mailto:${RESUME_DATA.email}`}
              className="inline-block text-[13px] text-accent border border-line rounded px-4 py-2 hover:border-accent transition-colors"
            >
              email isabel →
            </a>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-line mt-16 py-9">
        <div className="max-w-[780px] mx-auto px-7 flex justify-between items-center text-xs text-faint">
          <span>{SITE_CONFIG.siteName}</span>
          <span className="text-muted">truth &amp; verification</span>
        </div>
      </footer>

    </div>
  );
}
