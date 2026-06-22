/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Flame, Cpu, DollarSign, Activity, Play, AlertTriangle, CheckCircle2, Server } from 'lucide-react';

interface LogItem {
  id: string;
  timestamp: string;
  type: 'info' | 'warn' | 'success' | 'danger';
  message: string;
}

export default function VerificationSandbox() {
  const [shieldActive, setShieldActive] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [testStats, setTestStats] = useState({
    passes: 0,
    fails: 0,
    cost: 0.00,
    latency: 0, // ms
    totalCalls: 0
  });
  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', timestamp: '00:01', type: 'info', message: 'Shield-Guard system state: INITIALIZED.' },
    { id: '2', timestamp: '00:02', type: 'success', message: 'Awaiting architectural transaction verification triggers...' }
  ]);

  const addLog = (message: string, type: 'info' | 'warn' | 'success' | 'danger') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      { id: Math.random().toString(), timestamp: time, type, message },
      ...prev.slice(0, 39) // Max 40 logs
    ]);
  };

  const handleRunSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    
    addLog(`Initiating AWS Bedrock transactional request routing...`, 'info');
    
    // Step 1: LLM request generation
    await sleep(400);
    const costIncrement = shieldActive ? 0.008 : 0.042; // Shield filters redundant token budgets!
    const latencyVal = shieldActive ? 280 : 1850; // Shield has exponential limits, aborts failure loops quickly!
    
    addLog(`[Step 1: LLM Call] Request received. Tokens spent: ${shieldActive ? '420' : '2,800'} (Input), ${shieldActive ? '150' : '980'} (Output).`, 'info');
    
    // Step 2: Validate Schema
    await sleep(500);
    if (shieldActive) {
      addLog(`[Step 2: Shield-Guard Validation] Running recursive schema type checks...`, 'info');
      await sleep(300);
      addLog(`[Step 2: Shield-Guard Validation] PASSED. Pydantic-model verified. No unexpected parameter injections identified.`, 'success');
    } else {
      addLog(`[Step 2: Direct Execution] WARNING: No validation guardrail active. Forwarding model output directly to SQLite executor.`, 'warn');
      await sleep(400);
      addLog(`[Step 2: SQL Failure] FATAL: Model hallucinated Column "preferred_dev_language_name". Original database table "developers" only possesses: "preferred_language".`, 'danger');
    }

    // Step 3: Circuit Breaker
    await sleep(400);
    if (!shieldActive) {
      addLog(`[Self-Correction Loop] Agent retry iteration #1 started...`, 'warn');
      await sleep(500);
      addLog(`[Self-Correction Loop] Agent retry iteration #2 started...`, 'warn');
      await sleep(400);
      addLog(`[Self-Correction Loop] Agent retry iteration #3 started...`, 'warn');
      await sleep(300);
      addLog(`[Circuit Breaker Failure] CRITICAL ERROR: Agent locked in recursive retry loop. Manual operator override required to resolve transaction!`, 'danger');
      setTestStats(prev => ({
        passes: prev.passes,
        fails: prev.fails + 1,
        cost: Number((prev.cost + costIncrement).toFixed(4)),
        latency: prev.latency + latencyVal,
        totalCalls: prev.totalCalls + 1
      }));
    } else {
      addLog(`[Step 3: Verification Sandbox] Automated unit validation matches database constraints exactly.`, 'success');
      setTestStats(prev => ({
        passes: prev.passes + 1,
        fails: prev.fails,
        cost: Number((prev.cost + costIncrement).toFixed(4)),
        latency: prev.latency + latencyVal,
        totalCalls: prev.totalCalls + 1
      }));
    }

    setIsRunning(false);
  };

  const handleResetStats = () => {
    setTestStats({ passes: 0, fails: 0, cost: 0.00, latency: 0, totalCalls: 0 });
    setLogs([
      { id: '1', timestamp: '00:01', type: 'info', message: 'Shield-Guard system: STATISTICS RE-SET.' },
      { id: '2', timestamp: '00:02', type: 'success', message: 'Awaiting architectural transactions...' }
    ]);
  };

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <div id="verification-sandbox" className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Chaos Pipeline & Self-Correction Simulator</h3>
            <p className="text-xs text-slate-500">Live test harness contrasting gated validation pipelines against direct LLM executors</p>
          </div>
        </div>
        
        {/* Toggle switch */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setShieldActive(true)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              shieldActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Shield-Guard Gated
          </button>
          <button
            onClick={() => setShieldActive(false)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              !shieldActive ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Raw Unlocked LLM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Interactive Workspace */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Configuration Parameters</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                shieldActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {shieldActive ? 'DEFENSE ACTIVE' : 'ZERO GUARDS'}
              </span>
            </h4>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify how introducing an automated verification proxy prevents hallucinated table keys from generating loop failures on database hosts.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                <span>Maximum Allowed Loops</span>
                <span className="font-mono text-slate-800 font-semibold">{shieldActive ? '1 Retry Cap' : 'Infinite Retries'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                <span>Schema Validator Wrapper</span>
                <span className="font-mono text-slate-850 font-semibold">{shieldActive ? 'Strict Pydantic Check' : 'None (Blind Pass-Through)'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Circuit Breaker State</span>
                <span className="font-mono text-slate-800 font-semibold">{shieldActive ? 'Operational (Fast Halts)' : 'Disabled'}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isRunning}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-xs text-white transition-all shadow-sm cursor-pointer ${
                  shieldActive 
                    ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300' 
                    : 'bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300'
                }`}
              >
                <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Running Verification...' : 'Trigger Script API Call'}
              </button>
              
              <button
                onClick={handleResetStats}
                className="py-2 px-3 border border-slate-200 hover:bg-slate-150 text-slate-500 rounded-lg text-xs font-medium cursor-pointer"
                title="Reset Stats"
              >
                Reset Stats
              </button>
            </div>
          </div>

          {/* Verification Metrics Dashboard */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-950 p-3 rounded-xl text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total cost</span>
              <div className="flex items-baseline gap-1 mt-1">
                <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xl font-mono font-bold text-emerald-300">{testStats.cost.toFixed(3)}</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-950 p-3 rounded-xl text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Avg Latency</span>
              <div className="flex items-baseline gap-1 mt-1">
                <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xl font-mono font-bold text-blue-300">
                  {testStats.totalCalls > 0 ? Math.round(testStats.latency / testStats.totalCalls) : 0}ms
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Successful Checks</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <CheckCircle2 className="text-emerald-500 w-4 h-4 shrink-0" />
                <span className="text-xl font-mono font-bold text-slate-800">{testStats.passes}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">System Failures</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <AlertTriangle className="text-rose-500 w-4 h-4 shrink-0" />
                <span className="text-xl font-mono font-bold text-slate-800">{testStats.fails}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Systems Event Board Log Console */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-950 border border-slate-900 text-slate-200 rounded-xl p-4 flex-1 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-center border-b border-slate-900 pb-2.5 mb-3.5">
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Server className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> CLOUD TRACING INSTANCE CONSOLE
                </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" /> STABLE LOGS
                </span>
              </div>

              <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1 font-mono text-xs custom-scrollbar">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 border-l-2 pl-2.5 py-0.5 border-slate-800">
                    <span className="text-slate-600 text-[10px] shrink-0">{log.timestamp}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                      log.type === 'success' ? 'bg-emerald-950/40 text-emerald-400' :
                      log.type === 'warn' ? 'bg-amber-950/40 text-amber-400' :
                      log.type === 'danger' ? 'bg-rose-950/40 text-rose-400' :
                      'bg-slate-900 text-slate-400'
                    }`}>
                      {log.type.toUpperCase()}
                    </span>
                    <p className={`flex-1 text-xs break-words leading-relaxed ${
                      log.type === 'danger' ? 'text-rose-300 font-semibold' :
                      log.type === 'success' ? 'text-emerald-300' :
                      log.type === 'warn' ? 'text-amber-300' :
                      'text-slate-300'
                    }`}>
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-900 flex justify-between items-center font-mono">
              <span>SANDBOX CAPABILITY SECURE SHELL v1.5.0</span>
              <span className="text-blue-500">SYSTEM: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
