/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Briefcase,
  Mail,
  MapPin,
  Code,
  Terminal,
  ShieldCheck,
  LayoutGrid,
  Database,
  Target,
  ChevronRight,
  ChevronDown,
  Info,
  Check,
  Search,
  ExternalLink,
  ArrowRight,
  Sparkles,
  BookMarked
} from 'lucide-react';

import { PROJECTS_DATA, NOTES_DATA, READING_NOTES_DATA } from './generated/notebook-content';
import { RESUME_DATA, Project } from './notebook';

import FlexboxPlayground from './components/FlexboxPlayground';
import SqlInterpreter from './components/SqlInterpreter';
import RegexValidator from './components/RegexValidator';
import VerificationSandbox from './components/VerificationSandbox';
import CommunityBlock from './components/CommunityBlock';
import { SITE_CONFIG } from './siteConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'learning' | 'builds' | 'about'>('home');
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS_DATA[0]);
  const [activeSandbox, setActiveSandbox] = useState<'verification' | 'sql' | 'regex' | 'flexbox'>('verification');
  const [selectedStrategyItem, setSelectedStrategyItem] = useState(0);
  
  // Track expanded state for articles
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  // Filter state for Learning notes
  const [learningFilter, setLearningFilter] = useState<'all' | 'notes' | 'reading'>('all');

  // Smooth scroll helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Navigational jumps from the beautiful index home tab
  const handleWritingClick = (noteId: string) => {
    setExpandedNoteId(noteId);
    setLearningFilter('notes');
    setActiveTab('learning');
    scrollToTop();
  };

  const handleReadingClick = (noteId?: string) => {
    setLearningFilter('reading');
    setActiveTab('learning');
    scrollToTop();
    if (noteId) {
      setTimeout(() => {
        const el = document.getElementById(`reading-${noteId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleProjectClick = (projectId: string) => {
    const proj = PROJECTS_DATA.find(p => p.id === projectId);
    if (proj) {
      setSelectedProject(proj);
    }
    setActiveTab('builds');
    scrollToTop();
  };

  const handleLaunchSandbox = (sandboxId: 'verification' | 'sql' | 'regex' | 'flexbox') => {
    setActiveSandbox(sandboxId);
    setActiveTab('builds');
    setTimeout(() => {
      const el = document.getElementById('sandbox-container');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const featuredLearningItems = [
    ...NOTES_DATA.slice(0, 2).map((note) => ({
      title: note.title,
      desc: note.summary,
      date: note.category,
      onClick: () => handleWritingClick(note.id),
    })),
    ...READING_NOTES_DATA.slice(0, 2).map((note) => ({
      title: note.title,
      desc: note.reflection,
      date: note.sourceType,
      onClick: () => handleReadingClick(note.id),
    })),
  ];

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
              { id: 'learning', label: 'Articles' },
              { id: 'builds', label: 'Builds' },
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
            TAB: HOME (THE INTENTIONAL INDEX PORTAL)
            ==================================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fadeIn">
            
            {/* Header / Thesis Block */}
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
                I study AI-native systems, production-harden real projects, and document what I learn about verification, reliability, and system understanding.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> San Francisco, CA
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
            TAB: BUILDS (DETAILED WALKTHROUGHS & INLINE SANDBOXES)
            ==================================================================== */}
        {activeTab === 'builds' && (
          <div className="space-y-10 animate-fadeIn" id="sandbox-container">
            
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                01 / PRODUCTION HARDENING & VERIFICATION LABS
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-900">
                Actionable Case Studies & Compilers
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed font-sans">
                Real engineering decisions deconstructed: structural gaps found, concrete alternatives weighed, and actual production-hardening defenses verified live in browser.
              </p>
            </div>

            {/* System selector and detailed panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start5">
              
              {/* Project Vertical Index */}
              <div className="lg:col-span-4 flex flex-col gap-2 border-l border-zinc-200 pl-4 py-1">
                {PROJECTS_DATA.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProject(p);
                      // Auto-set the most relevant active sandbox for the selected project
                      if (p.id === 'aws-bedrock-hardening') {
                        setActiveSandbox('verification');
                      } else if (p.id === 'trip-price-tracker') {
                        setActiveSandbox('regex');
                      } else if (p.id === 'css-flexbox-playground') {
                        setActiveSandbox('flexbox');
                      }
                    }}
                    className={`text-left py-2.5 px-3 rounded-lg transition-all block cursor-pointer text-sm font-sans ${
                      selectedProject.id === p.id
                        ? 'bg-zinc-950 text-white font-medium shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/55'
                    }`}
                  >
                    <span className="font-mono text-[9px] block uppercase tracking-wider mb-0.5 text-zinc-400">
                      {p.category}
                    </span>
                    <span className="font-serif font-bold text-sm leading-tight block">
                      {p.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Walkthrough Board */}
              <div className="lg:col-span-8 space-y-8">
                {selectedProject && (
                  <div className="space-y-8 border border-zinc-200/80 p-6 sm:p-8 bg-white rounded-xl shadow-xs">
                    
                    {/* Header */}
                    <div className="space-y-3 border-b border-zinc-100 pb-5">
                      <span className="font-mono text-[9px] font-bold text-zinc-400 uppercase bg-zinc-100 px-2 py-0.5 rounded">
                        {selectedProject.difficulty}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                        {selectedProject.title}
                      </h3>
                      <p className="text-xs text-zinc-500 italic font-serif">
                        {selectedProject.subtitle}
                      </p>
                    </div>

                    {/* Problem Definition */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Problem Context</h4>
                      <div className="font-serif text-zinc-800 leading-relaxed text-sm whitespace-pre-line pl-4 border-l-2 border-zinc-300">
                        {selectedProject.problem}
                      </div>
                    </div>

                    {/* Original Architecture Design */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Prior Design Pattern</h4>
                      <div className="text-zinc-650 leading-relaxed text-xs sm:text-sm pl-4 border-l-2 border-zinc-300 font-serif font-light">
                        {selectedProject.originalDesign}
                      </div>
                    </div>

                    {/* Risks & Gaps found */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Structural Gaps Identified</h4>
                      <div className="text-zinc-700 text-xs sm:text-sm bg-zinc-50/50 p-4 rounded-lg border border-zinc-150 whitespace-pre-line leading-relaxed font-sans font-light">
                        {selectedProject.gaps}
                      </div>
                    </div>

                    {/* CORE DESIGN DECISION */}
                    <div className="space-y-3 bg-[#FAF9F6] border border-zinc-200 p-4 sm:p-5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-950" />
                        <h4 className="font-mono text-xs font-bold text-zinc-950 uppercase tracking-wider">
                          The Structural Design Choice
                        </h4>
                      </div>
                      
                      <p className="font-serif text-zinc-800 text-sm leading-relaxed font-medium">
                        {selectedProject.decision}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-200/80 text-[11px] font-mono mt-2">
                        <div>
                          <span className="text-zinc-400 uppercase block font-bold mb-0.5">Alternative Considered</span>
                          <span className="text-zinc-700 leading-normal block">{selectedProject.alternativeConsidered}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 uppercase block font-bold mb-0.5">Why Objectively Rejected</span>
                          <span className="text-zinc-700 leading-normal block">{selectedProject.whyRejected}</span>
                        </div>
                      </div>
                    </div>

                    {/* Improvements & Hardening applied */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Hardening Applied</h4>
                      <div className="text-zinc-700 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-sans font-light">
                        {selectedProject.improvements}
                      </div>
                    </div>

                    {/* Lessons Learned */}
                    <div className="space-y-2 pt-4 border-t border-zinc-100 pb-4">
                      <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Lessons and Fallbacks</h4>
                      <div className="text-zinc-850 font-serif text-sm leading-relaxed whitespace-pre-line">
                        {selectedProject.lessons}
                      </div>
                    </div>

                    {/* EMBEDDED RELEVANT SANDBOX INLINE */}
                    {selectedProject.id === 'aws-bedrock-hardening' && (
                      <div className="pt-6 border-t border-zinc-200 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[9px] font-bold text-[#10b981] uppercase block">▲ VERIFICATION LAB LIVE</span>
                            <h4 className="font-serif text-base font-bold text-zinc-950">Dynamic Hardening Unit Sandbox</h4>
                          </div>
                          {/* Selector */}
                          <div className="flex gap-1.5 bg-zinc-100 p-1 rounded-md">
                            <button
                              onClick={() => setActiveSandbox('verification')}
                              className={`px-2.5 py-1 text-[10px] font-mono font-medium rounded transition-all cursor-pointer ${
                                activeSandbox === 'verification' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                              }`}
                            >
                              Chaos Validation
                            </button>
                            <button
                              onClick={() => setActiveSandbox('sql')}
                              className={`px-2.5 py-1 text-[10px] font-mono font-medium rounded transition-all cursor-pointer ${
                                activeSandbox === 'sql' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                              }`}
                            >
                              Client SQL Parser
                            </button>
                          </div>
                        </div>
                        <div className="border border-zinc-200 bg-zinc-50/20 rounded-xl p-2 shadow-xs select-text">
                          {activeSandbox === 'sql' ? <SqlInterpreter /> : <VerificationSandbox />}
                        </div>
                      </div>
                    )}

                    {selectedProject.id === 'trip-price-tracker' && (
                      <div className="pt-6 border-t border-zinc-200 space-y-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[9px] font-bold text-[#10b981] uppercase block">▲ VERIFICATION LAB LIVE</span>
                          <h4 className="font-serif text-base font-bold text-zinc-950">Regex Evaluator sandbox</h4>
                        </div>
                        <div className="border border-zinc-200 bg-zinc-50/20 rounded-xl p-2 shadow-xs select-text">
                          <RegexValidator />
                        </div>
                      </div>
                    )}

                    {selectedProject.id === 'css-flexbox-playground' && (
                      <div className="pt-6 border-t border-zinc-200 space-y-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[9px] font-bold text-[#10b981] uppercase block">▲ VERIFICATION LAB LIVE</span>
                          <h4 className="font-serif text-base font-bold text-zinc-950">Flexbox Layout Modeler Playground</h4>
                        </div>
                        <div className="border border-zinc-200 bg-zinc-50/20 rounded-xl p-2 shadow-xs select-text">
                          <FlexboxPlayground />
                        </div>
                      </div>
                    )}

                    <CommunityBlock
                      title={selectedProject.title}
                      term={`project:${selectedProject.id}`}
                      prompt="Have a question about the tradeoffs, failure modes, or hardening choices in this case study? Start the thread here."
                    />

                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ====================================================================
            TAB: LEARNING NOTES (CONSOLIDATED EDITORIAL ESSAYS & STUDY LOGS)
            ==================================================================== */}
        {activeTab === 'learning' && (
          <div className="space-y-10 animate-fadeIn">
            
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                02 / THE LEARNERS LEDGER // SYNTHESIS & APPLIED TRACES
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-950">
                Study Logs & Engineering Reflections
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed font-sans">
                Active study deconstructions paired with architectural reflections. Filter by entries below to toggle between deep system autopsies and literature synthesis records.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex gap-2 border-b border-zinc-250 pb-3 flex-wrap">
              {[
                { id: 'all', label: 'All Learning Logs' },
                { id: 'notes', label: 'Essays & Walkthroughs' },
                { id: 'reading', label: 'Study Logs & Papers' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setLearningFilter(f.id as any);
                    scrollToTop();
                  }}
                  className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-md transition-all cursor-pointer ${
                    learningFilter === f.id
                      ? 'bg-zinc-950 text-white font-bold shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Content stream */}
            <div className="space-y-12">
              
              {/* Essays/Notes list */}
              {(learningFilter === 'all' || learningFilter === 'notes') && (
                <div className="space-y-6">
                  {learningFilter === 'all' && (
                    <h3 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-100 pb-2">
                      SYSTEMS NOTES & WALKTHROUGHS
                    </h3>
                  )}
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
                </div>
              )}

              {/* Reading notes part */}
              {(learningFilter === 'all' || learningFilter === 'reading') && (
                <div className="space-y-6">
                  {learningFilter === 'all' && (
                    <h3 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-100 pb-2 pt-6">
                      LITERATURE STUDIES & SOURCE TRACES
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {READING_NOTES_DATA.map((rn) => (
                      <div
                        key={rn.id}
                        id={`reading-${rn.id}`}
                        className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-7 space-y-5 shadow-xs hover:border-zinc-350 transition-all flex flex-col justify-between scroll-mt-20"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[9px] font-mono border-b border-zinc-100 pb-2">
                            <span className="text-zinc-900 font-bold uppercase tracking-wide">{rn.author}</span>
                            <span className="bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded font-mono text-[8px] font-bold">
                              {rn.sourceType}
                            </span>
                          </div>

                          <h3 className="font-serif text-lg font-bold text-zinc-950 tracking-tight leading-snug">
                            {rn.title}
                          </h3>

                          {/* Key insights */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block font-mono">Key Insights</span>
                            <ul className="space-y-1.5 text-xs text-zinc-600 font-serif">
                              {rn.keyInsights.map((insight, idx) => (
                                <li key={idx} className="leading-relaxed pl-2 border-l-2 border-zinc-200 font-light">
                                  "{insight}"
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Empirical evidence noted */}
                          <div className="space-y-1 bg-zinc-50/70 p-3 rounded-lg border border-zinc-150">
                            <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block font-mono">Source Evidence</span>
                            <p className="text-[11px] sm:text-xs text-zinc-650 font-serif leading-relaxed font-light">{rn.evidence}</p>
                          </div>

                          {/* Reflection */}
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-zinc-505 tracking-wider block font-mono">My Interpretation</span>
                            <p className="text-xs text-zinc-700 font-serif leading-relaxed font-light">{rn.reflection}</p>
                          </div>
                        </div>

                        {/* HIGH-CONVICTION IMPLEMENTATION ACTION */}
                        <div className="pt-3 border-t border-zinc-100 space-y-2 bg-[#FAF9F6] p-3 rounded-lg border border-zinc-200/60">
                          <span className="text-[9px] uppercase font-bold text-zinc-900 tracking-wider block font-mono flex items-center gap-1.5">
                            <BookMarked className="w-3 h-3" /> WHAT I BUILT AFTERWARD
                          </span>
                          <div className="flex flex-col gap-1">
                            {rn.actionableTakeaways.map((take, idx) => (
                              <span key={idx} className="text-xs font-sans text-zinc-800 font-normal leading-normal">
                                • {take}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

             </div>
        )}


        {/* ====================================================================
            TAB: STRATEGY BLUEPRINT (THE ADAPTIVE WORKSPACE SYSTEM SPEC)
            ==================================================================== */}
        {activeTab === 'strategy' && (
          <div className="space-y-10 animate-fadeIn">
            
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                05 / PORTFOLIO ARCHITECTURE SPECIFICATIONS
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-950">
                Strategy Blueprint & Design System
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed font-sans">
                A recursive, meta-analytical deconstruction of this very web application. Created to demonstrate the exact strategic review framework, content pillars, blueprints, and templates designed in a modern technical notebook style.
              </p>
            </div>

            {/* Strategic Inspector Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Strategic Index Column */}
              <div className="lg:col-span-4 flex flex-col gap-1.5 border-l border-zinc-200 pl-4 py-1">
                {[
                  { label: "Information Architecture", icon: "01" },
                  { label: "Homepage Wireframe", icon: "02" },
                  { label: "Navigation Structure", icon: "03" },
                  { label: "Content Hierarchy", icon: "04" },
                  { label: "Homepage Copy", icon: "05" },
                  { label: "Newsletter Positioning", icon: "06" },
                  { label: "Project Case Template", icon: "07" },
                  { label: "Engineering Note Template", icon: "08" },
                  { label: "Reading Note Template", icon: "09" },
                  { label: "Design Recommendations", icon: "10" },
                  { label: "SEO Strategy", icon: "11" },
                  { label: "Long-Term Content Strategy", icon: "12" }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedStrategyItem(index);
                      scrollToTop();
                    }}
                    className={`text-left py-2 px-3 rounded-md transition-all flex items-center justify-between cursor-pointer text-xs font-mono border ${
                      selectedStrategyItem === index
                        ? 'bg-zinc-950 text-white border-zinc-950 font-bold shadow-xs'
                        : 'text-zinc-500 bg-transparent border-transparent hover:text-zinc-900 hover:bg-zinc-100/55'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${selectedStrategyItem === index ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-400'}`}>
                      S-{item.icon}
                    </span>
                  </button>
                ))}
              </div>

              {/* Strategic Details Panel */}
              <div className="lg:col-span-8 bg-white border border-zinc-200 p-6 sm:p-8 rounded-xl shadow-xs space-y-6">
                
                {/* 1. Information Architecture */}
                {selectedStrategyItem === 0 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-01</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Information Architecture</h3>
                    </div>
                    
                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      A clear, high-contrast, linear directory path that prioritizes ease-of-verification and human readability over complex sub-directories. It organizes content around three core experiential pillars.
                    </p>

                    <div className="bg-zinc-950 text-white font-mono text-[10px] p-4 rounded-lg overflow-x-auto space-y-2 select-text leading-relaxed">
                      <div>// MAIN DIRECTORY PATH AND BOUNDARY STRUCTURE</div>
                      <div>/ (ROOT)</div>
                      <div className="pl-4">├── [activeTab: home] ───────&gt; Index Overview / Core Identity / Public Subscription</div>
                      <div className="pl-4">├── [activeTab: learning] ───&gt; What I'm studying: Learning Notes paired with reading traces</div>
                      <div className="pl-4">├── [activeTab: builds] ─────&gt; What I'm building: Case Studies with live interactive compilers</div>
                      <div className="pl-4">└── [activeTab: about] ──────&gt; Professional trajectory timeline / Trajectory Index</div>
                    </div>

                    <div className="space-y-3 font-sans text-xs sm:text-sm">
                      <h4 className="font-bold text-zinc-900 uppercase font-mono text-xs">Architectural Flow Principles:</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 font-light">
                        <li><strong>Single Frame Execution:</strong> Minimizes cognitive friction by keeping state changes in an elegant unified client context.</li>
                        <li><strong>Sub-Resource Sandboxes:</strong> Direct links between case studies and live interactive interpreters to verify theoretical solutions and logic constraints immediately.</li>
                        <li><strong>Durable Local State Persistence:</strong> Preserves newsletter subscribers and trace logs locally to maintain the "offline-first workbook" aesthetic.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. Homepage Wireframe */}
                {selectedStrategyItem === 1 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-02</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Homepage Wireframe</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      An ASCII deconstruction of our modern, Swiss-style typography grid, highlighting strict vertical alignments, margins, and the absence of flashy clutter.
                    </p>

                    <div className="bg-zinc-950 text-zinc-350 font-mono text-[9px] sm:text-[10px] p-5 rounded-lg overflow-x-auto whitespace-pre leading-normal select-text">
{`+-------------------------------------------------------------------------+
| [NAVBAR]  Isabel Ke                          HOME CASES WRITING...       |
+-------------------------------------------------------------------------+
|                                                                         |
|  [SYSTEMS & AI-NATIVE ARCHITECT]                                         |
|  Isabel Ke                                                               |
|  "Engineer. I study systems, build systems, and verify what AI creates." |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | [S-06 NEWSLETTER]                                                 |  |
|  | Subscribe to Weekly Notes on AI-Native Hardening & Verification   |  |
|  | [ Email Field: peer@systems.org ]  [ Button: CONNECT ]             |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  -+-------------------------------------------------------------------  |
|   | 01 -- WRITING (Systems Notes & Walkthroughs)                       |  |
|   |   - Trace walkthroughs on Bedrock Agent failures...          [DATE] |  |
|   |   - Why verification matters more than generation...         [DATE] |  |
|  -+-------------------------------------------------------------------  |
|   | 02 -- READING (Study Logs & Action Traces)                        |  |
|   |   - Designing Data-Intensive Applications                    [DONE] |  |
|   |   - A Philosophy of Software Design                         [READ] |  |
|  -+-------------------------------------------------------------------  |
|   | 03 -- BUILDING (Cases & Playgrounds)                             |  |
|   |   - AWS Bedrock Agent Shield Hardening Pipeline            [EXPERT] |  |
|   |   - Stateful Travel Scaping Worker Queue                 [ADVANCED] |  |
|  -+-------------------------------------------------------------------  |
|                                                                         |
| [FOOTER] San Francisco, CA | isabelkeyan@gmail.com | Truth & Verification |
+-------------------------------------------------------------------------+`}
                    </div>

                    <div className="space-y-2 font-sans text-xs sm:text-sm">
                      <h4 className="font-bold text-zinc-900 uppercase font-mono text-xs">Wireframe Layout Geometry:</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 font-light">
                        <li><strong>Content Max Width:</strong> Capped at <code>max-w-5xl</code> (1024px) for desktop read-lanes, preventing wide screen text dispersion.</li>
                        <li><strong>Asymmetric Hierarchy:</strong> Grid uses a 12-column layout. Section labels claim 4 left columns, and interactive list indices occupy 8 right columns for balanced visual pacing.</li>
                        <li><strong>Type contrast:</strong> Bold display headings in elegant Serif paired with micro-captions in strict Monospace.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 3. Navigation Structure */}
                {selectedStrategyItem === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-03</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Navigation Structure</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      A fast, state-managed unified navigator that preserves client states and telemetry logs while ensuring seamless sub-route transitions.
                    </p>

                    <div className="border border-zinc-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-200 font-mono text-[10px] text-zinc-400">
                            <th className="p-3">NAV ACTION</th>
                            <th className="p-3">DATA PARAMS BINDING</th>
                            <th className="p-3">FOCUS STATE TARGET</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 font-mono text-xs text-zinc-700">
                          <tr>
                            <td className="p-3 font-semibold text-zinc-950">HOME</td>
                            <td className="p-3">activeTab: 'home'</td>
                            <td className="p-3">Viewport resets to top</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-zinc-950">CASES</td>
                            <td className="p-3">activeTab: 'cases', selectedProject</td>
                            <td className="p-3">Displays selected autopsy board</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-zinc-950">WRITING</td>
                            <td className="p-3">activeTab: 'writing', expandedNoteId</td>
                            <td className="p-3">Expands note content inline</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-zinc-950">READING</td>
                            <td className="p-3">activeTab: 'reading'</td>
                            <td className="p-3">Study logs list</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-zinc-950">SANDBOXES</td>
                            <td className="p-3">activeTab: 'sandboxes', activeSandbox</td>
                            <td className="p-3">Loads selected live compiler engine</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-zinc-950">STRATEGY</td>
                            <td className="p-3">activeTab: 'strategy', S_Item</td>
                            <td className="p-3">Deep specification ledger (here)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Content Hierarchy */}
                {selectedStrategyItem === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-04</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Content Hierarchy</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      Designed to prove strategic thinking immediately. Traditional portfolio metrics are completely replaced with structured qualitative evidence, guiding users through three strict contextual layers.
                    </p>

                    <div className="space-y-4 font-sans text-xs sm:text-sm">
                      <div className="border border-zinc-200 p-4 rounded-lg space-y-2">
                        <span className="font-mono text-[10px] bg-zinc-950 text-white px-2 py-0.5 rounded font-bold uppercase">L-1: EMPIRICAL EVIDENCE</span>
                        <p className="text-zinc-600 leading-relaxed font-light">
                          <strong>Active Case Studies:</strong> Front-and-center layouts explaining how the engineer identifies failure points and configures strict deterministic guards around AWS and LLMs.
                        </p>
                      </div>

                      <div className="border border-zinc-200 p-4 rounded-lg space-y-2">
                        <span className="font-mono text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-bold uppercase">L-2: CONCRETE WALKTHROUGHS</span>
                        <p className="text-zinc-600 leading-relaxed font-light">
                          <strong>Engineering Judgment Notes:</strong> Highly cohesive deconstructions of model behavior adjustments and runtime tradeoffs, refusing generic tutorial text.
                        </p>
                      </div>

                      <div className="border border-zinc-200 p-4 rounded-lg space-y-2">
                        <span className="font-mono text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-bold uppercase">L-3: SYSTEMIC SYNTHESIS</span>
                        <p className="text-zinc-600 leading-relaxed font-light">
                          <strong>Literature Traces & Sandboxes:</strong> Proving academic retention and logical verification through active web compilers that can be triggered locally inside the browser.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Homepage Copy */}
                {selectedStrategyItem === 4 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-05</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Homepage Copy Design</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      Homepage text designed to establish absolute authority and human credibility while avoiding exaggerated corporate buzzwords.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-[#FAF9F6] border border-zinc-200 p-4 rounded font-serif text-xs sm:text-sm space-y-3">
                        <div className="font-mono text-[10px] text-zinc-450 uppercase font-bold border-b border-zinc-200 pb-1">Tagline Block</div>
                        <p className="italic text-lg text-zinc-800">"Engineer. I study systems, build systems, and verify what AI creates."</p>
                        
                        <div className="font-mono text-[10px] text-zinc-450 uppercase font-bold border-b border-zinc-200 pb-1 pt-2">Abstract Copy</div>
                        <p className="text-zinc-700 leading-relaxed font-light">
                          "Understanding systems in the age of AI. I document what I build, what I study, and how I verify it. This is a deliberate record of architectural deconstructions, literature synthesis, and empirical validation tools."
                        </p>
                      </div>

                      <div className="text-xs sm:text-sm font-sans space-y-2">
                        <h4 className="font-bold text-zinc-950 uppercase font-mono text-xs">Copy Principles applied:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-zinc-600 font-light">
                          <li><strong>Zero Fake Metrics:</strong> Retains complete humility; focuses on true deconstructive text rather than boasting "200% optimized".</li>
                          <li><strong>Human Voice:</strong> Focuses on accountability: "The bottleneck of systems is validation."</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Newsletter Positioning */}
                {selectedStrategyItem === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-06</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Newsletter Positioning</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      Targeted strictly to technical peers, leaders, and hiring decision-makers who appreciate genuine verification over marketing noise.
                    </p>

                    <div className="border border-zinc-200 p-4 sm:p-5 rounded-lg space-y-4 font-sans text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase">THE PROMISE</span>
                          <p className="text-zinc-600 mt-1 font-light">"Weekly notes on AI-native engineering, production hardening, and system-verification."</p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase">THE PARRING CAPTION</span>
                          <p className="text-zinc-600 mt-1 font-light">"Strictly primary systems deconstructions. Zero tracking pixels. Zero marketeer jargon."</p>
                        </div>
                      </div>

                      <div className="border-t border-zinc-150 pt-3">
                        <span className="font-mono text-[10px] font-bold text-zinc-400 block mb-1">AUDIENCE PROFILE</span>
                        <p className="text-zinc-600 leading-relaxed font-light">
                          Engineers, Staff Architects, tech leaders, and technical recruiters searching for an engineer who understands that <em>generating</em> code is cheap, but <em>hardening</em> and <em>verifying</em> it is where master craftsmanship begins.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Project Case Study Template */}
                {selectedStrategyItem === 6 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-07</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Project Case Study Template</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      The strict structural contract applied to every deconstructed project case, guiding readers logically from initial distress coordinates to proven hardening models.
                    </p>

                    <div className="bg-[#FAF9F6] p-4 rounded-lg font-mono text-[10px] space-y-2 border border-zinc-200 text-zinc-800 leading-relaxed">
                      <div>interface ProjectCaseStudy &#123;</div>
                      <div className="pl-4 text-zinc-500">/** Coordinates */</div>
                      <div className="pl-4">id: string;</div>
                      <div className="pl-4">title: string;</div>
                      <div className="pl-4">subtitle: string;</div>
                      <div className="pl-4">category: string;</div>
                      <div className="pl-4">difficulty: 'Expert' | 'Advanced' | 'Intermediate';</div>
                      <div className="pl-4 text-zinc-500">/** Content */</div>
                      <div className="pl-4">problem: string; <span className="text-zinc-450">// Detailed operational distress</span></div>
                      <div className="pl-4">originalDesign: string; <span className="text-zinc-450">// Prior fragile configuration</span></div>
                      <div className="pl-4">gaps: string; <span className="text-zinc-450">// Explicit structural flaws identified</span></div>
                      <div className="pl-4">decision: string; <span className="text-zinc-450">// Chosen design contract pattern</span></div>
                      <div className="pl-4">alternativeConsidered: string;</div>
                      <div className="pl-4">whyRejected: string; <span className="text-zinc-450">// Objective technical reasons</span></div>
                      <div className="pl-4">improvements: string; <span className="text-zinc-450">// Actual hardening proxies deployed</span></div>
                      <div className="pl-4">lessons: string; <span className="text-zinc-450">// Systematic epiphanies and controls</span></div>
                      <div className="pl-4">interactiveSandboxId?: string; <span className="text-zinc-450">// Direct binding to browser test playground</span></div>
                      <div>&#125;</div>
                    </div>
                  </div>
                )}

                {/* 8. Engineering Note Template */}
                {selectedStrategyItem === 7 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-08</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Engineering Note Template</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      The structure of Isabel's technical walkthrough reflections. Rather than basic "how-to" tutorials, these essays serve as records of system behavior diagnostics.
                    </p>

                    <div className="bg-[#FAF9F6] p-4 rounded-lg font-mono text-[10px] space-y-2 border border-zinc-200 text-zinc-800 leading-relaxed">
                      <div>interface BlogWalkthroughNote &#123;</div>
                      <div className="pl-4">id: string;</div>
                      <div className="pl-4">title: string;</div>
                      <div className="pl-4">date: string;</div>
                      <div className="pl-4">readTime: string;</div>
                      <div className="pl-4">category: string;</div>
                      <div className="pl-4">summary: string; <span className="text-zinc-450">// Autopsy core summary</span></div>
                      <div className="pl-4">content: MarkdownText; <span className="text-zinc-450">// Walkthrough trace logs and negative bounds</span></div>
                      <div className="pl-4">tags: string[];</div>
                      <div>&#125;</div>
                    </div>
                  </div>
                )}

                {/* 9. Reading Note Template */}
                {selectedStrategyItem === 8 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-09</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Reading Note Template</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      To ensure continuous translation from theory to practice, every paper or book note must explicitly document exactly what component Isabel designed and built as a response.
                    </p>

                    <div className="bg-[#FAF9F6] p-4 rounded-lg font-mono text-[10px] space-y-2 border border-zinc-200 text-zinc-800 leading-relaxed">
                      <div>interface LiteratureNote &#123;</div>
                      <div className="pl-4">id: string;</div>
                      <div className="pl-4">title: string;</div>
                      <div className="pl-4">author: string;</div>
                      <div className="pl-4">source: string;</div>
                      <div className="pl-4">sourceType: 'Book' | 'Podcast' | 'Paper' | 'Blog';</div>
                      <div className="pl-4">date: string;</div>
                      <div className="pl-4">keyInsights: string[]; <span className="text-zinc-450">// Core distilled architectural rules</span></div>
                      <div className="pl-4">evidence: string; <span className="text-zinc-450">// Physical chapter or section maps</span></div>
                      <div className="pl-4">reflection: string; <span className="text-zinc-450">// Analytical interpretation</span></div>
                      <div className="pl-4 font-bold text-zinc-950">actionableTakeaways: string[]; <span className="text-emerald-700">// "WHAT I BUILT AFTERWARD"</span></div>
                      <div>&#125;</div>
                    </div>
                  </div>
                )}

                {/* 10. Design Recommendations */}
                {selectedStrategyItem === 9 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-10</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Design System Spec Sheet</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      Rejects consumer SaaS landing page mechanics. Standardizes an archival, premium editorial aesthetic mimicking a clean desk workbook with high typography contrast.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="border border-zinc-200 p-4 rounded space-y-2 bg-zinc-50">
                        <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">COLORS & FONTS</span>
                        <ul className="space-y-1 text-zinc-600 font-light list-disc pl-4">
                          <li><strong>Background:</strong> Warm, off-white matte canvas (<code>#FCFBFA</code>).</li>
                          <li><strong>Typography:</strong> Inter (sans-serif UI) paired with Georgia/Playfair serif for headers.</li>
                          <li><strong>Accents:</strong> Charcoal (<code>#18181b</code>) and subtle Emerald logs.</li>
                        </ul>
                      </div>

                      <div className="border border-zinc-200 p-4 rounded space-y-2 bg-zinc-50">
                        <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">EXCLUSTIONS / NO-AI-SLOP</span>
                        <ul className="space-y-1 text-zinc-600 font-light list-disc pl-4">
                          <li>No futuristic glow vectors or absolute dark grids.</li>
                          <li>No unrequested animated hover bubble backgrounds.</li>
                          <li>No floating mock terminal logs as ambient visual fillers.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 11. SEO & Infiltration Strategy */}
                {selectedStrategyItem === 10 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-11</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">SEO Search Infiltration</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      Bypasses generic catchphrase SEO in favor of highly targeted, system-intense terminology. This attracts direct searches performed exclusively by principal architects and advanced recruiters.
                    </p>

                    <div className="space-y-3 font-sans text-xs sm:text-sm">
                      <div className="p-3 bg-zinc-50 rounded border border-zinc-200 font-mono text-[11px] text-zinc-700">
                        <strong className="text-zinc-900 block font-bold mb-1">Target Keyword Arrays:</strong>
                        "AWS Bedrock agent hardening", "Pydantic parsing schema contracts", "exponential backoff circuit breaker", "token budget limits gateway", "Donella Meadows client-side state mapping", "type-safety boundary LLM", "isolated runtime compiler React"
                      </div>

                      <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 font-light">
                        <li><strong>Structured Schema JSON:</strong> High hierarchy clean markup enabling search spiders to categorize content categories (cases, reflections, sandbox) automatically.</li>
                        <li><strong>Metadata Anchors:</strong> Strict title pairings mapping the technology to the concrete failure resolved (e.g. "Autopsy of AWS Bedrock Agents").</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 12. Long-Term Content Strategy */}
                {selectedStrategyItem === 11 && (
                  <div className="space-y-6">
                    <div className="border-b border-zinc-150 pb-4 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 block">BLUEPRINT S-12</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950">Long-Term Content Strategy</h3>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-zinc-650 leading-relaxed font-light">
                      A steady twelve-month publication cadence, tracing real engineering hardships, structured to establish permanent credibility.
                    </p>

                    <div className="space-y-4 font-sans text-xs sm:text-sm">
                      <div className="border border-zinc-200 p-4 rounded-lg space-y-2">
                        <span className="font-mono text-[9px] font-bold text-zinc-400">QUARTER 1 — THE VERIFIER'S NOTEBOOK</span>
                        <p className="text-zinc-600 font-light leading-relaxed">
                          Publishing autopsies of production anomalies we triggered internally. Topics include: N+1 DB locks by query generators, state machine deadlocks during polling scrapes, and schema-drift.
                        </p>
                      </div>

                      <div className="border border-zinc-200 p-4 rounded-lg space-y-2">
                        <span className="font-mono text-[9px] font-bold text-zinc-400">QUARTER 2 — DEEP SYSTEM VISUALIZATIONS</span>
                        <p className="text-zinc-600 font-light leading-relaxed">
                          Adding visual runtime tracers to the browser sandboxes. Building a mini-network latency controller that simulates replication lag issues inside distributed databases.
                        </p>
                      </div>

                      <div className="border border-zinc-200 p-4 rounded-lg space-y-2">
                        <span className="font-mono text-[9px] font-bold text-zinc-400">QUARTER 3 — COLLABORATIVE HARDENING STUDY</span>
                        <p className="text-zinc-650 font-light leading-relaxed">
                          Conducting trace reviews of public open-source agent SDKs, parsing their vulnerabilities, and demonstrating type-safe gateway wrappers to protect enterprise infrastructure.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}
        {activeTab === 'about' && (
          <div className="space-y-10 animate-fadeIn font-sans max-w-3xl">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-250 pb-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                  03 / PROFESSIONAL TRAJECTORY
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

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold">Architectural Summary</h3>
              <p className="text-sm font-serif text-zinc-750 leading-relaxed font-light">
                {RESUME_DATA.summary}
              </p>
            </div>

            {/* Core Skills */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold mr-1">Skills Array</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-1.5 shadow-xs">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">Languages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {RESUME_DATA.skills.languages.map(lang => (
                      <span key={lang} className="text-[10px] font-mono bg-zinc-50 border border-zinc-150 rounded px-2 py-0.5 text-zinc-700">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-1.5 shadow-xs">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">Frameworks</span>
                  <div className="flex flex-wrap gap-1.5">
                    {RESUME_DATA.skills.frameworks.map(frame => (
                      <span key={frame} className="text-[10px] font-mono bg-zinc-50 border border-zinc-150 rounded px-2 py-0.5 text-zinc-700">
                        {frame}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-1.5 shadow-xs">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold block uppercase tracking-wider">Tools & Platforms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {RESUME_DATA.skills.tools.map(tool => (
                      <span key={tool} className="text-[10px] font-mono bg-zinc-50 border border-zinc-150 rounded px-2 py-0.5 text-zinc-700">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold">Technical Career Timeline</h3>
              <div className="space-y-8 pl-1">
                {RESUME_DATA.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-zinc-200 space-y-2">
                    {/* Anchor bullet */}
                    <div className="absolute -left-1.5 top-1 w-3 h-3 bg-zinc-950 rounded-full border border-white" />
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <h4 className="font-serif text-base font-bold text-zinc-950">{exp.role}</h4>
                        <span className="text-xs text-zinc-500 font-medium block">{exp.company}</span>
                      </div>
                      <span className="text-xs font-mono text-zinc-400">{exp.period}</span>
                    </div>

                    <ul className="list-none space-y-2 text-xs sm:text-sm text-zinc-650 font-serif font-light leading-relaxed pl-1">
                      {exp.bullets.map((bullet, bidx) => (
                        <li key={bidx} className="pl-3 border-l-2 border-zinc-100">
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-3 pt-6 border-t border-zinc-200">
              <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {RESUME_DATA.certifications.map((cert, idx) => (
                  <span key={idx} className="text-xs bg-zinc-50 text-zinc-700 font-mono border border-zinc-200 rounded px-3 py-1.5">
                    ✓ {cert}
                  </span>
                ))}
              </div>
            </div>

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
            <span className="font-semibold text-zinc-900">Truth & Verification</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
