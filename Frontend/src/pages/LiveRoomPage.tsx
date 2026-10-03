import React, { useEffect, useRef, useState } from 'react';
import { AIJudge, PageRoute, PitchPhase, Question, SessionRead, StartupBrief, TranscriptItem } from '../types';
import { INITIAL_JUDGES } from '../data/mockData';
import { InvestorRoom } from '../components/boardroom/InvestorRoom';
import { LiveCaption } from '../components/boardroom/LiveCaption';
import { VoiceControlDock } from '../components/boardroom/VoiceControlDock';
import { PhaseProgress } from '../components/boardroom/PhaseProgress';
import { TranscriptDrawer } from '../components/boardroom/TranscriptDrawer';
import { apiClient, parseMoneyAmount, parsePercent } from '../services/api';
import { createSpeechRecognizer, isSpeechRecognitionSupported, speakLocal } from '../services/speech';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface LiveRoomPageProps {
  brief: StartupBrief;
  onNavigate: (route: PageRoute) => void;
  onCompleteSession: () => void;
}

const fallbackQuestions = [
  {
    judgeId: 'market-1',
    phase: 'Pitch' as PitchPhase,
    text: 'What specific portion of your target market is reachable in the next 18 months, and what evidence proves customers are already seeking this solution?',
  },
  {
    judgeId: 'product-1',
    phase: 'Discovery' as PitchPhase,
    text: 'What is the hardest technical risk in your product, and what have you already validated through a prototype or pilot?',
  },
  {
    judgeId: 'finance-1',
    phase: 'Cross Exam' as PitchPhase,
    text: 'Walk me through your customer acquisition cost, payback period, gross margin, and how much runway this funding ask gives you.',
  },
  {
    judgeId: 'growth-1',
    phase: 'Cross Exam' as PitchPhase,
    text: 'Which go-to-market channel can scale first, and why will it keep working after the early adopter segment is exhausted?',
  },
  {
    judgeId: 'operations-1',
    phase: 'Pressure' as PitchPhase,
    text: 'What breaks operationally if demand triples in 90 days, and what is your plan to handle that pressure?',
  },
  {
    judgeId: 'risk-1',
    phase: 'Final' as PitchPhase,
    text: 'If a well-funded competitor copies your core idea tomorrow, what still makes your company defensible?',
  },
];

function buildPitchPayload(brief: StartupBrief) {
  const summary = brief.rawText || [
    brief.problem,
    brief.solution,
    brief.marketSize,
    brief.businessModel,
    brief.traction,
    brief.competitiveAdvantage,
    brief.team,
    brief.fundingAsk,
  ].filter(Boolean).join('\n\n');

  return {
    business_name: brief.startupName || 'Untitled startup',
    summary: summary || 'Founder is preparing a new startup pitch for AI investor practice.',
    industry: brief.marketSize ? 'Startup / venture-backed business' : null,
    target_customers: brief.targetCustomer || null,
    revenue_model: brief.revenueModel || brief.businessModel || brief.pricing || null,
    traction: brief.traction || null,
    funding_ask: parseMoneyAmount(brief.fundingAsk) || null,
    equity_offered_percent: parsePercent(brief.fundingAsk) || null,
    currency: 'USD',
  };
}

function phaseForRound(roundNumber: number): PitchPhase {
  if (roundNumber <= 1) return 'Pitch';
  if (roundNumber === 2) return 'Discovery';
  if (roundNumber === 3) return 'Cross Exam';
  if (roundNumber === 4) return 'Pressure';
  return 'Final';
}

function judgeIdForAgent(agentId: string): string {
  const mapping: Record<string, string> = {
    market: 'market-1',
    market_research: 'risk-1',
    product: 'product-1',
    technical: 'operations-1',
    finance: 'finance-1',
    strategy: 'growth-1',
  };
  return mapping[agentId] || 'market-1';
}

function pendingQuestions(session: SessionRead): Question[] {
  return session.questions.filter(
    (question) => question.round_number === session.current_round && !question.answer,
  );
}

export const LiveRoomPage: React.FC<LiveRoomPageProps> = ({
  brief,
  onNavigate,
  onCompleteSession,
}) => {
  const [judges, setJudges] = useState<AIJudge[]>(INITIAL_JUDGES);
  const [activeJudgeId, setActiveJudgeId] = useState<string | null>('market-1');
  const [currentPhase, setCurrentPhase] = useState<PitchPhase>('Pitch');
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'panel' | 'speaker'>('panel');
  const [showEndModal, setShowEndModal] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('Connecting to backend...');
  const [isApiMode, setIsApiMode] = useState(true);
  const [backendSession, setBackendSession] = useState<SessionRead | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const [currentCaption, setCurrentCaption] = useState<{
    speakerName: string;
    speakerRole?: string;
    text: string;
    isFounder: boolean;
  }>({
    speakerName: 'PitchRoom AI',
    speakerRole: 'BOARDROOM',
    text: `Preparing the AI investor panel for ${brief.startupName || 'your startup'}...`,
    isFounder: false,
  });

  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const fallbackQuestionIndexRef = useRef(-1);
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);
  const finalSpeechSubmittedRef = useRef(false);

  const formatElapsedTime = `${Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:${(secondsElapsed % 60).toString().padStart(2, '0')}`;
  const activeSpeakingJudge = judges.find((judge) => judge.id === activeJudgeId) || judges[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      recognizerRef.current?.abort();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const addTranscriptItem = (item: Omit<TranscriptItem, 'id' | 'timestamp'>) => {
    setTranscript((prev) => [
      ...prev,
      {
        ...item,
        id: `t_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        timestamp: formatElapsedTime,
      },
    ]);
  };

  const speakText = (text: string, judge: AIJudge) => {
    if (isAudioMuted) return;
    setJudges((prev) => prev.map((item) => (
      item.id === judge.id ? { ...item, state: 'SPEAKING' } : { ...item, state: 'LISTENING' }
    )));
    speakLocal(text, {
      rate: judge.voiceRate,
      pitch: judge.voicePitch,
      voiceGender: judge.voiceGender,
      onEnd: () => {
        setJudges((prev) => prev.map((item) => (
          item.id === judge.id ? { ...item, state: 'LISTENING' } : item
        )));
      },
    });
  };

  const presentQuestion = (question: Question) => {
    const judgeId = judgeIdForAgent(question.agent_id);
    const targetJudge = judges.find((judge) => judge.id === judgeId) || judges[0];
    const phase = phaseForRound(question.round_number);
    const speechText = question.speech_text || question.text;

    setCurrentQuestion(question);
    setActiveJudgeId(targetJudge.id);
    setCurrentPhase(phase);
    setCurrentCaption({
      speakerName: question.agent_name || targetJudge.name,
      speakerRole: targetJudge.shortRole.toUpperCase(),
      text: question.text,
      isFounder: false,
    });
    addTranscriptItem({
      speakerId: targetJudge.id,
      speakerName: question.agent_name || targetJudge.name,
      speakerRole: targetJudge.role,
      text: question.text,
      phase,
    });
    setSpeechStatus('Answer with the microphone or quick reply.');
    speakText(speechText, targetJudge);
  };

  const startFallbackRound = () => {
    setIsApiMode(false);
    fallbackQuestionIndexRef.current = -1;
    setSpeechStatus('Backend unavailable. Running local speech demo.');
    handleNextMockQuestion();
  };

  const ensureBackendQuestion = async (initialSession: SessionRead) => {
    let session = initialSession;
    if (session.status === 'ready_for_round') {
      setIsBusy(true);
      setSpeechStatus('AI agents are preparing questions...');
      session = await apiClient.nextRound(session);
    }

    setBackendSession(session);

    if (session.status === 'ready_for_evaluation') {
      setSpeechStatus('All rounds are complete. End the pitch to generate your report.');
      setShowEndModal(true);
      return;
    }

    const nextQuestion = pendingQuestions(session)[0];
    if (nextQuestion) {
      presentQuestion(nextQuestion);
    } else {
      setSpeechStatus('Waiting for the next AI question...');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeBackendSession = async () => {
      try {
        setIsBusy(true);
        setSpeechStatus('Creating AI investor session...');
        let session: SessionRead | null = null;
        const latestSessionId = apiClient.getLatestSessionId();

        if (latestSessionId && apiClient.getSessionToken(latestSessionId)) {
          try {
            const latest = await apiClient.getSession(latestSessionId);
            if (latest.status !== 'completed' && latest.pitch.business_name === (brief.startupName || 'Untitled startup')) {
              session = latest;
            }
          } catch {
            session = null;
          }
        }

        if (!session) {
          session = await apiClient.createSession(buildPitchPayload(brief));
        }

        if (!isMounted) return;
        setIsApiMode(true);
        await ensureBackendQuestion(session);
      } catch (error) {
        console.warn('Backend pitch room unavailable; using local speech demo.', error);
        if (isMounted) startFallbackRound();
      } finally {
        if (isMounted) setIsBusy(false);
      }
    };

    initializeBackendSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNextMockQuestion = () => {
    if (fallbackQuestionIndexRef.current >= fallbackQuestions.length - 1) {
      setShowEndModal(true);
      return;
    }

    fallbackQuestionIndexRef.current += 1;
    const nextQuestion = fallbackQuestions[fallbackQuestionIndexRef.current];
    const targetJudge = judges.find((judge) => judge.id === nextQuestion.judgeId) || judges[0];

    setCurrentQuestion(null);
    setActiveJudgeId(targetJudge.id);
    setCurrentPhase(nextQuestion.phase);
    setCurrentCaption({
      speakerName: targetJudge.name,
      speakerRole: targetJudge.shortRole.toUpperCase(),
      text: nextQuestion.text,
      isFounder: false,
    });
    addTranscriptItem({
      speakerId: targetJudge.id,
      speakerName: targetJudge.name,
      speakerRole: targetJudge.role,
      text: nextQuestion.text,
      phase: nextQuestion.phase,
    });
    speakText(nextQuestion.text, targetJudge);
  };

  const submitFounderAnswer = async (answerText: string) => {
    const cleanAnswer = answerText.trim();
    if (!cleanAnswer || isBusy) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setCurrentCaption({
      speakerName: 'Founder',
      text: cleanAnswer,
      isFounder: true,
    });
    addTranscriptItem({
      speakerId: 'founder',
      speakerName: 'Founder',
      text: cleanAnswer,
      phase: currentPhase,
    });

    if (!isApiMode || !backendSession || !currentQuestion) {
      window.setTimeout(handleNextMockQuestion, 900);
      return;
    }

    try {
      setIsBusy(true);
      setSpeechStatus('Submitting answer to the AI panel...');
      setJudges((prev) => prev.map((judge) => ({ ...judge, state: 'ANALYZING' })));
      let updatedSession = await apiClient.submitAnswers(backendSession, [
        {
          question_id: currentQuestion.id,
          text: cleanAnswer,
        },
      ]);
      setBackendSession(updatedSession);

      let nextQuestion = pendingQuestions(updatedSession)[0];
      if (!nextQuestion && updatedSession.status === 'ready_for_round') {
        setCurrentCaption({
          speakerName: 'PitchRoom AI',
          speakerRole: 'ORCHESTRATOR',
          text: 'The agents are sharing context and preparing the next round...',
          isFounder: false,
        });
        setSpeechStatus('Generating next round...');
        updatedSession = await apiClient.nextRound(updatedSession);
        setBackendSession(updatedSession);
        nextQuestion = pendingQuestions(updatedSession)[0];
      }

      if (nextQuestion) {
        presentQuestion(nextQuestion);
      } else if (updatedSession.status === 'ready_for_evaluation') {
        setCurrentQuestion(null);
        setSpeechStatus('The panel is ready to generate the final analysis.');
        setShowEndModal(true);
      }
    } catch (error) {
      console.warn('Could not submit answer to backend; continuing with local demo.', error);
      setIsApiMode(false);
      setSpeechStatus('Backend submission failed. Continuing locally.');
      window.setTimeout(handleNextMockQuestion, 900);
    } finally {
      setIsBusy(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isRecognizing) {
      recognizerRef.current?.stop();
      setIsRecognizing(false);
      setSpeechStatus('Speech recognition stopped.');
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setSpeechStatus('Speech recognition is not supported in this browser.');
      return;
    }

    finalSpeechSubmittedRef.current = false;
    try {
      recognizerRef.current = createSpeechRecognizer({
        lang: 'en-IN',
        onStart: () => {
          setIsRecognizing(true);
          setSpeechStatus('Listening...');
        },
        onEnd: () => {
          setIsRecognizing(false);
          if (!finalSpeechSubmittedRef.current) setSpeechStatus('Speech recognition ended.');
        },
        onError: (message) => {
          setIsRecognizing(false);
          setSpeechStatus(message);
        },
        onResult: (transcriptText, isFinal) => {
          if (!transcriptText) return;
          setCurrentCaption({
            speakerName: 'Founder',
            text: transcriptText,
            isFounder: true,
          });
          if (isFinal && !finalSpeechSubmittedRef.current) {
            finalSpeechSubmittedRef.current = true;
            void submitFounderAnswer(transcriptText);
          }
        },
      });
      recognizerRef.current.start();
    } catch (error) {
      setSpeechStatus(error instanceof Error ? error.message : 'Speech recognition failed.');
    }
  };

  const handleEndAndEvaluate = async () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (isApiMode && backendSession?.status === 'ready_for_evaluation') {
      try {
        setIsBusy(true);
        setSpeechStatus('Generating final AI panel analysis...');
        const evaluated = await apiClient.evaluateSession(backendSession);
        setBackendSession(evaluated);
        if (evaluated.evaluation?.speech_text) {
          speakText(evaluated.evaluation.speech_text, activeSpeakingJudge);
        }
      } catch (error) {
        console.warn('Could not generate backend evaluation before navigation.', error);
      } finally {
        setIsBusy(false);
      }
    }
    onCompleteSession();
    onNavigate('evaluation-processing');
  };

  return (
    <div className="relative w-full h-screen bg-[#000000] flex flex-col overflow-hidden select-none">
      <PhaseProgress
        currentPhase={currentPhase}
        elapsedTime={formatElapsedTime}
      />

      <div className="flex-1 relative">
        <InvestorRoom
          judges={judges}
          activeJudgeId={activeJudgeId}
          onSelectJudge={(id) => setActiveJudgeId(id)}
          viewMode={viewMode}
        />

        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
          <div className="rounded-full bg-[#0D0D0D]/90 border border-[#27272A] px-4 py-2 text-[11px] text-[#A1A1AA] font-semibold flex items-center gap-2">
            {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
            <span>{speechStatus}</span>
          </div>
        </div>

        <div className="absolute bottom-24 inset-x-4 flex flex-col items-center gap-3">
          <LiveCaption
            speakerName={currentCaption.speakerName}
            speakerRole={currentCaption.speakerRole}
            text={currentCaption.text}
            isFounder={currentCaption.isFounder}
          />

          <div className="flex flex-wrap items-center justify-center gap-2 bg-[#000000]/90 p-2 rounded-2xl border border-[#27272A] backdrop-blur-md shadow-xl">
            <span className="text-[10px] text-[#A1A1AA] font-bold px-2 uppercase">Respond:</span>
            <button
              onClick={() => submitFounderAnswer('The strongest proof is our early customer traction, repeat usage, and willingness to pay. I can break down the numbers by segment.')}
              disabled={isBusy}
              className="px-3 py-1 rounded-xl bg-[#09090B] hover:bg-emerald-500/20 text-[11px] font-semibold text-white border border-[#27272A] hover:border-emerald-500/40 transition-colors disabled:opacity-50"
            >
              "Use traction proof"
            </button>
            <button
              onClick={() => submitFounderAnswer('Our moat comes from faster execution, domain data, customer workflow integration, and a focused product that incumbents are not prioritizing.')}
              disabled={isBusy}
              className="px-3 py-1 rounded-xl bg-[#09090B] hover:bg-emerald-500/20 text-[11px] font-semibold text-white border border-[#27272A] hover:border-emerald-500/40 transition-colors disabled:opacity-50"
            >
              "Explain moat"
            </button>
            <button
              onClick={() => submitFounderAnswer('The funding will primarily extend runway for product validation, go-to-market hiring, and measurable customer acquisition experiments.')}
              disabled={isBusy}
              className="px-3 py-1 rounded-xl bg-[#09090B] hover:bg-emerald-500/20 text-[11px] font-semibold text-white border border-[#27272A] hover:border-emerald-500/40 transition-colors disabled:opacity-50"
            >
              "Clarify ask"
            </button>
            {!isApiMode && (
              <button
                onClick={handleNextMockQuestion}
                className="px-3 py-1 rounded-xl bg-emerald-500 text-[#000000] font-bold text-[11px] transition-colors shadow-md shadow-emerald-950/40"
              >
                Next mock question →
              </button>
            )}
          </div>
        </div>
      </div>

      <VoiceControlDock
        isMicMuted={!isRecognizing}
        onToggleMic={toggleSpeechRecognition}
        isAudioMuted={isAudioMuted}
        onToggleAudio={() => {
          setIsAudioMuted(!isAudioMuted);
          if (!isAudioMuted && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
        }}
        onToggleTranscript={() => setIsTranscriptOpen(!isTranscriptOpen)}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'panel' ? 'speaker' : 'panel')}
        onEndSession={() => setShowEndModal(true)}
        speechStatus={isRecognizing ? 'Listening' : isApiMode ? 'Backend linked' : 'Local demo'}
      />

      <TranscriptDrawer
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        transcript={transcript}
      />

      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl bg-[#09090B] border border-[#27272A] p-6 max-w-md w-full space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-3 text-emerald-400">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h3 className="font-heading font-extrabold text-lg text-white">End Boardroom Pitch?</h3>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              The 6 AI investor partners will compile your conversation, perform contradiction checks, score your category performance, and generate your evidence-backed pitch report.
            </p>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 rounded-xl bg-[#121215] hover:bg-[#27272A] text-xs font-semibold text-white transition-colors"
              >
                Continue Pitching
              </button>

              <button
                onClick={handleEndAndEvaluate}
                disabled={isBusy}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#000000] font-bold text-xs transition-colors shadow-lg shadow-emerald-950/50 disabled:opacity-60"
              >
                End & Evaluate Pitch →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
