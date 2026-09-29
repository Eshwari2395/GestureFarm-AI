import React, { useState } from 'react';
import { Droplets, Cloud, Sun, Calendar, AlertTriangle } from 'lucide-react';
import { useWaterManagement } from '@/hooks/useWaterManagement';
import {
  AgriculturalCard,
  AgriculturalStat,
  AgriculturalButton,
  AgriculturalProgress,
  AgriculturalAlert,
  AgriculturalBadge,
  AgriculturalGrid,
  AgriculturalHero,
  AgriculturalRecommendation,
} from './AgriculturalComponents';

export const WaterManagementUI: React.FC = () => {
  const { generateSchedule, getIrrigationAdvice, calculateWaterSavings, getOptimalIrrigationMethod } =
    useWaterManagement();

  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [farmArea, setFarmArea] = useState(5);
  const [schedule, setSchedule] = useState<any>(null);
  const [advice, setAdvice] = useState<any>(null);

  const crops = ['rice', 'wheat', 'maize', 'potato', 'sugarcane', 'cotton', 'tomato'];

  const cropWaterNeeds: Record<string, string> = {
    rice: '1000mm',
    wheat: '400mm',
    maize: '500mm',
    potato: '500mm',
    sugarcane: '1500mm',
    cotton: '700mm',
    tomato: '600mm',
  };

  const handleGetSchedule = () => {
    const newSchedule = generateSchedule(selectedCrop);
    setSchedule(newSchedule);
    const newAdvice = getIrrigationAdvice(selectedCrop);
    setAdvice(newAdvice);
  };

  const irrigationMethod = getOptimalIrrigationMethod(selectedCrop);
  const waterSavings = calculateWaterSavings(selectedCrop);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <AgriculturalHero
        title="💧 Water Management System"
        subtitle="Smart irrigation scheduling to save water and maximize yield"
        icon={Droplets}
        backgroundVariant="water"
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-4">
          <AgriculturalCard variant="water" padding="lg">
            <h3 className="text-lg font-bold mb-4 text-blue-900">🌾 Select Crop</h3>

            <div className="space-y-2 mb-4">
              {crops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all text-sm capitalize ${
                    selectedCrop === crop
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Farm Area: {farmArea} hectares
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={farmArea}
                onChange={(e) => setFarmArea(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg"
              />
            </div>

            <AgriculturalButton
              fullWidth
              onClick={handleGetSchedule}
              variant="tertiary"
              icon={Calendar}
            >
              Generate Schedule
            </AgriculturalButton>
          </AgriculturalCard>

          {/* Water Need Card */}
          {selectedCrop && (
            <AgriculturalCard variant="water" padding="lg">
              <h4 className="text-sm font-bold mb-3 text-blue-900">💧 Water Requirement</h4>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {cropWaterNeeds[selectedCrop]}
                </p>
                <p className="text-xs text-gray-600">for full season</p>
              </div>
              <div className="mt-4 pt-4 border-t-2 border-blue-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">For {farmArea} hectares:</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(
                    parseInt(cropWaterNeeds[selectedCrop]) * farmArea * 10
                  ).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">liters total</p>
              </div>
            </AgriculturalCard>
          )}
        </div>

        {/* Schedule & Details */}
        <div className="lg:col-span-3 space-y-6">
          {schedule ? (
            <>
              {/* Key Metrics */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Irrigation Metrics</h4>
                <AgriculturalGrid columns={3} gap="md">
                  <AgriculturalStat
                    label="Total Irrigations"
                    value={schedule.length}
                    color="blue"
                  />
                  <AgriculturalStat
                    label="Total Water"
                    value={schedule.reduce((sum: number, s: any) => sum + s.depth, 0)}
                    unit="mm"
                    color="blue"
                  />
                  <AgriculturalStat
                    label="Water Savings"
                    value={waterSavings.percentage}
                    unit="%"
                    color="green"
                    trend="up"
                  />
                </AgriculturalGrid>
              </div>

              {/* Irrigation Schedule */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">📅 Irrigation Schedule</h4>
                <AgriculturalCard padding="lg">
                  <div className="space-y-3">
                    {schedule.map((irrigation: any, idx: number) => (
                      <div key={idx} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-blue-900">
                            Irrigation {idx + 1} - Day {irrigation.dayAfterSowing}
                          </h5>
                          <AgriculturalBadge variant="blue">
                            {irrigation.depth}mm
                          </AgriculturalBadge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {irrigation.stage} stage - {irrigation.reason}
                        </p>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="bg-white rounded p-2">
                            <p className="text-gray-600">Method</p>
                            <p className="font-semibold text-blue-600">{irrigation.method}</p>
                          </div>
                          <div className="bg-white rounded p-2">
                            <p className="text-gray-600">Duration</p>
                            <p className="font-semibold text-blue-600">{irrigation.duration}h</p>
                          </div>
                          <div className="bg-white rounded p-2">
                            <p className="text-gray-600">Volume</p>
                            <p className="font-semibold text-blue-600">
                              {(irrigation.depth * farmArea * 10).toLocaleString()}L
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AgriculturalCard>
              </div>

              {/* Irrigation Method Recommendation */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">🔧 Recommended Irrigation Method</h4>
                <AgriculturalCard variant="water" padding="lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        {irrigationMethod.method === 'drip' ? '💧' : irrigationMethod.method === 'sprinkler' ? '🚿' : '🌊'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-blue-900 capitalize mb-2">
                        {irrigationMethod.method} Irrigation
                      </h5>
                      <p className="text-sm text-gray-700 mb-3">{irrigationMethod.description}</p>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Efficiency</p>
                          <p className="font-bold text-blue-600">{irrigationMethod.efficiency}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Initial Cost</p>
                          <p className="font-bold text-blue-600">₹{irrigationMethod.initialCost}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Annual Cost</p>
                          <p className="font-bold text-blue-600">₹{irrigationMethod.annualCost}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t-2 border-blue-200">
                    <h6 className="font-semibold text-sm text-gray-900 mb-2">Setup Requirements</h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {irrigationMethod.requirements.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-blue-500">✓</span> {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AgriculturalCard>
              </div>

              {/* Daily Tips */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">💡 Daily Irrigation Tips</h4>
                <div className="space-y-3">
                  {advice?.tips?.slice(0, 3).map((tip: string, idx: number) => (
                    <AgriculturalRecommendation
                      key={idx}
                      title={`Tip ${idx + 1}`}
                      description={tip}
                      priority={idx === 0 ? 'high' : 'medium'}
                    />
                  ))}
                </div>
              </div>

              {/* Water Savings Summary */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">💚 Water & Cost Savings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <AgriculturalCard variant="growth" padding="lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Water Saved vs Traditional</p>
                      <p className="text-3xl font-bold text-green-600">{waterSavings.percentage}%</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {waterSavings.litersPerHectare.toLocaleString()} L/hectare
                      </p>
                    </div>
                  </AgriculturalCard>
                  <AgriculturalCard variant="growth" padding="lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Annual Cost Savings</p>
                      <p className="text-3xl font-bold text-green-600">
                        ₹{waterSavings.costSavings.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">for {farmArea} hectares</p>
                    </div>
                  </AgriculturalCard>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <AgriculturalButton fullWidth variant="tertiary">
                  Download Schedule
                </AgriculturalButton>
                <AgriculturalButton fullWidth variant="success">
                  Save for Farm
                </AgriculturalButton>
              </div>
            </>
          ) : (
            <AgriculturalCard variant="default" padding="lg">
              <div className="text-center py-12">
                <Droplets className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  👈 Select a crop and click "Generate Schedule" to see irrigation plan
                </p>
              </div>
            </AgriculturalCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterManagementUI;
