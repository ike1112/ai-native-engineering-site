/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Mail, ChevronDown } from 'lucide-react';

import { NOTES_DATA } from './generated/notebook-content';
import { RESUME_DATA } from './notebook';
import CommunityBlock from './components/CommunityBlock';
import { SITE_CONFIG } from './siteConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'articles' | 'about'>('home');
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] text-zinc-900 select-text flex flex-col font-sans antialiased">

      {/* Editorial Header */}
      <header className="border-b border-zinc-200/60 sticky top-0 bg-[#FCFBFA]/90 backdrop-blur-md z-45">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">

          {/* Identity Sign-off */}
          <button
            onClick={() => { setActiveTab('home'); scrollToTop(); }}
            className="flex flex-col text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-xl font-bold tracking-tight text-zinc-900 group-hover:text-zinc-650 transition-colors">
              Isabel Ke
            </span>
          </button>

          {/* Minimal Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'articles', label: 'Articles' },
              { id: 'about', label: 'About' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  scrollToTop();
                }}
                className={`px-3 py-1.5 text-xs font-mono transition-all rounded-md cursor-pointer uppercase tracking-wider ${
                  activeTab === tab.id
                    ? 'text-zinc-900 font-semibold bg-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 sm:px-8 py-10">

        {/* ====================================================================
            TAB: HOME
            ==================================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fadeIn">
            <section className="py-6 space-y-6 max-w-3xl">
              <h1 className="font-serif text-5xl sm:text-7xl font-extrabold text-zinc-950 tracking-tight leading-none">
                Isabel Ke
              </h1>

              <div className="text-zinc-800 font-serif text-xl sm:text-3xl font-light leading-snug space-y-3">
                <p className="italic">Engineer. Systems Thinker. AI-Native Builder.</p>
                <p className="max-w-3xl">
                  Exploring how software engineering changes when implementation is delegated to AI.
                </p>
              </div>

              <div className="h-px bg-zinc-200/80 w-24 my-6" />

              <p className="font-serif text-base text-zinc-700 leading-relaxed max-w-2xl font-light">
                {RESUME_DATA.summary}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {RESUME_DATA.location}
                </span>
                <span>•</span>
                <a href={`mailto:${RESUME_DATA.email}`} className="text-zinc-900 hover:underline transition-all font-semibold">
                  {RESUME_DATA.email}
                </a>
              </div>
            </section>
          </div>
        )}

        {/* ====================================================================
            TAB: ARTICLES
            ==================================================================== */}
        {activeTab === 'articles' && (
          <div className="space-y-10 animate-fadeIn">

            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                Writing
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-950">
                Articles &amp; Walkthroughs
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed font-sans">
                Notes on AI-native engineering, systems thinking, verification, and production hardening.
              </p>
            </div>

            {NOTES_DATA.length > 0 ? (
              <div className="space-y-6 max-w-3xl">
                {NOTES_DATA.map((note) => {
                  const isExpanded = expandedNoteId === note.id;
                  return (
                    <article
                      key={note.id}
                      className="border border-zinc-200 bg-white rounded-xl shadow-xs hover:border-zinc-300 transition-all overflow-hidden"
                    >
                      {/* Header trigger */}
                      <button
                        onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                        className="w-full text-left p-6 sm:p-8 flex justify-between items-start gap-4 cursor-pointer focus:outline-none"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                            <span className="uppercase font-semibold tracking-wider text-zinc-500">{note.category}</span>
                            <span>•</span>
                            <span>{note.date}</span>
                            <span>•</span>
                            <span>{note.readTime}</span>
                          </div>
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 hover:text-zinc-650 transition-colors">
                            {note.title}
                          </h3>
                          {!isExpanded && (
                            <p className="text-sm text-zinc-650 leading-relaxed font-light font-sans max-w-2xl">
                              {note.summary}
                            </p>
                          )}
                        </div>
                        <div className="text-zinc-400 hover:text-zinc-950 transition-all hover:bg-zinc-100 p-1.5 rounded-full shrink-0">
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {/* Content view */}
                      {isExpanded && (
                        <div className="px-6 pb-8 sm:px-8 sm:pb-10 border-t border-zinc-100 pt-6 space-y-6 bg-zinc-50/15">
                          <div
                            className="font-serif text-zinc-800 text-sm sm:text-base leading-relaxed space-y-4 font-light pr-4 max-w-2xl prose prose-zinc max-w-none"
                            dangerouslySetInnerHTML={{ __html: note.contentHtml ?? note.content }}
                          />

                          <div className="flex items-center gap-2 pt-4 border-t border-zinc-150 flex-wrap">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mr-1">Tags:</span>
                            {note.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-mono bg-zinc-100 text-zinc-650 px-2.5 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <CommunityBlock
                            title={note.title}
                            term={`note:${note.id}`}
                            prompt="What resonated here? What would you challenge, extend, or want to discuss further?"
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 font-sans">No articles published yet.</p>
            )}

          </div>
        )}

        {/* ====================================================================
            TAB: ABOUT
            ==================================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fadeIn font-sans max-w-3xl">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-250 pb-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                  About
                </span>
                <h2 className="font-serif text-3xl font-extrabold tracking-tight text-zinc-950">
                  {RESUME_DATA.name}
                </h2>
                <p className="text-zinc-500 font-mono text-xs">
                  {RESUME_DATA.title} — {RESUME_DATA.location}
                </p>
              </div>
              <a
                href={`mailto:${RESUME_DATA.email}`}
                className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-mono font-semibold px-4 py-2.5 rounded-md transition-all cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" /> Email Isabel
              </a>
            </div>

            <p className="text-sm sm:text-base font-serif text-zinc-750 leading-relaxed font-light">
              {RESUME_DATA.summary}
            </p>

          </div>
        )}

      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-zinc-200 py-12 px-6 sm:px-8 mt-20 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-left space-y-1">
            <span className="font-serif text-sm font-bold text-zinc-950 block">{SITE_CONFIG.siteName}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-450">
            <span>{RESUME_DATA.email}</span>
            <span>•</span>
            <span className="font-semibold text-zinc-900">Truth &amp; Verification</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
