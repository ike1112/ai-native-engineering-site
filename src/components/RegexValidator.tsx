/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Target, Info, Check, Copy } from 'lucide-react';

interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
  text: string;
}

const REGEX_PRESETS: RegexPreset[] = [
  {
    name: "Extract Emails",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    text: "For any assistance, write to support@devjourney.io or admin.core@learning.net. Queries sent to urgent-log@net won't match."
  },
  {
    name: "Match Hex Colors",
    pattern: "#[a-fA-F0-9]{3,6}\\b",
    flags: "g",
    text: "Our design system integrates dark theme color #0f172a, blue accent #2563eb, gray borders #e2e8f0, and customized red text #f43"
  },
  {
    name: "Find Hashtags",
    pattern: "#[a-zA-Z0-9_]+",
    flags: "g",
    text: "Publishing milestones is fun! #DeveloperJourney #learning_everyday #100DaysOfCode ! Ready for #React19 ?"
  },
  {
    name: "Capture Dates (YYYY-MM-DD)",
    pattern: "\\d{4}-\\d{2}-\\d{2}",
    flags: "g",
    text: "Weekly roadmap started on 2026-06-12, while the next milestone log is scheduled for 2026-06-19 and finished on 2026-06-21."
  }
];

export default function RegexValidator() {
  const [pattern, setPattern] = useState(REGEX_PRESETS[0].pattern);
  const [flags, setFlags] = useState(REGEX_PRESETS[0].flags);
  const [testText, setTestText] = useState(REGEX_PRESETS[0].text);
  const [error, setError] = useState<string | null>(null);

  const parsedRegex = useMemo(() => {
    setError(null);
    if (!pattern) return null;
    try {
      return new RegExp(pattern, flags);
    } catch (err: any) {
      setError(err.message || 'Invalid regular expression');
      return null;
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!parsedRegex || !testText) return [];
    const results: { text: string; index: number; length: number }[] = [];
    const localRegex = new RegExp(parsedRegex); // Clone to reset state
    
    // Safety check for empty matches to prevent infinite loops
    let testPattern = localRegex.source;
    if (testPattern === "" || testPattern === "(?:)" || testPattern === "()") {
      return [];
    }

    try {
      if (flags.includes('g')) {
        let match;
        let iterations = 0;
        while ((match = localRegex.exec(testText)) !== null && iterations < 500) {
          iterations++;
          results.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
          });
          if (match[0].length === 0) {
            localRegex.lastIndex++; // Advance index to avoid infinite loops
          }
        }
      } else {
        const match = localRegex.exec(testText);
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
          });
        }
      }
    } catch (e: any) {
      console.error(e);
    }
    return results;
  }, [parsedRegex, testText, flags]);

  // Generates highlighted HTML layout
  const highlightedMarkup = useMemo(() => {
    if (!testText) return { __html: "" };
    if (matches.length === 0) return { __html: testText };

    let html = "";
    let lastIndex = 0;

    // Sort matches by index to handle them in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    for (const match of sortedMatches) {
      if (match.index < lastIndex) continue; // Skip overlapping matches
      
      // Add plain text before match
      html += escapeHtml(testText.slice(lastIndex, match.index));
      // Add highlighted matched text
      html += `<span class="bg-indigo-100 text-indigo-900 border-b border-indigo-400 font-mono font-semibold px-0.5 rounded-sm" title="Match index: ${match.index}">${escapeHtml(match.text)}</span>`;
      lastIndex = match.index + match.length;
    }

    // Add remaining plain text
    html += escapeHtml(testText.slice(lastIndex));
    return { __html: html };
  }, [testText, matches]);

  function escapeHtml(text: string) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const handleToggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <div id="regex-validator" className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Interactive RegExp Pattern Matcher</h3>
            <p className="text-xs text-slate-500">Live regular expression parser displaying highlighted matches and capturing groups</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Editor panel */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Expression Pattern
            </label>
            <div className="flex items-center bg-slate-100 rounded-xl p-2 border border-slate-200">
              <span className="font-mono text-slate-400 text-sm px-1">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Write regex pattern..."
                className="flex-1 bg-transparent border-none font-mono text-xs outline-none text-slate-800 font-semibold"
                spellCheck="false"
              />
              <span className="font-mono text-slate-400 text-sm px-1">/</span>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 ml-1">
                {['g', 'i', 'm'].map((flag) => (
                  <button
                    key={flag}
                    onClick={() => handleToggleFlag(flag)}
                    className={`w-5 h-5 flex items-center justify-center font-mono text-[10px] rounded-md font-bold transition-all cursor-pointer ${
                      flags.includes(flag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                    }`}
                    title={`Toggle ${flag === 'g' ? 'Global' : flag === 'i' ? 'Case Insensitive' : 'Multiline'} flag`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <p className="text-[11px] text-rose-500 font-mono mt-2 bg-rose-50 border border-rose-100 p-2 rounded-lg">
                ❌ {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Test Sample Text
            </label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full h-24 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed font-sans"
              placeholder="Provide test sample paragraph or source strings to analyze..."
              spellCheck="false"
            />
          </div>

          {/* Quick presets */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Ready Expression Presets</h4>
            <div className="grid grid-cols-2 gap-2">
              {REGEX_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPattern(preset.pattern);
                    setFlags(preset.flags);
                    setTestText(preset.text);
                  }}
                  className="p-2 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-100 rounded-lg text-left transition-all cursor-pointer"
                >
                  <p className="text-[11px] font-semibold text-slate-700 truncate">{preset.name}</p>
                  <code className="text-[9px] text-slate-400 font-mono block mt-0.5 truncate">/{preset.pattern}/</code>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Matches Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-2 mb-3 flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Interactive Match Highlights</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-sans font-semibold">
                Captured: {matches.length} matches
              </span>
            </div>

            {/* Live highlighted rendering */}
            <div className="flex-1 min-h-[120px] bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs leading-relaxed text-slate-600 font-sans select-text overflow-y-auto max-h-[160px] custom-scrollbar">
              {testText ? (
                <div dangerouslySetInnerHTML={highlightedMarkup} />
              ) : (
                <span className="text-slate-400 italic">Provide some test text on the left to inspect highlights...</span>
              )}
            </div>

            {/* Captures Details */}
            <div className="border-t border-slate-100 pt-3 mt-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Capture Group Array</span>
              <div className="max-h-[110px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {matches.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No matches caught in sample text.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {matches.map((match, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 p-1 px-2.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-mono">
                        <span className="text-slate-400 bg-slate-200/60 px-1 py-0.5 rounded">[{idx}]</span>
                        <span className="text-indigo-600 font-semibold truncate flex-1">{match.text}</span>
                        <span className="text-slate-400 text-[9px]">idx:{match.index}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
