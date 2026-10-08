import React from 'react';
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  GitBranch, 
  ArrowDown, 
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
      <div className="bg-white border-l border-stone-200 w-full max-w-lg h-full flex flex-col text-stone-900 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#f8faf9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#eaf7ef] text-[#279e5a] rounded-2xl">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                LangGraph Multi-Agent Trace
                <span className="text-[10px] bg-[#eaf7ef] text-[#279e5a] px-2.5 py-0.5 rounded-full font-bold">
                  State Machine
                </span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Coordinated SENSE → ANALYZE → PREDICT → DECIDE Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close activity drawer"
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Summary Banner in lush greenery green */}
        <div className="p-5 bg-[#279e5a] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#279e5a] flex items-center justify-center font-bold text-base shadow-sm font-mono">
              {healthScore}
            </div>
            <div>
              <div className="text-xs font-bold text-white">Shared Farm State Converged</div>
              <div className="text-[11px] text-white/80">All 5 agents evaluated current telemetry</div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-white bg-white/20 px-3 py-1 rounded-full font-bold backdrop-blur-md">
            ~114ms Latency
          </span>
        </div>

        {/* Agent Step Pipeline */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#279e5a]" />
            Sequential Graph Execution
          </div>

          {traces.map((trace, idx) => (
            <div key={idx} className="relative">
              <div className="bg-[#f8faf9] border border-stone-200/90 rounded-[24px] p-4 space-y-2 hover:border-[#279e5a] transition-colors shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#eaf7ef] text-[#279e5a] text-[11px] font-mono font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900">{trace.agent}</h4>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-stone-500 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
                    <Clock className="w-2.5 h-2.5 text-stone-400" />
                    {trace.duration_ms}ms
                  </span>
                </div>

                <div className="text-[11px] font-mono text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-stone-200/80">
                  Model: <span className="text-[#279e5a] font-bold">{trace.model}</span>
                </div>

                <div className="text-xs text-stone-700 flex items-start gap-1.5 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#279e5a] shrink-0 mt-0.5" />
                  <span>{trace.output_summary}</span>
                </div>
              </div>

              {idx < traces.length - 1 && (
                <div className="flex justify-center my-1.5 text-stone-400">
                  <ArrowDown className="w-4 h-4 text-[#279e5a] animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with High-Contrast CTA */}
        <div className="p-4 bg-[#f8faf9] border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium">
            <GitBranch className="w-3.5 h-3.5 text-[#279e5a]" />
            LangGraph Orchestrator v2.4 (Active)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#191c21] hover:bg-black text-white font-bold rounded-full transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
