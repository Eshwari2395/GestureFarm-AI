import { useState, useCallback, useEffect } from "react";

export type SensorType = "temperature" | "humidity" | "soilMoisture" | "pH" | "rainfall" | "light" | "npk";

export interface SensorReading {
  timestamp: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  accuracy?: number; // Percentage
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: string;
  
  // Hardware info
  modelNumber?: string;
  manufacturer?: string;
  serialNumber?: string;
  
  // Connectivity
  connectionType: "wifi" | "bluetooth" | "mqtt" | "http" | "lte";
  lastSyncTime: string;
  isOnline: boolean;
  
  // Sensor config
  unit: string;
  minValue: number;
  maxValue: number;
  calibration?: { offset: number; multiplier: number };
  
  // Current reading
  currentReading: SensorReading;
  
  // Historical data
  history: SensorReading[];
  
  // Alerts
  warningThreshold: number;
  criticalThreshold: number;
}

export interface FarmDashboard {
  farmId: string;
  sensors: Sensor[];
  lastUpdated: string;
  
  // Summary stats
  average: Record<SensorType, number>;
  status: "healthy" | "warning" | "critical";
  activeAlerts: number;
}

interface UseIoTSensorsOptions {
  language?: string;
  pollInterval?: number; // milliseconds
}

interface UseIoTSensorsReturn {
  sensors: Sensor[];
  dashboard: FarmDashboard | null;
  
  // Sensor management
  addSensor: (sensor: Omit<Sensor, "id" | "currentReading" | "history">) => Promise<Sensor>;
  removeSensor: (sensorId: string) => Promise<void>;
  getSensorData: (sensorId: string, timeRange: "1h" | "24h" | "7d" | "30d") => SensorReading[];
  
  // Real-time data
  getLatestReading: (sensorId: string) => SensorReading | null;
  getAverageReading: (sensorType: SensorType, timeRange: string) => number;
  
  // Alerts
  getActiveAlerts: () => Array<{ sensorId: string; sensorName: string; message: string; severity: string }>;
  
  // Dashboard
  getDashboard: () => FarmDashboard | null;
  
  // Status
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

// Sensor configurations with standard ranges
const SENSOR_CONFIGS: Record<SensorType, { unit: string; minValue: number; maxValue: number; normalRange: { min: number; max: number } }> = {
  temperature: {
    unit: "°C",
    minValue: -20,
    maxValue: 60,
    normalRange: { min: 15, max: 35 },
  },
  humidity: {
    unit: "%",
    minValue: 0,
    maxValue: 100,
    normalRange: { min: 40, max: 80 },
  },
  soilMoisture: {
    unit: "%",
    minValue: 0,
    maxValue: 100,
    normalRange: { min: 30, max: 70 },
  },
  pH: {
    unit: "pH",
    minValue: 0,
    maxValue: 14,
    normalRange: { min: 6.0, max: 7.5 },
  },
  rainfall: {
    unit: "mm",
    minValue: 0,
    maxValue: 500,
    normalRange: { min: 0, max: 50 },
  },
  light: {
    unit: "lux",
    minValue: 0,
    maxValue: 100000,
    normalRange: { min: 1000, max: 40000 },
  },
  npk: {
    unit: "mg/kg",
    minValue: 0,
    maxValue: 1000,
    normalRange: { min: 200, max: 800 },
  },
};

/**
 * Determine sensor reading status based on thresholds
 */
const getReadingStatus = (value: number, warningThreshold: number, criticalThreshold: number): "normal" | "warning" | "critical" => {
  if (Math.abs(value - warningThreshold) >= Math.abs(criticalThreshold - warningThreshold)) {
    return "critical";
  } else if (Math.abs(value - warningThreshold) > 0) {
    return "warning";
  }
  return "normal";
};

/**
 * Mock sensor data generation (for testing)
 */
const generateMockReading = (type: SensorType): SensorReading => {
  const config = SENSOR_CONFIGS[type];
  const value = Math.random() * (config.maxValue - config.minValue) + config.minValue;

  return {
    timestamp: new Date().toISOString(),
    value: Math.round(value * 100) / 100,
    unit: config.unit,
    status: getReadingStatus(value, config.normalRange.max, config.maxValue),
    accuracy: 95 + Math.random() * 5,
  };
};

export const useIoTSensors = ({
  language = "en",
  pollInterval = 30000, // 30 seconds
}: UseIoTSensorsOptions = {}): UseIoTSensorsReturn => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [dashboard, setDashboard] = useState<FarmDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Add new sensor to farm
   */
  const addSensor = useCallback(
    async (sensorData: Omit<Sensor, "id" | "currentReading" | "history">): Promise<Sensor> => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const config = SENSOR_CONFIGS[sensorData.type];
        const newSensor: Sensor = {
          ...sensorData,
          id: `sensor-${Date.now()}`,
          currentReading: generateMockReading(sensorData.type),
          history: [],
          unit: config.unit,
          minValue: config.minValue,
          maxValue: config.maxValue,
        };

        setSensors((prev) => [...prev, newSensor]);
        console.log(`✅ Sensor added: ${newSensor.name} (${newSensor.type})`);
        
        return newSensor;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to add sensor";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Remove sensor
   */
  const removeSensor = useCallback(async (sensorId: string): Promise<void> => {
    try {
      setSensors((prev) => prev.filter((s) => s.id !== sensorId));
      console.log(`✅ Sensor removed: ${sensorId}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to remove sensor";
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * Get sensor data for time range
   */
  const getSensorData = useCallback(
    (sensorId: string, timeRange: "1h" | "24h" | "7d" | "30d"): SensorReading[] => {
      const sensor = sensors.find((s) => s.id === sensorId);
      if (!sensor) return [];

      // In production, fetch from database based on timeRange
      return sensor.history.slice(-100); // Return last 100 readings
    },
    [sensors]
  );

  /**
   * Get latest reading for a sensor
   */
  const getLatestReading = useCallback(
    (sensorId: string): SensorReading | null => {
      const sensor = sensors.find((s) => s.id === sensorId);
      return sensor?.currentReading || null;
    },
    [sensors]
  );

  /**
   * Get average reading for a sensor type
   */
  const getAverageReading = useCallback(
    (sensorType: SensorType, timeRange: string): number => {
      const sensorsOfType = sensors.filter((s) => s.type === sensorType);
      if (sensorsOfType.length === 0) return 0;

      const total = sensorsOfType.reduce((sum, s) => sum + s.currentReading.value, 0);
      return Math.round((total / sensorsOfType.length) * 100) / 100;
    },
    [sensors]
  );

  /**
   * Get all active alerts
   */
  const getActiveAlerts = useCallback(() => {
    return sensors
      .filter((s) => s.currentReading.status !== "normal")
      .map((s) => ({
        sensorId: s.id,
        sensorName: s.name,
        message: `${s.name} is ${s.currentReading.status}: ${s.currentReading.value}${s.currentReading.unit}`,
        severity: s.currentReading.status,
      }));
  }, [sensors]);

  /**
   * Get farm dashboard with summary
   */
  const getDashboard = useCallback((): FarmDashboard | null => {
    if (sensors.length === 0) return null;

    const average: Record<SensorType, number> = {
      temperature: getAverageReading("temperature", "24h"),
      humidity: getAverageReading("humidity", "24h"),
      soilMoisture: getAverageReading("soilMoisture", "24h"),
      pH: getAverageReading("pH", "24h"),
      rainfall: getAverageReading("rainfall", "24h"),
      light: getAverageReading("light", "24h"),
      npk: getAverageReading("npk", "24h"),
    };

    const activeAlerts = getActiveAlerts();
    const statusLevels = sensors.map((s) => s.currentReading.status);
    let overallStatus: "healthy" | "warning" | "critical" = "healthy";
    if (statusLevels.includes("critical")) {
      overallStatus = "critical";
    } else if (statusLevels.includes("warning")) {
      overallStatus = "warning";
    }

    return {
      farmId: "farm-main",
      sensors,
      lastUpdated: new Date().toISOString(),
      average,
      status: overallStatus,
      activeAlerts: activeAlerts.length,
    };
  }, [sensors, getAverageReading, getActiveAlerts]);

  /**
   * Simulate real-time data updates
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          currentReading: generateMockReading(sensor.type),
          lastSyncTime: new Date().toISOString(),
          isOnline: true,
        }))
      );
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);

  // Update dashboard periodically
  useEffect(() => {
    setDashboard(getDashboard());
  }, [sensors, getDashboard]);

  return {
    sensors,
    dashboard,
    addSensor,
    removeSensor,
    getSensorData,
    getLatestReading,
    getAverageReading,
    getActiveAlerts,
    getDashboard,
    isLoading,
    error,
    isConnected,
  };
};

export default useIoTSensors;
