import React, { useState } from 'react';
import { PageRoute, StartupBrief } from '../types';
import { SAMPLE_BRIEF } from '../data/mockData';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  Zap
} from 'lucide-react';

interface NewPitchPageProps {
  onNavigate: (route: PageRoute) => void;
  onSetBrief: (brief: StartupBrief) => void;
}

export const NewPitchPage: React.FC<NewPitchPageProps> = ({
  onNavigate,
  onSetBrief
}) => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; content: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        const content = event.target?.result as string;
        setSelectedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          content: content || SAMPLE_BRIEF.rawText || ''
        });
        setIsParsing(false);
      }, 600);
    };
    reader.readAsText(file);
  };

  const handleLoadDemo = () => {
    setIsParsing(true);
    setTimeout(() => {
      setSelectedFile({
        name: 'WatchAI-Startup-Brief.txt',
        size: '54.2 KB',
        content: SAMPLE_BRIEF.rawText || ''
      });
      setIsParsing(false);
    }, 400);
  };

  const handleContinue = async () => {
    if (selectedFile) {
      try {
        const { apiClient, parseMoneyAmount, parsePercent } = await import('../services/api');
        await apiClient.createSession({
          business_name: SAMPLE_BRIEF.startupName,
          summary: selectedFile.content,
          industry: 'Retail computer vision',
          target_customers: SAMPLE_BRIEF.targetCustomer,
          revenue_model: SAMPLE_BRIEF.revenueModel,
          traction: SAMPLE_BRIEF.traction,
          funding_ask: parseMoneyAmount(SAMPLE_BRIEF.fundingAsk),
          equity_offered_percent: parsePercent('15%'),
          currency: 'USD',
        });
      } catch (err) {
        console.warn('API Session Creation Fallback', err);
      }
      onSetBrief(SAMPLE_BRIEF);
      onNavigate('brief-review');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 1 OF 3 — STARTUP INTAKE</span>
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Upload Your Startup Brief
        </h2>
        <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto">
          Upload your startup text file (.TXT). PitchRoom AI extracts your problem, TAM, revenue model, and ask before you step into the boardroom.
        </p>
      </div>

      {/* Main Upload Dropzone Panel */}
      <div className="rounded-3xl bg-[#09090B] border border-[#27272A] p-8 shadow-2xl space-y-6">
        {!selectedFile ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer relative overflow-hidden ${
              isDragOver 
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]' 
                : 'border-[#3F3F46] hover:border-emerald-500/50 hover:bg-[#121215]'
            }`}
          >
            <input 
              type="file" 
              accept=".txt" 
              onChange={handleFileSelect} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />

            {isParsing ? (
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                <span className="text-sm font-semibold text-white">Extracting startup entities...</span>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-white">
                    Drop your TXT startup brief here
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    or <span className="text-emerald-400 underline underline-offset-2">click to browse</span> from computer
                  </p>
                </div>

                <span className="text-[11px] text-[#A1A1AA] bg-[#121215] px-3 py-1 rounded-full border border-[#27272A]">
                  Supports .TXT • Maximum file size 10MB
                </span>
              </>
            )}
          </div>
        ) : (
          /* File Selected Success Card */
          <div className="rounded-2xl bg-[#121215] border border-emerald-500/40 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  {selectedFile.name}
                </span>
                <span className="text-xs text-[#A1A1AA] mt-0.5">{selectedFile.size} • Brief parsed successfully</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedFile(null)}
              className="px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-[#E4E4E7] hover:text-white transition-colors"
            >
              Replace File
            </button>
          </div>
        )}

        {/* Quick Demo File Action */}
        {!selectedFile && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#121215] border border-[#27272A]">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white">Don't have a brief handy?</span>
                <span className="text-[11px] text-[#A1A1AA]">Load sample WatchAI (Retail AI) startup brief file</span>
              </div>
            </div>

            <button
              onClick={handleLoadDemo}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition-colors"
            >
              Load Demo Brief
            </button>
          </div>
        )}

        {/* Bottom CTA Action Button */}
        <div className="pt-4 flex items-center justify-between border-t border-[#27272A]">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedFile}
            className={`px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl ${
              selectedFile
                ? 'bg-emerald-500 hover:bg-emerald-400 text-[#000000] shadow-emerald-950/60 cursor-pointer'
                : 'bg-[#27272A] text-[#A1A1AA] cursor-not-allowed opacity-60'
            }`}
          >
            <span>Review Brief Extractions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
