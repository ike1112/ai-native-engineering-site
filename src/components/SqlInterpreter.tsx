/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Play, RotateCcw, Copy, Check, Info } from 'lucide-react';

interface Row {
  [key: string]: any;
}

const INITIAL_ROWS: Row[] = [
  { id: 1, name: 'Alice', role: 'Frontend Dev', experience_years: 3, preferred_language: 'TypeScript', coffees_per_week: 14 },
  { id: 2, name: 'Bob', role: 'Backend engineer', experience_years: 5, preferred_language: 'Go', coffees_per_week: 21 },
  { id: 3, name: 'Charlie', role: 'Fullstack Dev', experience_years: 2, preferred_language: 'JavaScript', coffees_per_week: 8 },
  { id: 4, name: 'Diana', role: 'DevOps Lead', experience_years: 8, preferred_language: 'Python', coffees_per_week: 18 },
  { id: 5, name: 'Ethan', role: 'ML Engineer', experience_years: 4, preferred_language: 'Python', coffees_per_week: 12 },
  { id: 6, name: 'Fiona', role: 'UI/UX Engineer', experience_years: 1, preferred_language: 'TypeScript', coffees_per_week: 5 },
];

const PRESETS = [
  {
    name: "Get all records",
    query: "SELECT id, name, role, coffees_per_week FROM developers"
  },
  {
    name: "Filter by strong experience (years > 3)",
    query: "SELECT name, role, experience_years FROM developers WHERE experience_years > 3 ORDER BY experience_years DESC"
  },
  {
    name: "Python developers list",
    query: "SELECT name, role, preferred_language FROM developers WHERE preferred_language = 'Python'"
  },
  {
    name: "Sort by caffeine intake",
    query: "SELECT name, role, coffees_per_week FROM developers ORDER BY coffees_per_week DESC LIMIT 3"
  }
];

export default function SqlInterpreter() {
  const [query, setQuery] = useState(PRESETS[0].query);
  const [results, setResults] = useState<Row[]>(INITIAL_ROWS.map(({id, name, role, coffees_per_week}) => ({id, name, role, coffees_per_week})));
  const [columns, setColumns] = useState<string[]>(['id', 'name', 'role', 'coffees_per_week']);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>("Initial dataset loaded.");

  const runSql = (rawSql: string) => {
    setError(null);
    setSuccessMessage(null);
    const cleaned = rawSql.trim().replace(/\s+/g, ' ');
    
    // Low fidelity simple regex select parses:
    // SELECT <cols> FROM <table_name> [WHERE <cond>] [ORDER BY <col> [ASC|DESC]] [LIMIT <num>]
    const regex = /^SELECT (.*?) FROM (\w+)(?: WHERE (.*?))?(?: ORDER BY (\w+)(?: (ASC|DESC))?)?(?: LIMIT (\d+))?$/i;
    const match = cleaned.match(regex);

    if (!match) {
      setError("Syntax Error: Simple parser supports exact format:\nSELECT column1, column2 FROM developers [WHERE condition] [ORDER BY col [ASC|DESC]] [LIMIT num]\n\ne.g. WHERE experience_years > 3");
      setResults([]);
      return;
    }

    const selectColsRaw = match[1].trim();
    const tableName = match[2].trim().toLowerCase();
    const whereConditionRaw = match[3] ? match[3].trim() : null;
    const orderByCol = match[4] ? match[4].trim() : null;
    const orderDirection = match[5] ? match[5].toUpperCase() : 'ASC';
    const limitCount = match[6] ? parseInt(match[6]) : null;

    if (tableName !== 'developers') {
      setError(`Table "${tableName}" not found. Did you mean "developers"?`);
      setResults([]);
      return;
    }

    let filtered = [...INITIAL_ROWS];

    // 1. Filter by where clause
    if (whereConditionRaw) {
      // support "=" or ">" or "<" or "LIKE"
      // e.g. preferred_language = 'Python'
      // e.g. experience_years > 3
      const numMatch = whereConditionRaw.match(/^(\w+)\s*([>=<]+)\s*(\d+)$/);
      const strMatch = whereConditionRaw.match(/^(\w+)\s*=\s*['"](.*?)['"]$/i);
      const likeMatch = whereConditionRaw.match(/^(\w+)\s+LIKE\s+['"]%(.*?)%['"]$/i);

      if (numMatch) {
        const col = numMatch[1];
        const op = numMatch[2];
        const val = parseInt(numMatch[3]);
        filtered = filtered.filter(row => {
          if (row[col] === undefined) return false;
          if (op === '=') return row[col] === val;
          if (op === '>') return row[col] > val;
          if (op === '<') return row[col] < val;
          if (op === '>=') return row[col] >= val;
          if (op === '<=') return row[col] <= val;
          return false;
        });
      } else if (strMatch) {
         const col = strMatch[1];
         const val = strMatch[2];
         filtered = filtered.filter(row => {
           if (row[col] === undefined) return false;
           return String(row[col]).toLowerCase() === val.toLowerCase();
         });
      } else if (likeMatch) {
        const col = likeMatch[1];
        const val = likeMatch[2];
        filtered = filtered.filter(row => {
          if (row[col] === undefined) return false;
          return String(row[col]).toLowerCase().includes(val.toLowerCase());
        });
      } else {
        setError("Invalid WHERE format in helper SQL interpreter. Supported syntax:\n- id > 2\n- preferred_language = 'Python'\n- role LIKE '%dev%'");
        setResults([]);
        return;
      }
    }

    // 2. Sort results
    if (orderByCol) {
      if (INITIAL_ROWS.length > 0 && INITIAL_ROWS[0][orderByCol] === undefined) {
        setError(`Column "${orderByCol}" for order clause not found in table schema.`);
        setResults([]);
        return;
      }
      filtered.sort((a, b) => {
        const valA = a[orderByCol];
        const valB = b[orderByCol];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return orderDirection === 'DESC' ? valB - valA : valA - valB;
        }
        return orderDirection === 'DESC' 
          ? String(valB).localeCompare(String(valA)) 
          : String(valA).localeCompare(String(valB));
      });
    }

    // 3. Limit count
    if (limitCount !== null) {
      filtered = filtered.slice(0, limitCount);
    }

    // 4. Select columns
    let selectCols: string[] = [];
    if (selectColsRaw === '*') {
      selectCols = Object.keys(INITIAL_ROWS[0]);
    } else {
      selectCols = selectColsRaw.split(',').map(s => s.trim());
      const invalidCol = selectCols.find(c => INITIAL_ROWS[0][c] === undefined);
      if (invalidCol) {
        setError(`Column "${invalidCol}" specified in SELECT is missing in table schema.`);
        setResults([]);
        return;
      }
    }

    const projectedRows = filtered.map(row => {
      const proj: Row = {};
      selectCols.forEach(c => {
        proj[c] = row[c];
      });
      return proj;
    });

    setColumns(selectCols);
    setResults(projectedRows);
    setSuccessMessage(`Query completed successfully: ${projectedRows.length} rows returned.`);
  };

  const handleReset = () => {
    setQuery(PRESETS[0].query);
    runSql(PRESETS[0].query);
  };

  return (
    <div id="sql-interpreter" className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Interactive SQL Terminal & Query Sandbox</h3>
            <p className="text-xs text-slate-500">Live relational client-side SQL model running on an in-memory dev dataset</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Editor & Presets */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                SQL Editor
              </label>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono">
                Table: developers
              </span>
            </div>
            
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-32 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl p-4 border border-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                spellCheck="false"
              />
              <button
                onClick={() => runSql(query)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-all shadow-md cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Execute Query
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Preset Study Queries</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(preset.query);
                    runSql(preset.query);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 border border-slate-100 rounded-lg text-left transition-all group cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 truncate">{preset.name}</p>
                  <code className="text-[10px] text-slate-400 font-mono block mt-1 truncate">{preset.query}</code>
                </button>
              ))}
            </div>
          </div>

          {/* Table Schema Specs */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-start gap-2.5 text-slate-600">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold block text-slate-700">Database Schema: `developers`</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Contains columns: <code className="bg-slate-200/60 px-1 rounded font-mono text-[10px]">id (INT)</code>,{' '}
                <code className="bg-slate-200/60 px-1 rounded font-mono text-[10px]">name (VARCHAR)</code>,{' '}
                <code className="bg-slate-200/60 px-1 rounded font-mono text-[10px]">role (VARCHAR)</code>,{' '}
                <code className="bg-slate-200/60 px-1 rounded font-mono text-[10px]">experience_years (INT)</code>,{' '}
                <code className="bg-slate-200/60 px-1 rounded font-mono text-[10px]">preferred_language (VARCHAR)</code>,{' '}
                <code className="bg-slate-200/60 px-1 rounded font-mono text-[10px]">coffees_per_week (INT)</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Results Viewer */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex-1 bg-white border border-slate-100 rounded-xl flex flex-col min-h-[280px]">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Output Table Results
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-400">
                SQL Console
              </span>
            </div>

            <div className="flex-1 overflow-x-auto p-4 max-h-[300px] custom-scrollbar">
              {error ? (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 text-xs font-mono text-rose-600 whitespace-pre-wrap leading-relaxed">
                  {error}
                </div>
              ) : results.length === 0 ? (
                <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 text-xs italic">
                  No records match selection parameters. Try adjusting queries.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-mono uppercase text-[10px] tracking-wider">
                      {columns.map((col) => (
                        <th key={col} className="p-2.5 font-bold">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    {results.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        {columns.map((col) => (
                          <td key={col} className="p-2.5">
                            {row[col] !== undefined ? String(row[col]) : <span className="text-slate-300">NULL</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {successMessage && (
              <div className="px-4 py-2 border-t border-slate-100 bg-emerald-50/30 text-emerald-600 text-xs font-semibold flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
