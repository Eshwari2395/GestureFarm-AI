import { useState, useCallback, useEffect, useRef } from "react";

// Import types from our declarations
type MediaPipeHands = InstanceType<typeof window.Hands>;

export type GestureType = "thumbs_up" | "peace" | "fist" | "open_palm" | "pointing" | null;

interface UseGestureDetectionOptions {
  onGesture?: (gesture: GestureType) => void;
  isEnabled?: boolean;
  onOfflineError?: () => void;
}

interface UseGestureDetectionReturn {
  isModelLoading: boolean;
  isModelReady: boolean;
  currentGesture: GestureType;
  error: string | null;
  isOffline: boolean;
  startDetection: (video: HTMLVideoElement) => void;
  stopDetection: () => void;
}

// Wait for MediaPipe scripts to load from CDN
const waitForMediaPipe = async (maxAttempts = 20, intervalMs = 250): Promise<boolean> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (window.Hands) {
      console.log(`MediaPipe Hands available after ${attempt * intervalMs}ms`);
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  console.error("MediaPipe Hands not available after waiting");
  return false;
};

// Gesture classification based on MediaPipe hand landmarks
const classifyGesture = (landmarks: Array<{ x: number; y: number; z: number }>): GestureType => {
  if (!landmarks || landmarks.length < 21) return null;

  // Landmark indices (same as TensorFlow handpose):
  // 0: wrist
  // 4: thumb tip, 3: thumb IP, 2: thumb MCP
  // 8: index tip, 6: index PIP, 5: index MCP
  // 12: middle tip, 10: middle PIP, 9: middle MCP
  // 16: ring tip, 14: ring PIP, 13: ring MCP
  // 20: pinky tip, 18: pinky PIP, 17: pinky MCP

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbIP = landmarks[3];
  const indexTip = landmarks[8];
  const indexPIP = landmarks[6];
  const indexMCP = landmarks[5];
  const middleTip = landmarks[12];
  const middlePIP = landmarks[10];
  const ringTip = landmarks[16];
  const ringPIP = landmarks[14];
  const pinkyTip = landmarks[20];
  const pinkyPIP = landmarks[18];

  // Check if finger is extended (tip is above PIP joint in Y - note Y is inverted)
  const isFingerExtended = (tip: typeof wrist, pip: typeof wrist): boolean => {
    return tip.y < pip.y;
  };

  // Check thumb extension (horizontal distance matters more)
  const isThumbExtended = (): boolean => {
    return Math.abs(thumbTip.x - thumbIP.x) > 0.05 || thumbTip.y < thumbIP.y;
  };

  // Check if thumb is pointing up
  const isThumbUp = (): boolean => {
    return thumbTip.y < thumbIP.y && thumbTip.y < indexMCP.y;
  };

  const indexExtended = isFingerExtended(indexTip, indexPIP);
  const middleExtended = isFingerExtended(middleTip, middlePIP);
  const ringExtended = isFingerExtended(ringTip, ringPIP);
  const pinkyExtended = isFingerExtended(pinkyTip, pinkyPIP);
  const thumbExtended = isThumbExtended();

  // Pointing: only index finger extended (1 finger = weather)
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return "pointing";
  }

  // Thumbs up: thumb pointing up, all other fingers closed (pest control)
  if (isThumbUp() && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "thumbs_up";
  }

  // Peace sign: index and middle extended, others closed (crop tips)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    return "peace";
  }

  // Fist: all fingers closed (market prices)
  if (!thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "fist";
  }

  // Open palm: all fingers extended (crop growth help)
  if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return "open_palm";
  }

  return null;
};

export const useGestureDetection = ({
  onGesture,
  isEnabled = true,
  onOfflineError,
}: UseGestureDetectionOptions = {}): UseGestureDetectionReturn => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureType>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const handsRef = useRef<MediaPipeHands | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastGestureRef = useRef<GestureType>(null);
  const gestureCountRef = useRef(0);
  const onGestureRef = useRef(onGesture);
  const isInitializingRef = useRef(false);
  const isProcessingRef = useRef(false); // Prevent overlapping frame processing
  const lastProcessTimeRef = useRef(0); // For throttling frame rate
  
  // Suppress repeats of the same held pose, but allow a different stable pose immediately.
  const lastTriggeredGestureRef = useRef<GestureType>(null);
  const REQUIRED_STABLE_FRAMES = 5; // Require 5 consistent frames
  const NO_HAND_RESET_FRAMES = 10; // Require 10 frames of no hand before accepting new gesture
  const FRAME_THROTTLE_MS = 150; // Process max ~6-7 frames per second to prevent memory issues

  // Track frames without hand detection
  const noHandFramesRef = useRef(0);

  onGestureRef.current = onGesture;

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Initialize MediaPipe Hands
  const initializeHands = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (isInitializingRef.current) {
      console.log("Already initializing MediaPipe Hands...");
      return false;
    }

    // Check if offline before trying to load model
    if (!navigator.onLine) {
      setIsOffline(true);
      setError("offline");
      onOfflineError?.();
      console.warn("Cannot load gesture model: device is offline");
      return false;
    }

    isInitializingRef.current = true;
    setIsModelLoading(true);
    setError(null);

    try {
      console.log("Waiting for MediaPipe Hands to load...");
      
      // Wait for MediaPipe scripts to load from CDN
      const isAvailable = await waitForMediaPipe();
      
      if (!isAvailable) {
        throw new Error("MediaPipe Hands not loaded. Please refresh the page.");
      }

      console.log("Initializing MediaPipe Hands model...");

      const hands = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          // Reset no-hand counter since we see a hand
          noHandFramesRef.current = 0;
          
          const landmarks = results.multiHandLandmarks[0];
          const gesture = classifyGesture(landmarks);

          // Require gesture to be stable for multiple frames
          if (gesture === lastGestureRef.current && gesture !== null) {
            gestureCountRef.current++;
          } else {
            gestureCountRef.current = gesture ? 1 : 0;
            lastGestureRef.current = gesture;
          }

          // Only trigger after REQUIRED_STABLE_FRAMES consistent frames.
          if (gestureCountRef.current >= REQUIRED_STABLE_FRAMES && gesture !== null) {
            setCurrentGesture(gesture);
            
            // Fire once per pose; switching poses does not require removing the hand.
            if (gesture !== lastTriggeredGestureRef.current) {
              console.log(`Gesture detected: ${gesture} - triggering callback (${gestureCountRef.current} frames)`);
              lastTriggeredGestureRef.current = gesture;
              onGestureRef.current?.(gesture);
              
              // Reset gesture state after triggering
              gestureCountRef.current = 0;
            } else {
              console.log(`Gesture ${gesture} ignored - pose already handled`);
            }
          }
        } else {
          // No hand detected - increment counter
          noHandFramesRef.current++;
          
          // Only reset after enough frames without hand (debounce)
          if (noHandFramesRef.current >= NO_HAND_RESET_FRAMES) {
            setCurrentGesture(null);
            lastGestureRef.current = null;
            gestureCountRef.current = 0;
            lastTriggeredGestureRef.current = null;
          }
        }
      });

      handsRef.current = hands;
      setIsModelReady(true);
      console.log("MediaPipe Hands model loaded successfully!");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load model";

      // Check if it's a network error
      if (!navigator.onLine || errorMessage.includes("fetch") || errorMessage.includes("network")) {
        setError("offline");
        setIsOffline(true);
        onOfflineError?.();
        console.log("Gesture detection unavailable offline");
      } else {
        setError(errorMessage);
      }
      console.error("Model loading error:", err);
      return false;
    } finally {
      setIsModelLoading(false);
      isInitializingRef.current = false;
    }
  }, [onOfflineError]);

  // Process video frames with throttling to prevent memory issues
  const processFrame = useCallback(async () => {
    if (!handsRef.current || !videoRef.current || !isEnabled) return;

    const now = Date.now();
    
    // Throttle to prevent memory overflow
    if (now - lastProcessTimeRef.current < FRAME_THROTTLE_MS) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    
    // Prevent overlapping processing
    if (isProcessingRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    isProcessingRef.current = true;
    lastProcessTimeRef.current = now;

    try {
      await handsRef.current.send({ image: videoRef.current });
    } catch (err) {
      // Silently handle errors - don't spam console
      console.warn("Frame skipped due to processing error");
    } finally {
      isProcessingRef.current = false;
    }

    // Continue processing
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [isEnabled]);

  // Start detection
  const startDetection = useCallback(
    async (video: HTMLVideoElement) => {
      videoRef.current = video;

      // Initialize if not ready
      if (!handsRef.current) {
        const success = await initializeHands();
        if (!success) return;
      }

      // Start processing frames
      processFrame();
    },
    [initializeHands, processFrame]
  );

  // Stop detection
  const stopDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
      if (handsRef.current) {
        handsRef.current.close();
        handsRef.current = null;
      }
    };
  }, [stopDetection]);

  return {
    isModelLoading,
    isModelReady,
    currentGesture,
    error,
    isOffline,
    startDetection,
    stopDetection,
  };
};

export default useGestureDetection;
