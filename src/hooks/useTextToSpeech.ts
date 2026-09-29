import { useState, useCallback, useRef, useEffect } from "react";

const SUPABASE_URL = "https://miyriwxinkjvxzzgewrk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1peXJpd3hpbmtqdnh6emdld3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MzI5MDIsImV4cCI6MjA4NTQwODkwMn0.n_01BJe-vDy3u0Rx6-hNLg4l3THLXO_UeiMSS3mD99U";

// ElevenLabs timeout - only used as fallback for premium voice
const ELEVENLABS_TIMEOUT = 3000;

interface UseTextToSpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  language?: string;
  preferElevenLabs?: boolean; // Set to true to try ElevenLabs first
}

interface UseTextToSpeechReturn {
  speak: (text: string, lang?: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isLoading: boolean;
  error: string | null;
  voicesLoaded: boolean;
}

// Store loaded voices
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoadedPromise: Promise<SpeechSynthesisVoice[]> | null = null;

// Wait for voices to load
const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  if (voicesLoadedPromise) {
    return voicesLoadedPromise;
  }

  voicesLoadedPromise = new Promise((resolve) => {
    const voices = window.speechSynthesis?.getVoices();
    
    if (voices && voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    // Wait for voiceschanged event
    if (window.speechSynthesis) {
      const handleVoicesChanged = () => {
        const newVoices = window.speechSynthesis.getVoices();
        if (newVoices.length > 0) {
          cachedVoices = newVoices;
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
          resolve(newVoices);
        }
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      // Timeout fallback after 2 seconds
      setTimeout(() => {
        const fallbackVoices = window.speechSynthesis?.getVoices() || [];
        cachedVoices = fallbackVoices;
        resolve(fallbackVoices);
      }, 2000);
    } else {
      resolve([]);
    }
  });

  return voicesLoadedPromise;
};

// Browser TTS voice selection by language - prioritize Indian voices
const getBrowserVoice = (lang: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  // Language code mapping - prefer Indian voices
  const langCodes: Record<string, string[]> = {
    hi: ["hi-IN", "hi"],
    te: ["te-IN", "te"],
    en: ["en-IN", "en-US", "en-GB", "en"],
  };

  const codes = langCodes[lang] || langCodes.en;
  
  console.log(`[Voice Selection] Looking for voice for language: ${lang}, codes: ${codes.join(", ")}`);
  
  // First, try to find exact matches
  for (const code of codes) {
    const voice = voices.find(v => v.lang === code);
    if (voice) {
      console.log(`[Voice Selection] ✓ Found exact match: ${voice.name} (${voice.lang})`);
      return voice;
    }
  }
  
  // Then try partial matches (e.g., "hi" matches "hi-IN")
  for (const code of codes) {
    const prefix = code.split('-')[0];
    const voice = voices.find(v => v.lang.startsWith(prefix));
    if (voice) {
      console.log(`[Voice Selection] ✓ Found partial match: ${voice.name} (${voice.lang}) for code ${code}`);
      return voice;
    }
  }
  
  // Fallback: if language is not English but no voice found, warn and use default
  if (lang !== "en") {
    console.warn(`[Voice Selection] ⚠️  No voice found for ${lang}, falling back to default voice`);
  }
  
  // Return first available voice as fallback
  const fallbackVoice = voices[0] || null;
  if (fallbackVoice) {
    console.log(`[Voice Selection] Fallback voice: ${fallbackVoice.name} (${fallbackVoice.lang})`);
  }
  return fallbackVoice;
};

// Browser TTS - primary method for reliability
const speakWithBrowser = async (
  text: string, 
  lang: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: string) => void
): Promise<SpeechSynthesisUtterance> => {
  // Wait for voices to load
  const voices = await loadVoices();
  
  console.log(`[speakWithBrowser] Starting speech with lang="${lang}", available voices: ${voices.length}`);
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language
  const langMap: Record<string, string> = {
    hi: "hi-IN",
    te: "te-IN",
    en: "en-IN",
  };
  utterance.lang = langMap[lang] || "en-IN";
  console.log(`[speakWithBrowser] Set utterance.lang to "${utterance.lang}"`);
  
  // Set appropriate voice
  const voice = getBrowserVoice(lang, voices);
  if (voice) {
    utterance.voice = voice;
    console.log(`[speakWithBrowser] ✓ Using voice: "${voice.name}" (lang: ${voice.lang})`);
  } else {
    console.warn(`[speakWithBrowser] ⚠️  No suitable voice found, using browser default`);
  }
  
  // Adjust rate based on language - slower for regional languages
  utterance.rate = lang === "en" ? 0.9 : 0.8;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  utterance.onstart = () => {
    console.log(`[speakWithBrowser] Speech started for language: ${lang}`);
    onStart?.();
  };
  utterance.onend = () => {
    console.log(`[speakWithBrowser] Speech ended`);
    onEnd?.();
  };
  utterance.onerror = (event) => {
    console.error("[speakWithBrowser] Speech error:", event.error);
    onError?.(event.error);
  };
  
  // Cancel any previous speech
  window.speechSynthesis.cancel();
  
  // Small delay to ensure cancel completes
  await new Promise(resolve => setTimeout(resolve, 50));
  
  console.log(`[speakWithBrowser] Calling window.speechSynthesis.speak()`);
  window.speechSynthesis.speak(utterance);
  
  return utterance;
};

// Fetch with timeout helper
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const useTextToSpeech = ({
  onStart,
  onEnd,
  onError,
  language = "en",
  preferElevenLabs = false, // Default to browser TTS for reliability
}: UseTextToSpeechOptions = {}): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pre-load browser voices on mount
  useEffect(() => {
    loadVoices().then((voices) => {
      setVoicesLoaded(voices.length > 0);
      console.log(`TTS: Loaded ${voices.length} browser voices`);
      
      // Log available voices for debugging
      if (voices.length > 0) {
        const hiVoices = voices.filter(v => v.lang.startsWith('hi'));
        const teVoices = voices.filter(v => v.lang.startsWith('te'));
        console.log(`TTS: Hindi voices: ${hiVoices.length}, Telugu voices: ${teVoices.length}`);
      }
    });
  }, []);

  const stop = useCallback(() => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    
    // Stop browser TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const speak = useCallback(
    async (text: string, lang?: string) => {
      if (!text.trim()) return;

      // Prefer explicitly passed language parameter over hook initialization language
      const currentLang = lang || language || "en";
      
      console.log(`TTS: Speaking with language="${currentLang}" (provided lang="${lang}"), text preview="${text.substring(0, 50)}..."`);

      // Stop any current playback
      stop();

      setIsLoading(true);
      setError(null);

      // PRIMARY: Use browser TTS for reliability (works offline, faster)
      if (window.speechSynthesis && !preferElevenLabs) {
        try {
          console.log("TTS: Using browser speechSynthesis (primary)");
          setIsLoading(false);
          setIsSpeaking(true);
          onStart?.();
          
          utteranceRef.current = await speakWithBrowser(
            text,
            currentLang,
            undefined,
            () => {
              setIsSpeaking(false);
              utteranceRef.current = null;
              onEnd?.();
            },
            (browserError) => {
              setIsSpeaking(false);
              setError(browserError);
              utteranceRef.current = null;
              onError?.(browserError);
            }
          );
          return;
        } catch (browserErr) {
          console.warn("Browser TTS failed, trying ElevenLabs:", browserErr);
        }
      }

      // FALLBACK: Try ElevenLabs if browser TTS failed or preferElevenLabs is true
      try {
        console.log("TTS: Trying ElevenLabs API");
        const response = await fetchWithTimeout(
          `${SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ 
              text,
              voiceId: "onwK4e9ZLuTAKqWW03F9" // Daniel - natural voice
            }),
          },
          ELEVENLABS_TIMEOUT
        );

        if (!response.ok) {
          throw new Error(`TTS request failed: ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setIsLoading(false);
          onStart?.();
        };

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          onEnd?.();
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          setIsLoading(false);
          setError("Audio playback failed");
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          onError?.("Audio playback failed");
        };

        await audio.play();
      } catch (err) {
        console.warn("ElevenLabs TTS failed:", err);
        
        // Last resort fallback to browser TTS
        if (window.speechSynthesis) {
          try {
            setIsLoading(false);
            setIsSpeaking(true);
            onStart?.();
            
            utteranceRef.current = await speakWithBrowser(
              text,
              currentLang,
              undefined,
              () => {
                setIsSpeaking(false);
                utteranceRef.current = null;
                onEnd?.();
              },
              (browserError) => {
                setIsSpeaking(false);
                setError(browserError);
                utteranceRef.current = null;
                onError?.(browserError);
              }
            );
          } catch (browserErr) {
            const errorMessage = browserErr instanceof Error ? browserErr.message : "Browser TTS failed";
            setError(errorMessage);
            setIsLoading(false);
            setIsSpeaking(false);
            onError?.(errorMessage);
          }
        } else {
          const errorMessage = err instanceof Error ? err.message : "TTS not available";
          setError(errorMessage);
          setIsLoading(false);
          setIsSpeaking(false);
          onError?.(errorMessage);
        }
      }
    },
    [stop, onStart, onEnd, onError, language, preferElevenLabs]
  );

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
    voicesLoaded,
  };
};

export default useTextToSpeech;
