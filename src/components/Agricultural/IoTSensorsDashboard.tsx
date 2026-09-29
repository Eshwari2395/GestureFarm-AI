import React, { useState, useEffect } from 'react';
import { Zap, Wifi, TrendingUp, AlertTriangle, Eye, Trash2, Plus } from 'lucide-react';
import { useIoTSensors } from '@/hooks/useIoTSensors';
import {
  AgriculturalCard,
  AgriculturalStat,
  AgriculturalButton,
  AgriculturalProgress,
  AgriculturalAlert,
  AgriculturalBadge,
  AgriculturalGrid,
  AgriculturalHero,
} from './AgriculturalComponents';

export const IoTSensorsDashboard: React.FC = () => {
  const { addSensor, getActiveAlerts, generateMockReading } = useIoTSensors();

  const [sensors, setSensors] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [showAddSensor, setShowAddSensor] = useState(false);

  const sensorTypes = [
    { id: 'temperature', label: '🌡️ Temperature', unit: '°C', icon: '🌡️' },
    { id: 'humidity', label: '💨 Humidity', unit: '%', icon: '💨' },
    { id: 'soilMoisture', label: '💧 Soil Moisture', unit: '%', icon: '💧' },
    { id: 'pH', label: '⚗️ Soil pH', unit: 'pH', icon: '⚗️' },
    { id: 'rainfall', label: '🌧️ Rainfall', unit: 'mm', icon: '🌧️' },
    { id: 'lightIntensity', label: '☀️ Light Intensity', unit: 'lux', icon: '☀️' },
    { id: 'NPK', label: '🌿 NPK', unit: 'mg/kg', icon: '🌿' },
  ];

  const protocols = ['WiFi', 'Bluetooth', 'MQTT', 'HTTP', 'LTE'];

  const handleAddSensor = (sensorType: string) => {
    const sensorData = {
      id: `sensor_${Date.now()}`,
      type: sensorType,
      protocol: protocols[0],
      name: `${sensorTypes.find((s) => s.id === sensorType)?.label}`,
      batteryLevel: 95,
      signalStrength: 85,
      lastUpdate: new Date(),
      currentReading: Math.random() * 100,
    };
    setSensors([...sensors, sensorData]);
    setShowAddSensor(false);
  };

  const handleRemoveSensor = (sensorId: string) => {
    setSensors(sensors.filter((s) => s.id !== sensorId));
  };

  const handleRefreshAlerts = () => {
    const newAlerts = getActiveAlerts();
    setAlerts(newAlerts);
  };

  useEffect(() => {
    handleRefreshAlerts();
  }, [sensors]);

  const getStatusColor = (sensorType: string) => {
    if (sensorType.includes('temperature')) return 'orange';
    if (sensorType.includes('Humidity')) return 'blue';
    if (sensorType.includes('Moisture')) return 'cyan';
    if (sensorType.includes('pH')) return 'purple';
    if (sensorType.includes('Rainfall')) return 'teal';
    if (sensorType.includes('Light')) return 'yellow';
    return 'green';
  };

  const avgReading = sensors.length > 0 ? (sensors.reduce((sum, s) => sum + s.currentReading, 0) / sensors.length).toFixed(1) : 0;
  const healthScore = Math.max(0, 100 - (alerts.length * 10));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <AgriculturalHero
        title="📡 IoT Sensors Dashboard"
        subtitle="Real-time farm monitoring and intelligent alerts"
        icon={Zap}
        backgroundVariant="water"
      />

      {/* Farm Status Overview */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">🌾 Farm Status</h3>
        <AgriculturalGrid columns={4} gap="md">
          <AgriculturalStat
            label="Active Sensors"
            value={sensors.length}
            color="green"
            icon={Zap}
          />
          <AgriculturalStat
            label="Farm Health"
            value={healthScore}
            unit="%"
            color="green"
            trend={healthScore > 80 ? 'up' : healthScore > 50 ? 'stable' : 'down'}
          />
          <AgriculturalStat
            label="Alerts"
            value={alerts.length}
            color={alerts.length > 0 ? 'orange' : 'green'}
            trend={alerts.length > 0 ? 'down' : 'stable'}
          />
          <AgriculturalStat
            label="Avg Reading"
            value={avgReading}
            color="blue"
          />
        </AgriculturalGrid>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">⚠️ Active Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <AgriculturalAlert
                key={idx}
                type={alert.severity === 'critical' ? 'danger' : 'warning'}
                title={alert.sensorName}
                icon={AlertTriangle}
                dismissible
              >
                {alert.message} - {alert.currentValue} {alert.unit}
              </AgriculturalAlert>
            ))}
          </div>
        </div>
      )}

      {/* Add Sensor Section */}
      {showAddSensor && (
        <AgriculturalCard variant="growth" padding="lg">
          <h3 className="text-lg font-bold mb-4 text-green-900">➕ Add New Sensor</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sensorTypes.map((sensor) => (
              <button
                key={sensor.id}
                onClick={() => handleAddSensor(sensor.id)}
                className="p-4 rounded-lg bg-green-50 hover:bg-green-100 border-2 border-green-200 transition-all text-center"
              >
                <p className="text-2xl mb-2">{sensor.icon}</p>
                <p className="text-sm font-semibold text-green-900">{sensor.label}</p>
              </button>
            ))}
          </div>
          <AgriculturalButton
            fullWidth
            onClick={() => setShowAddSensor(false)}
            variant="primary"
            className="mt-4"
          >
            Done
          </AgriculturalButton>
        </AgriculturalCard>
      )}

      {/* Sensors Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">📊 Connected Sensors</h3>
          <AgriculturalButton
            onClick={() => setShowAddSensor(!showAddSensor)}
            variant="primary"
            icon={Plus}
          >
            Add Sensor
          </AgriculturalButton>
        </div>

        {sensors.length === 0 ? (
          <AgriculturalCard variant="default" padding="lg">
            <div className="text-center py-12">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No sensors connected yet</p>
              <p className="text-sm text-gray-500 mt-2">Click "Add Sensor" to connect your IoT devices</p>
            </div>
          </AgriculturalCard>
        ) : (
          <div className="space-y-4">
            {sensors.map((sensor) => (
              <AgriculturalCard key={sensor.id} variant="water" padding="lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-blue-900 mb-1">{sensor.name}</h4>
                    <p className="text-xs text-gray-600">
                      ID: {sensor.id} • Protocol: {sensor.protocol}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveSensor(sensor.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <AgriculturalStat
                    label="Current Reading"
                    value={sensor.currentReading.toFixed(1)}
                    unit={sensorTypes.find((s) => s.id === sensor.type)?.unit}
                    color="blue"
                  />
                  <AgriculturalStat
                    label="Battery Level"
                    value={sensor.batteryLevel}
                    unit="%"
                    color="green"
                    trend={sensor.batteryLevel > 50 ? 'stable' : 'down'}
                  />
                  <AgriculturalStat
                    label="Signal Strength"
                    value={sensor.signalStrength}
                    unit="%"
                    color="green"
                    trend={sensor.signalStrength > 70 ? 'up' : 'stable'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 bg-blue-50 rounded p-3">
                  <div>
                    <AgriculturalProgress
                      value={sensor.batteryLevel}
                      max={100}
                      label="Battery"
                      color="blue"
                      showPercentage
                    />
                  </div>
                  <div>
                    <AgriculturalProgress
                      value={sensor.signalStrength}
                      max={100}
                      label="Signal"
                      color="blue"
                      showPercentage
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-blue-200 flex items-center justify-between text-xs text-gray-600">
                  <span>Last Update: {sensor.lastUpdate.toLocaleTimeString()}</span>
                  <AgriculturalBadge variant="blue">
                    <Wifi className="w-3 h-3 mr-1" />
                    Connected
                  </AgriculturalBadge>
                </div>
              </AgriculturalCard>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Trends */}
      {sensors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">📈 Real-time Trends</h3>
            <div className="flex gap-2">
              {['1h', '24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                    selectedTimeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <AgriculturalCard padding="lg">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-3 opacity-50" />
                <p className="text-gray-600">Chart visualization would be displayed here</p>
                <p className="text-xs text-gray-500 mt-1">
                  Using Chart.js or similar library for real-time graphs
                </p>
              </div>
            </div>
          </AgriculturalCard>
        </div>
      )}

      {/* Setup Guide */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">🔧 Supported Protocols</h3>
        <AgriculturalGrid columns={3} gap="md">
          <AgriculturalCard padding="lg">
            <h4 className="font-bold text-gray-900 mb-2">📡 WiFi</h4>
            <p className="text-sm text-gray-700 mb-3">
              ESP8266 or ESP32 microcontrollers for reliable connectivity
            </p>
            <AgriculturalBadge variant="blue">Popular</AgriculturalBadge>
          </AgriculturalCard>

          <AgriculturalCard padding="lg">
            <h4 className="font-bold text-gray-900 mb-2">🔷 Bluetooth</h4>
            <p className="text-sm text-gray-700 mb-3">
              Low energy Bluetooth for mobile device connectivity
            </p>
            <AgriculturalBadge variant="green">Energy Efficient</AgriculturalBadge>
          </AgriculturalCard>

          <AgriculturalCard padding="lg">
            <h4 className="font-bold text-gray-900 mb-2">🌐 MQTT</h4>
            <p className="text-sm text-gray-700 mb-3">
              IoT protocol for distributed sensor networks
            </p>
            <AgriculturalBadge variant="orange">Advanced</AgriculturalBadge>
          </AgriculturalCard>
        </AgriculturalGrid>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <AgriculturalButton fullWidth variant="tertiary">
          Export Data
        </AgriculturalButton>
        <AgriculturalButton fullWidth variant="secondary">
          Configure Alerts
        </AgriculturalButton>
        <AgriculturalButton fullWidth variant="success">
          Save Dashboard
        </AgriculturalButton>
      </div>
    </div>
  );
};

export default IoTSensorsDashboard;
