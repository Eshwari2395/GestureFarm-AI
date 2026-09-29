import React, { useState } from 'react';
import { Sprout, BarChart3, ShoppingCart, Calendar } from 'lucide-react';
import { useFertilizerRecommendation } from '@/hooks/useFertilizerRecommendation';
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

export const FertilizerRecommendationUI: React.FC = () => {
  const { getRecommendation, getCropSchedule, calculateCost } = useFertilizerRecommendation();

  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [selectedStage, setSelectedStage] = useState('seedling');
  const [recommendation, setRecommendation] = useState<any>(null);

  const crops = [
    { value: 'rice', label: '🍚 Rice' },
    { value: 'wheat', label: '🌾 Wheat' },
    { value: 'maize', label: '🌽 Maize' },
    { value: 'potato', label: '🥔 Potato' },
    { value: 'sugarcane', label: '🎍 Sugarcane' },
    { value: 'cotton', label: '🧵 Cotton' },
    { value: 'groundnut', label: '🥜 Groundnut' },
    { value: 'tomato', label: '🍅 Tomato' },
  ];

  const stages = ['seedling', 'vegetative', 'flowering', 'fruiting', 'maturation'];

  const handleGetRecommendation = () => {
    const rec = getRecommendation(selectedCrop, selectedStage, {
      nitrogen: 150,
      phosphorus: 30,
      potassium: 150,
    });
    setRecommendation(rec);
  };

  const schedule = getCropSchedule(selectedCrop);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <AgriculturalHero
        title="🌾 Fertilizer Recommendations"
        subtitle="Smart fertilizer suggestions based on crop stage and soil"
        icon={Sprout}
        backgroundVariant="harvest"
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Selector Panel */}
        <div className="lg:col-span-1 space-y-4">
          <AgriculturalCard variant="harvest" padding="lg">
            <h3 className="text-lg font-bold mb-4 text-orange-900">🎯 Select Crop</h3>

            <div className="space-y-2">
              {crops.map((crop) => (
                <button
                  key={crop.value}
                  onClick={() => setSelectedCrop(crop.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedCrop === crop.value
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-orange-50 text-orange-900 hover:bg-orange-100'
                  }`}
                >
                  {crop.label}
                </button>
              ))}
            </div>
          </AgriculturalCard>

          <AgriculturalCard variant="harvest" padding="lg">
            <h3 className="text-lg font-bold mb-4 text-orange-900">📅 Growth Stage</h3>

            <div className="space-y-2">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all text-sm ${
                    selectedStage === stage
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </button>
              ))}
            </div>

            <AgriculturalButton
              fullWidth
              onClick={handleGetRecommendation}
              variant="secondary"
              icon={BarChart3}
              className="mt-4"
            >
              Get Recommendation
            </AgriculturalButton>
          </AgriculturalCard>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 space-y-6">
          {recommendation ? (
            <>
              {/* Stage Progress */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Growth Timeline</h4>
                <AgriculturalCard padding="lg">
                  <div className="space-y-4">
                    {schedule.map((stage: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-l-4 ${
                          stage.stage === selectedStage
                            ? 'border-l-orange-500 bg-orange-50'
                            : 'border-l-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">{stage.stage}</span>
                          <span className="text-sm text-gray-600">Days {stage.daysNeeded}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AgriculturalCard>
              </div>

              {/* Recommendation Details */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">💊 Fertilizer Recommendation</h4>

                <AgriculturalCard variant="harvest" padding="lg">
                  <div className="mb-6">
                    <h5 className="text-sm font-bold text-orange-900 mb-3">RECOMMENDED FERTILIZERS</h5>
                    <div className="space-y-3">
                      {recommendation.recommendations.map((rec: any, idx: number) => (
                        <div
                          key={idx}
                          className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h6 className="font-bold text-orange-900">{rec.product}</h6>
                            <AgriculturalBadge variant="orange">
                              {rec.quantity} kg
                            </AgriculturalBadge>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Cost: ₹{rec.cost}</span>
                            <span className="font-semibold text-orange-600">
                              Application: {rec.applicationTiming} days after sowing
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="border-t-2 border-orange-200 pt-4 mt-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">COST SUMMARY</p>
                    <div className="grid grid-cols-3 gap-3">
                      {recommendation.recommendations.map((rec: any, idx: number) => (
                        <div key={idx} className="bg-white rounded p-2">
                          <p className="text-xs text-gray-600">{rec.product}</p>
                          <p className="text-lg font-bold text-orange-600">₹{rec.cost}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 bg-orange-100 rounded p-3">
                      <p className="text-sm text-gray-700 mb-1">Total Cost per Hectare</p>
                      <p className="text-3xl font-bold text-orange-700">
                        ₹{recommendation.recommendations.reduce((sum: number, r: any) => sum + r.cost, 0)}
                      </p>
                    </div>
                  </div>
                </AgriculturalCard>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">✨ Expected Benefits</h4>
                <div className="space-y-3">
                  <AgriculturalRecommendation
                    title="Yield Increase"
                    description={`Expected yield increase of 15-20% at this growth stage`}
                    priority="high"
                    icon={Sprout}
                  />
                  <AgriculturalRecommendation
                    title="Optimal Nutrient Balance"
                    description={`Perfect NPK ratio for maximum nutrient uptake during ${selectedStage} stage`}
                    priority="medium"
                  />
                  <AgriculturalRecommendation
                    title="Cost Efficiency"
                    description={`Saves ₹2,000-3,000 per hectare compared to conventional methods`}
                    priority="medium"
                  />
                </div>
              </div>

              {/* Application Guide */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">📋 Application Guide</h4>
                <AgriculturalCard padding="lg">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Check Weather</p>
                        <p className="text-sm text-gray-600">Apply during cloudy weather or early morning</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Prepare Solution</p>
                        <p className="text-sm text-gray-600">Dissolve fertilizer in water as per ratio</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Apply Evenly</p>
                        <p className="text-sm text-gray-600">Distribute uniformly across the field</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Water Thoroughly</p>
                        <p className="text-sm text-gray-600">Irrigate after application for better absorption</p>
                      </div>
                    </div>
                  </div>
                </AgriculturalCard>
              </div>

              {/* Buy & Save */}
              <div className="grid grid-cols-2 gap-4">
                <AgriculturalButton fullWidth variant="secondary" icon={ShoppingCart}>
                  Find Local Supplier
                </AgriculturalButton>
                <AgriculturalButton fullWidth variant="success">
                  Save Recommendation
                </AgriculturalButton>
              </div>
            </>
          ) : (
            <AgriculturalCard variant="default" padding="lg">
              <div className="text-center py-12">
                <Sprout className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  👈 Select a crop and stage, then click "Get Recommendation"
                </p>
              </div>
            </AgriculturalCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizerRecommendationUI;
