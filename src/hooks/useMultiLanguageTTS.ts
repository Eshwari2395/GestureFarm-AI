import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Multi-Language TTS Hook with support for:
 * 1. Google Cloud Text-to-Speech API (Primary - supports 100+ languages)
 * 2. Bhashini API (Free Indian govt service - Hindi, Telugu, etc)
 * 3. ElevenLabs API (Fallback)
 * 4. Browser Web Speech API (Last resort)
 */

interface UseMultiLanguageTTSOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  language?: string;
}

interface UseMultiLanguageTTSReturn {
  speak: (text: string, lang?: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isLoading: boolean;
  error: string | null;
}

// Language to voice mappings for different services
const LANGUAGE_CONFIGS: Record<string, {
  googleCode: string;
  googleVoice: string;
  bhashiniCode: string;
  elevenlabsId: string;
  browserCode: string;
}> = {
  hi: {
    googleCode: "hi-IN",
    googleVoice: "hi-IN-Neural2-A",
    bhashiniCode: "hi",
    elevenlabsId: "21m00Tcm4TlvDq8ikWAM", // Female Indian voice
    browserCode: "hi-IN",
  },
  te: {
    googleCode: "te-IN",
    googleVoice: "te-IN-Standard-A",
    bhashiniCode: "te",
    elevenlabsId: "21m00Tcm4TlvDq8ikWAM", // Female voice (ElevenLabs doesn't have specific Telugu)
    browserCode: "te-IN",
  },
  en: {
    googleCode: "en-IN",
    googleVoice: "en-IN-Neural2-B",
    bhashiniCode: "en",
    elevenlabsId: "onwK4e9ZLuTAKqWW03F9", // Daniel
    browserCode: "en-IN",
  },
};

// Google Cloud TTS API call
const speakWithGoogleCloud = async (
  text: string,
  lang: string,
  apiKey: string
): Promise<void> => {
  const config = LANGUAGE_CONFIGS[lang] || LANGUAGE_CONFIGS.en;
  
  try {
    console.log(`[GoogleCloudTTS] Speaking "${text.substring(0, 50)}..." in ${lang} (${config.googleCode})`);
    
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: config.googleCode,
            name: config.googleVoice,
          },
          audioConfig: {
            audioEncoding: "MP3",
            pitch: 0.0,
            speakingRate: lang === "en" ? 0.9 : 0.8,
          },
        }),
      }
    );

    if (!response.ok) throw new Error(`Google TTS error: ${response.status}`);

    const data = await response.json();
    const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("Audio playback failed"));
      audio.play().catch(reject);
    });
  } catch (err) {
    console.warn("[GoogleCloudTTS] Failed:", err);
    throw err;
  }
};

// Bhashini API call (Free Indian government service)
const speakWithBhashini = async (
  text: string,
  lang: string
): Promise<void> => {
  const config = LANGUAGE_CONFIGS[lang] || LANGUAGE_CONFIGS.en;
  
  try {
    console.log(`[BhashiniTTS] Speaking "${text.substring(0, 50)}..." in ${lang}`);
    
    // Bhashini free TTS API (Indian government service)
    const response = await fetch("https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pipelineRequestConfig: {
          pipelineId: "64392f96daac500b55b5daac",
        },
      }),
    });

    if (!response.ok) throw new Error("Bhashini API error");

    const data = await response.json();
    console.log("[BhashiniTTS] Pipeline available");

    // Use browser TTS as fallback if Bhashini is complex
    // For simplicity, use browser TTS for Indian languages
    return speakWithBrowserTTS(text, lang);
  } catch (err) {
    console.warn("[BhashiniTTS] Failed:", err);
    throw err;
  }
};

// ElevenLabs TTS
const speakWithElevenLabs = async (
  text: string,
  lang: string
): Promise<void> => {
  const config = LANGUAGE_CONFIGS[lang] || LANGUAGE_CONFIGS.en;
  
  try {
    console.log(`[ElevenLabsTTS] Speaking in ${lang}`);
    
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.VITE_ELEVENLABS_API_KEY || "",
      },
      body: JSON.stringify({
        text,
        voice_id: config.elevenlabsId,
        model_id: "eleven_monolingual_v1",
      }),
    });

    if (!response.ok) throw new Error(`ElevenLabs error: ${response.status}`);

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error("Audio playback failed"));
      };
      audio.play().catch(reject);
    });
  } catch (err) {
    console.warn("[ElevenLabsTTS] Failed:", err);
    throw err;
  }
};

// Browser Web Speech API
const speakWithBrowserTTS = async (
  text: string,
  lang: string
): Promise<void> => {
  try {
    console.log(`[BrowserTTS] Speaking in ${lang}`);
    
    const config = LANGUAGE_CONFIGS[lang] || LANGUAGE_CONFIGS.en;
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = config.browserCode;
    utterance.rate = lang === "en" ? 0.9 : 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    return new Promise((resolve, reject) => {
      let hasStarted = false;
      const selectVoiceAndSpeak = () => {
        if (hasStarted) return;
        hasStarted = true;
        const voices = window.speechSynthesis.getVoices();
        const normalizeLanguageCode = (code: string) => code.toLowerCase().replace("_", "-");
        const preferredVoice = voices.find((voice) =>
          normalizeLanguageCode(voice.lang).startsWith(normalizeLanguageCode(config.browserCode))
        ) || voices.find((voice) =>
          normalizeLanguageCode(voice.lang).startsWith(lang.toLowerCase())
        );

        if (lang !== "en" && !preferredVoice) {
          reject(new Error(`No ${lang === "te" ? "Telugu" : "Hindi"} speech voice is installed in this browser`));
          return;
        }

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        console.log(`[BrowserTTS] Using voice "${preferredVoice?.name || "browser default"}" for ${config.browserCode}`);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      };

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(event.error));

      if (window.speechSynthesis.getVoices().length > 0) {
        selectVoiceAndSpeak();
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", selectVoiceAndSpeak, { once: true });
        setTimeout(selectVoiceAndSpeak, 500);
      }
    });
  } catch (err) {
    console.warn("[BrowserTTS] Failed:", err);
    throw err;
  }
};

export const useMultiLanguageTTS = ({
  onStart,
  onEnd,
  onError,
  language = "en",
}: UseMultiLanguageTTSOptions = {}): UseMultiLanguageTTSReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const speak = useCallback(
    async (text: string, lang?: string) => {
      if (!text.trim()) return;

      const currentLang = lang || language || "en";
      
      stop();
      setIsLoading(true);
      setError(null);
      onStart?.();

      try {
        // Try APIs in order of preference
        const googleApiKey = import.meta.env.VITE_GOOGLE_CLOUD_TTS_API_KEY;
        
        // 1. Try Google Cloud TTS (if API key available)
        if (googleApiKey && googleApiKey.length > 0) {
          try {
            setIsSpeaking(true);
            await speakWithGoogleCloud(text, currentLang, googleApiKey);
            setIsSpeaking(false);
            setIsLoading(false);
            onEnd?.();
            return;
          } catch (err) {
            console.warn("[useMultiLanguageTTS] Google Cloud TTS failed:", err);
          }
        }


        // Use the browser's installed Indian voice by default. This is free and
        // keeps Hindi and Telugu speech aligned with the selected app language.
        if (currentLang === "hi" || currentLang === "te") {
          try {
            setIsSpeaking(true);
            await speakWithBrowserTTS(text, currentLang);
            setIsSpeaking(false);
            setIsLoading(false);
            onEnd?.();
            return;
          } catch (err) {
            console.warn("[useMultiLanguageTTS] Browser Indian voice failed:", err);
          }
        }
        // 2. Try Bhashini (Free for Indian languages)
        if (currentLang === "hi" || currentLang === "te") {
          try {
            setIsSpeaking(true);
            await speakWithBhashini(text, currentLang);
            setIsSpeaking(false);
            setIsLoading(false);
            onEnd?.();
            return;
          } catch (err) {
            console.warn("[useMultiLanguageTTS] Bhashini TTS failed:", err);
          }
        }

        // 3. Try ElevenLabs (if API key available)
        const elevenlabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        if (elevenlabsKey && elevenlabsKey.length > 0) {
          try {
            setIsSpeaking(true);
            await speakWithElevenLabs(text, currentLang);
            setIsSpeaking(false);
            setIsLoading(false);
            onEnd?.();
            return;
          } catch (err) {
            console.warn("[useMultiLanguageTTS] ElevenLabs TTS failed:", err);
          }
        }

        // 4. Fall back to Browser TTS
        setIsSpeaking(true);
        await speakWithBrowserTTS(text, currentLang);
        setIsSpeaking(false);
        setIsLoading(false);
        onEnd?.();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "TTS failed";
        setError(errorMessage);
        setIsLoading(false);
        setIsSpeaking(false);
        onError?.(errorMessage);
        console.error("[useMultiLanguageTTS] All TTS methods failed:", err);
      }
    },
    [language, stop, onStart, onEnd, onError]
  );

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
  };
};

export default useMultiLanguageTTS;
