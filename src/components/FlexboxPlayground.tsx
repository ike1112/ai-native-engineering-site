/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutGrid, Plus, Trash2, Copy, Check, Eye } from 'lucide-react';

interface FlexItem {
  id: number;
  label: string;
  grow: number;
  shrink: number;
  basis: string;
}

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [justify, setJustify] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('center');
  const [align, setAlign] = useState<'flex-start' | 'center' | 'flex-end' | 'stretch'>('center');
  const [wrap, setWrap] = useState<'wrap' | 'nowrap'>('wrap');
  const [gap, setGap] = useState<number>(16);

  const [items, setItems] = useState<FlexItem[]>([
    { id: 1, label: 'Box 1', grow: 0, shrink: 1, basis: 'auto' },
    { id: 2, label: 'Box 2', grow: 0, shrink: 1, basis: 'auto' },
    { id: 3, label: 'Box 3', grow: 0, shrink: 1, basis: 'auto' },
  ]);

  const [copied, setCopied] = useState(false);

  const addItem = () => {
    if (items.length < 8) {
      const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
      setItems([...items, { id: nextId, label: `Box ${nextId}`, grow: 0, shrink: 1, basis: 'auto' }]);
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, key: keyof FlexItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [key]: value };
        }
        return item;
      })
    );
  };

  const cssCode = `.flex-container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}

${items
  .map(
    (item) => `.box-${item.id} {
  flex-grow: ${item.grow};
  flex-shrink: ${item.shrink};
  flex-basis: ${item.basis};
}`
  )
  .join('\n\n')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Styles map for the actual flex preview container
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
    gap: `${gap}px`,
    minHeight: '260px',
  };

  return (
    <div id="flexbox-playground" className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Interactive CSS Flexbox Playground</h3>
            <p className="text-xs text-slate-500">Practice core layouts visualizer designed & built as a study widget</p>
          </div>
        </div>
        <button
          onClick={addItem}
          disabled={items.length >= 8}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Box
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              flex-direction
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
              {(['row', 'row-reverse', 'column', 'column-reverse'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setDirection(dir)}
                  className={`py-1 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    direction === dir
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              justify-content
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
              {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const).map(
                (just) => (
                  <button
                    key={just}
                    onClick={() => setJustify(just)}
                    className={`py-1 px-1.5 text-[10px] font-medium rounded-md transition-all cursor-pointer truncate ${
                      justify === just
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                    title={just}
                  >
                    {just}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                align-items
              </label>
              <select
                value={align}
                onChange={(e) => setAlign(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 outline-none text-xs rounded-lg py-1.5 px-2.5 text-slate-700 font-medium"
              >
                {['flex-start', 'center', 'flex-end', 'stretch'].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                flex-wrap
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
                {(['wrap', 'nowrap'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWrap(w)}
                    className={`py-1 px-2.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      wrap === w
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                gap: {gap}px
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="48"
              step="4"
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Individual Box Overrides</h4>
            {items.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No boxes added. Click 'Add Box' above.</p>
            ) : (
              <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-lg"
                  >
                    <span className="text-xs font-mono font-semibold text-slate-700 min-w-[44px]">Box {item.id}:</span>
                    <div className="flex items-center gap-1.5 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">grow</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={item.grow}
                          onChange={(e) => updateItem(item.id, 'grow', parseInt(e.target.value) || 0)}
                          className="w-10 bg-white border border-slate-200 rounded p-1 text-center text-xs font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">basis</span>
                        <select
                          value={item.basis}
                          onChange={(e) => updateItem(item.id, 'basis', e.target.value)}
                          className="w-18 bg-white border border-slate-200 rounded p-1 text-center text-xs font-mono"
                        >
                          <option value="auto">auto</option>
                          <option value="0">0</option>
                          <option value="120px">120px</option>
                          <option value="200px">200px</option>
                          <option value="30%">30%</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                      title="Delete Box"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview and Generated Code Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex-1 bg-slate-900 border border-slate-950 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Eye className="w-3.5 h-3.5 text-blue-500" /> Interactive Browser Workspace Viewport
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono">
                Flex Container
              </span>
            </div>

            {/* Simulated browser stage */}
            <div className="flex-1 bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-y-auto max-h-[300px]">
              <div style={containerStyle} className="transition-all duration-300">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg font-mono text-xs font-bold text-center shadow-md select-none border border-blue-400 relative group transition-all duration-300 min-w-[70px] min-h-[60px]"
                    style={{
                      flexGrow: item.grow,
                      flexShrink: item.shrink,
                      flexBasis: item.basis,
                    }}
                  >
                    <span>{item.label}</span>
                    <div className="text-[9px] opacity-70 mt-1">
                      g:{item.grow} s:{item.shrink} b:{item.basis}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Code Output */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs leading-relaxed relative text-slate-300">
            <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2 text-slate-500 text-[10px]">
              <span>GENERATED CSS SPECIFICATION</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 hover:text-white rounded text-[10px] cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy CSS
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-[140px] overflow-y-auto text-blue-400 text-[11px] custom-scrollbar">
              <code>{cssCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
