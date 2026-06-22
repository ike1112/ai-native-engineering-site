/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RoadmapItem, RoadmapTopic } from '../types';
import { Sparkles, Calendar, BookOpen, GraduationCap, CheckCircle2, Circle } from 'lucide-react';

interface RoadmapViewProps {
  roadmap: RoadmapItem[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
}

export default function RoadmapView({ roadmap, setRoadmap }: RoadmapViewProps) {
  const toggleTopic = (itemId: string, topicId: string) => {
    setRoadmap(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const updatedTopics = item.topics.map(t =>
            t.id === topicId ? { ...t, completed: !t.completed } : t
          );
          
          // Re-calculate the group status based on checks
          const completedCount = updatedTopics.filter(t => t.completed).length;
          let status: 'pending' | 'learning' | 'completed' = 'pending';
          if (completedCount === updatedTopics.length) {
            status = 'completed';
          } else if (completedCount > 0) {
            status = 'learning';
          }

          return {
            ...item,
            topics: updatedTopics,
            status,
          };
        }
        return item;
      })
    );
  };

  const getPercentage = (item: RoadmapItem) => {
    if (item.topics.length === 0) return 0;
    const completed = item.topics.filter(t => t.completed).length;
    return Math.round((completed / item.topics.length) * 100);
  };

  const overallProgress = () => {
    let total = 0;
    let completed = 0;
    roadmap.forEach(item => {
      total += item.topics.length;
      completed += item.topics.filter(t => t.completed).length;
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GraduationCap className="w-48 h-48" />
        </div>
        
        <div className="max-w-xl relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider">
              Roadmap Engine
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Last updated: June 2026
            </span>
          </div>
          <h2 className="text-2xl font-bold font-sans tracking-tight mb-2">Developer Progress Milestones</h2>
          <p className="text-slate-300 text-xs leading-relaxed mb-4">
            A comprehensive, transparent roadmap tracing core standards of Web Engineering. Mark off subtopics as you learn them to update the overall completion metrics live.
          </p>
          
          {/* Progress bar container */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Overall Roadmap Mastery</span>
              <span>{overallProgress()}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${overallProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of roadmap sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roadmap.map((item) => {
          const pct = getPercentage(item);
          return (
            <div key={item.id} className="bg-white border border-slate-100 rounded-xl p-5 hover:border-slate-200 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                      item.category === 'frontend' ? 'bg-orange-55 text-orange-700 border border-orange-100' :
                      item.category === 'backend' ? 'bg-indigo-55 text-indigo-700 border border-indigo-100' :
                      item.category === 'systems' ? 'bg-amber-55 text-amber-700 border border-amber-100' :
                      'bg-purple-55 text-purple-700 border border-purple-100'
                    }`}>
                      {item.category}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm mt-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <span className={`text-xs font-mono font-bold ${
                    pct === 100 ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {pct}%
                  </span>
                </div>

                {/* Subtopic checkboxes */}
                <div className="space-y-2 mt-4">
                  {item.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(item.id, topic.id)}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/50 rounded-lg text-left text-xs transition-all group cursor-pointer border border-transparent hover:border-slate-200/50"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {topic.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-350 shrink-0 group-hover:text-slate-500" />
                        )}
                        <span className={`truncate text-slate-700 font-medium ${
                          topic.completed ? 'line-through text-slate-400' : ''
                        }`}>
                          {topic.name}
                        </span>
                      </div>
                      <span className={`text-[9px] uppercase font-bold py-0.5 px-1.5 rounded shrink-0 ${
                        topic.completed 
                          ? 'bg-emerald-100/60 text-emerald-800' 
                          : 'bg-slate-200/60 text-slate-500'
                      }`}>
                        {topic.completed ? 'Mastered' : 'To Learn'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress gauge inside card */}
              <div className="mt-5 pt-4 border-t border-slate-50">
                <div className="w-full bg-slate-150 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
