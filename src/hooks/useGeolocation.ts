import { useState, useCallback, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
  isGranted: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void;
}

// Default location: Telangana/Hyderabad (for fallback)
const DEFAULT_LATITUDE = 17.3850;
const DEFAULT_LONGITUDE = 78.4867;

export const useGeolocation = (): UseGeolocationReturn => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false,
    isGranted: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation not supported",
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
          isGranted: true,
        });
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setState({
          latitude: DEFAULT_LATITUDE,
          longitude: DEFAULT_LONGITUDE,
          error: error.message,
          isLoading: false,
          isGranted: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // Cache for 10 minutes
      }
    );
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
  };
};

export default useGeolocation;
