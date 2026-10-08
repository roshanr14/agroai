import React from 'react';
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  GitBranch, 
  ArrowDown, 
  Sparkles, 
  Clock, 
  Layers 
} from 'lucide-react';
import { AgentStepTrace } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  traces: AgentStepTrace[];
  healthScore: number;
}

export const MultiAgentActivityDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  traces,
  healthScore
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-stone-900 border-l border-emerald-900/60 w-full max-w-lg h-full flex flex-col text-stone-200 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm flex items-center gap-2">
                LangGraph Multi-Agent Trace
                <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  State Machine
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Coordinated SENSE → ANALYZE → PREDICT → DECIDE → NOTIFY Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close activity drawer"
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Summary Banner */}
        <div className="p-4 bg-stone-950/50 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center font-bold text-emerald-400 text-sm">
              {healthScore}
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-200">Shared Farm State Converged</div>
              <div className="text-[11px] text-stone-400">All 5 agents evaluated current telemetry</div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
            Latency ~114ms
          </span>
        </div>

        {/* Agent Step Pipeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Sequential Graph Traversal
          </div>

          {traces.map((trace, idx) => (
            <div key={idx} className="relative">
              <div className="bg-stone-800/90 border border-stone-700/80 rounded-xl p-3.5 space-y-2 hover:border-emerald-600/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-stone-100">{trace.agent}</h4>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    <Clock className="w-2.5 h-2.5" />
                    {trace.duration_ms}ms
                  </span>
                </div>

                <div className="text-[11px] font-mono text-stone-400 bg-stone-950/80 px-2 py-1 rounded border border-stone-800">
                  Model: <span className="text-emerald-300">{trace.model}</span>
                </div>

                <div className="text-xs text-stone-300 flex items-start gap-1.5 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{trace.output_summary}</span>
                </div>
              </div>

              {idx < traces.length - 1 && (
                <div className="flex justify-center my-1 text-stone-600">
                  <ArrowDown className="w-4 h-4 text-emerald-700 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            LangGraph Orchestrator v2.4 (Active)
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
