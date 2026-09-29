import React, { useState } from 'react';
import { Droplet, Leaf, AlertCircle, TrendingUp, Save } from 'lucide-react';
import { useSoilHealth } from '@/hooks/useSoilHealth';
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

export const SoilHealthTesting: React.FC = () => {
  const { analyzeSoil } = useSoilHealth();

  const [formData, setFormData] = useState({
    nitrogen: 150,
    phosphorus: 30,
    potassium: 150,
    ph: 6.5,
    organicMatter: 2.5,
    moisture: 45,
    texture: 'loamy',
  });

  const [soilAnalysis, setSoilAnalysis] = useState<any>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnalyze = () => {
    const analysis = analyzeSoil(formData);
    setSoilAnalysis(analysis);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'blue';
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, any> = {
      Excellent: 'green',
      Good: 'orange',
      Fair: 'yellow',
      Poor: 'red',
    };
    return colors[grade] || 'gray';
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <AgriculturalHero
        title="🌱 Soil Health Testing"
        subtitle="Analyze your soil and get personalized recommendations"
        icon={Leaf}
        backgroundVariant="growth"
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <AgriculturalCard variant="growth" padding="lg">
            <h3 className="text-xl font-bold mb-6 text-green-900">📋 Test Parameters</h3>

            <div className="space-y-4">
              {/* Nitrogen */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nitrogen (N) - kg/ha
                </label>
                <input
                  type="range"
                  min="0"
                  max="400"
                  value={formData.nitrogen}
                  onChange={(e) => handleInputChange('nitrogen', Number(e.target.value))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-right text-sm font-bold text-green-600 mt-1">{formData.nitrogen}</p>
              </div>

              {/* Phosphorus */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phosphorus (P) - kg/ha
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={formData.phosphorus}
                  onChange={(e) => handleInputChange('phosphorus', Number(e.target.value))}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-right text-sm font-bold text-orange-600 mt-1">{formData.phosphorus}</p>
              </div>

              {/* Potassium */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Potassium (K) - kg/ha
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={formData.potassium}
                  onChange={(e) => handleInputChange('potassium', Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-right text-sm font-bold text-blue-600 mt-1">{formData.potassium}</p>
              </div>

              {/* pH */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">pH Level</label>
                <input
                  type="range"
                  min="4"
                  max="9"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => handleInputChange('ph', Number(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-right text-sm font-bold text-purple-600 mt-1">{formData.ph.toFixed(1)}</p>
              </div>

              {/* Organic Matter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organic Matter - %
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.organicMatter}
                  onChange={(e) => handleInputChange('organicMatter', Number(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-right text-sm font-bold text-amber-600 mt-1">
                  {formData.organicMatter.toFixed(1)}%
                </p>
              </div>

              {/* Moisture */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Soil Moisture - %
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.moisture}
                  onChange={(e) => handleInputChange('moisture', Number(e.target.value))}
                  className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-right text-sm font-bold text-cyan-600 mt-1">{formData.moisture}%</p>
              </div>

              {/* Texture */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Texture</label>
                <select
                  value={formData.texture}
                  onChange={(e) => handleInputChange('texture', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="sandy">Sandy (Light)</option>
                  <option value="loamy">Loamy (Medium)</option>
                  <option value="clay">Clay (Heavy)</option>
                </select>
              </div>

              <AgriculturalButton
                fullWidth
                onClick={handleAnalyze}
                variant="primary"
                icon={TrendingUp}
              >
                Analyze Soil
              </AgriculturalButton>
            </div>
          </AgriculturalCard>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {soilAnalysis ? (
            <>
              {/* Overall Score */}
              <div className="relative">
                <AgriculturalCard variant="soil" padding="lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-amber-900">Soil Health Score</h3>
                    <div className="text-right">
                      <p className="text-5xl font-bold text-amber-600">{soilAnalysis.score}</p>
                      <p className="text-sm text-amber-600 font-semibold">/100</p>
                    </div>
                  </div>

                  <AgriculturalProgress
                    value={soilAnalysis.score}
                    max={100}
                    color="brown"
                    showPercentage={false}
                  />

                  <div className="mt-4 flex gap-2">
                    <AgriculturalBadge variant={getGradeColor(soilAnalysis.grade)}>
                      {soilAnalysis.grade} Soil
                    </AgriculturalBadge>
                    <AgriculturalBadge variant="green">
                      {formData.texture.charAt(0).toUpperCase() + formData.texture.slice(1)}
                    </AgriculturalBadge>
                  </div>
                </AgriculturalCard>
              </div>

              {/* NPK Stats */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Nutrient Analysis</h4>
                <AgriculturalGrid columns={3} gap="md">
                  <AgriculturalStat
                    label="Nitrogen"
                    value={formData.nitrogen}
                    unit="kg/ha"
                    color="green"
                    trend={formData.nitrogen > 200 ? 'up' : formData.nitrogen < 100 ? 'down' : 'stable'}
                  />
                  <AgriculturalStat
                    label="Phosphorus"
                    value={formData.phosphorus}
                    unit="kg/ha"
                    color="orange"
                    trend={formData.phosphorus > 35 ? 'up' : formData.phosphorus < 20 ? 'down' : 'stable'}
                  />
                  <AgriculturalStat
                    label="Potassium"
                    value={formData.potassium}
                    unit="kg/ha"
                    color="blue"
                    trend={formData.potassium > 180 ? 'up' : formData.potassium < 120 ? 'down' : 'stable'}
                  />
                </AgriculturalGrid>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">💡 Recommendations</h4>
                <div className="space-y-3">
                  {soilAnalysis.recommendations.map((rec: string, idx: number) => (
                    <AgriculturalAlert key={idx} type="info" dismissible>
                      {rec}
                    </AgriculturalAlert>
                  ))}
                </div>
              </div>

              {/* Suitable Crops */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">🌾 Suitable Crops</h4>
                <div className="flex flex-wrap gap-2">
                  {soilAnalysis.suitableCrops
                    ?.slice(0, 8)
                    .map((crop: string, idx: number) => (
                      <AgriculturalBadge key={idx} variant="green">
                        {crop}
                      </AgriculturalBadge>
                    ))}
                </div>
              </div>

              {/* Save Results */}
              <AgriculturalButton fullWidth variant="success" icon={Save}>
                Save Analysis Results
              </AgriculturalButton>
            </>
          ) : (
            <AgriculturalCard variant="default" padding="lg">
              <div className="text-center py-12">
                <Leaf className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  👈 Adjust soil parameters and click "Analyze Soil" to see results
                </p>
              </div>
            </AgriculturalCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilHealthTesting;
