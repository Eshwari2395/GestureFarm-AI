import { useState, useCallback, useEffect, useRef } from "react";
import { Language, speechLanguageCodes, voiceCommands, translations } from "@/lib/translations";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export type CommandType = "weather" | "crop" | "price" | "alert" | "pest" | "rice" | "cotton" | "maize" | null;

interface UseVoiceRecognitionOptions {
  language: Language;
  onResult?: (transcript: string, command: CommandType) => void;
  onInterimResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onConnecting?: () => void;
  onListening?: () => void;
}

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  isConnecting: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  detectedCommand: CommandType;
}

// Max retry attempts for starting recognition (only for initial start)
const MAX_START_RETRIES = 2;

export const useVoiceRecognition = ({
  language,
  onResult,
  onInterimResult,
  onError,
  onConnecting,
  onListening,
}: UseVoiceRecognitionOptions): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [detectedCommand, setDetectedCommand] = useState<CommandType>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isManualStop = useRef(false);

  // Check browser support
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);
  }, []);

  // Detect command from transcript
  const detectCommand = useCallback(
    (text: string): CommandType => {
      const lowerText = text.toLowerCase();
      const commands = voiceCommands[language];
      const commandOrder: Exclude<CommandType, null>[] = [
        "rice",
        "cotton",
        "maize",
        "weather",
        "crop",
        "price",
        "alert",
        "pest",
      ];

      for (const command of commandOrder) {
        const keywords = commands[command];
        for (const keyword of keywords) {
          if (lowerText.includes(keyword.toLowerCase())) {
            return command;
          }
        }
      }

      return null;
    },
    [language]
  );

  // Request microphone permission explicitly
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("getUserMedia not supported");
        return true; // Let SpeechRecognition handle it
      }

      // Request permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Release the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      console.log("Microphone permission granted");
      return true;
    } catch (err) {
      console.error("Microphone permission denied:", err);
      onError?.(translations[language].voiceMicrophoneDenied);
      return false;
    }
  }, [language, onError]);


  // Store callbacks in refs to avoid recreating recognition on callback changes
  const onResultRef = useRef(onResult);
  const onInterimResultRef = useRef(onInterimResult);
  const onErrorRef = useRef(onError);
  const onListeningRef = useRef(onListening);
  const detectCommandRef = useRef(detectCommand);

  // Update refs when callbacks change
  useEffect(() => {
    onResultRef.current = onResult;
    onInterimResultRef.current = onInterimResult;
    onErrorRef.current = onError;
    onListeningRef.current = onListening;
    detectCommandRef.current = detectCommand;
  }, [onResult, onInterimResult, onError, onListening, detectCommand]);

  // Initialize recognition ONCE - only recreate when language changes
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    // Clean up existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
    }

    const recognition = new SpeechRecognitionAPI();
    // CRITICAL: Use single-shot mode to avoid abort issues
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = speechLanguageCodes[language];

    recognition.onstart = () => {
      console.log("Voice recognition started successfully");
      setIsListening(true);
      setIsConnecting(false);
      setInterimTranscript("");
      isManualStop.current = false;
      onListeningRef.current?.();
    };

    recognition.onend = () => {
      console.log("Voice recognition ended");
      setIsListening(false);
      setIsConnecting(false);
      // No auto-restart - user must press button again for stability
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
        onInterimResultRef.current?.(interim);
      }

      if (finalTranscript) {
        console.log("Final transcript:", finalTranscript);
        setTranscript(finalTranscript);
        setInterimTranscript("");

        const command = detectCommandRef.current(finalTranscript);
        setDetectedCommand(command);
        onResultRef.current?.(finalTranscript, command);
        
        // Stop listening after getting a final result (single-shot mode)
        try {
          recognitionRef.current?.stop();
        } catch (e) {
          // Ignore stop errors
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsConnecting(false);

      // Handle specific errors - no retry logic for stability
      if (event.error === "not-allowed") {
        setIsListening(false);
        onErrorRef.current?.(translations[language].voiceMicrophoneDenied);
      } else if (event.error === "no-speech") {
        // No speech detected - just end quietly
        console.log("No speech detected");
        setIsListening(false);
      } else if (event.error === "aborted") {
        // User stopped or page navigated - this is fine
        console.log("Recognition aborted");
        setIsListening(false);
      } else if (event.error === "network") {
        onErrorRef.current?.(translations[language].voiceNetworkError);
        setIsListening(false);
      } else if (event.error === "audio-capture") {
        onErrorRef.current?.(translations[language].voiceMicrophoneError);
        setIsListening(false);
      } else {
        // Other errors - just stop
        onErrorRef.current?.(translations[language].voiceStartError);
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    console.log(`Voice recognition initialized for language: ${language}`);

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [language]); // Only recreate when language changes - callbacks use refs

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = speechLanguageCodes[language];
    }
  }, [language]);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      onError?.("Speech recognition not supported");
      return;
    }

    // Show connecting state
    setIsConnecting(true);
    onConnecting?.();

    // Request microphone permission first
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setIsConnecting(false);
      return;
    }

    // Reset state
    setTranscript("");
    setInterimTranscript("");
    setDetectedCommand(null);
    isManualStop.current = false;

    // Try to start with simple retry logic
    const attemptStart = async (attempt: number): Promise<void> => {
      try {
        recognitionRef.current?.start();
        console.log(`Started voice recognition (attempt ${attempt + 1})`);
      } catch (error) {
        console.error(`Error starting recognition (attempt ${attempt + 1}):`, error);
        
        // Handle "already started" error
        if (error instanceof Error && error.message.includes("already started")) {
          recognitionRef.current?.stop();
          await new Promise(resolve => setTimeout(resolve, 200));
          if (attempt < MAX_START_RETRIES) {
            return attemptStart(attempt + 1);
          }
        } else if (attempt < MAX_START_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 300));
          return attemptStart(attempt + 1);
        } else {
          setIsConnecting(false);
          onError?.(translations[language].voiceStartError);
        }
      }
    };

    await attemptStart(0);
  }, [isSupported, onError, onConnecting, requestMicrophonePermission]);

  const stopListening = useCallback(() => {
    try {
      isManualStop.current = true;
      recognitionRef.current?.stop();
      setIsConnecting(false);
      console.log("Stopped voice recognition");
    } catch (error) {
      console.error("Error stopping recognition:", error);
    }
  }, []);

  return {
    isListening,
    isConnecting,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    detectedCommand,
  };
};

export default useVoiceRecognition;
