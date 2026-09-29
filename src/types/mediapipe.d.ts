// MediaPipe Hands TypeScript declarations
// These are loaded via CDN in index.html

interface MediaPipeLandmark {
  x: number;
  y: number;
  z: number;
}

interface MediaPipeHandsResults {
  multiHandLandmarks: MediaPipeLandmark[][];
  multiHandedness: Array<{
    label: string;
    score: number;
  }>;
}

interface MediaPipeHandsOptions {
  maxNumHands?: number;
  modelComplexity?: number;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

interface MediaPipeHands {
  setOptions(options: MediaPipeHandsOptions): void;
  onResults(callback: (results: MediaPipeHandsResults) => void): void;
  send(input: { image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement }): Promise<void>;
  close(): void;
}

interface MediaPipeHandsConstructor {
  new (config: { locateFile: (file: string) => string }): MediaPipeHands;
}

interface MediaPipeCameraOptions {
  onFrame: () => Promise<void>;
  width?: number;
  height?: number;
  facingMode?: string;
}

interface MediaPipeCamera {
  start(): Promise<void>;
  stop(): void;
}

interface MediaPipeCameraConstructor {
  new (video: HTMLVideoElement, options: MediaPipeCameraOptions): MediaPipeCamera;
}

declare global {
  interface Window {
    Hands: MediaPipeHandsConstructor;
    Camera: MediaPipeCameraConstructor;
  }
}

export {};
