export type SpeechResultHandler = (transcript: string, isFinal: boolean, confidence: number) => void;

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
      confidence: number;
    };
  }>;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognizer({
  lang = 'en-IN',
  onResult,
  onStart,
  onEnd,
  onError,
}: {
  lang?: string;
  onResult: SpeechResultHandler;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    throw new Error('Speech recognition is not supported in this browser.');
  }

  const recognition = new Recognition();
  recognition.lang = lang;
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.onstart = onStart || null;
  recognition.onend = onEnd || null;
  recognition.onerror = (event) => onError?.(event.error || 'Speech recognition failed.');
  recognition.onresult = (event) => {
    let transcript = '';
    let confidence = 0;
    let isFinal = false;

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      transcript += result[0].transcript;
      confidence = result[0].confidence || confidence;
      isFinal = result.isFinal || isFinal;
    }

    onResult(transcript.trim(), isFinal, confidence);
  };

  return recognition;
}

export function speakLocal(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    voiceGender?: 'male' | 'female';
    onEnd?: () => void;
  } = {},
) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;

  const selectVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    const preferredVoice = voices.find((voice) => {
      const name = voice.name.toLowerCase();
      if (options.voiceGender === 'female') {
        return name.includes('female') || name.includes('samantha') || name.includes('zira');
      }
      return name.includes('male') || name.includes('alex') || name.includes('david');
    });
    if (preferredVoice) utterance.voice = preferredVoice;
  };

  selectVoice();
  utterance.onend = () => options.onEnd?.();
  window.speechSynthesis.speak(utterance);
}
