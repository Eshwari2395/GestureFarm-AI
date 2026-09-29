import React, { useState, useRef } from 'react';
import { Camera, AlertTriangle, CheckCircle, Zap, Clock, DollarSign } from 'lucide-react';
import { useDiseaseIdentifier } from '@/hooks/useDiseaseIdentifier';
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

export const DiseaseIdentifierUI: React.FC = () => {
  const { detectDisease } = useDiseaseIdentifier();

  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detection, setDetection] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const crops = ['rice', 'wheat', 'potato', 'maize', 'tomato', 'cotton'];

  const priorityColors = {
    low: 'text-blue-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  };

  const priorityBgColors = {
    low: 'bg-blue-100',
    medium: 'bg-yellow-100',
    high: 'bg-orange-100',
    critical: 'bg-red-100',
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectDisease = () => {
    if (!imagePreview) return;

    setLoading(true);
    // Simulate detection delay
    setTimeout(() => {
      const result = detectDisease(imagePreview, selectedCrop);
      setDetection(result);
      setLoading(false);
    }, 2000);
  };

  const resetDetection = () => {
    setImagePreview(null);
    setDetection(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <AgriculturalHero
        title="🐛 Plant Disease Identifier"
        subtitle="AI-powered disease detection using leaf images"
        icon={Camera}
        backgroundVariant="soil"
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-4">
          <AgriculturalCard variant="soil" padding="lg">
            <h3 className="text-lg font-bold mb-4 text-amber-900">🌾 Select Crop</h3>

            <div className="space-y-2 mb-4">
              {crops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all text-sm capitalize ${
                    selectedCrop === crop
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {crop === 'rice'
                    ? '🍚 Rice'
                    : crop === 'wheat'
                    ? '🌾 Wheat'
                    : crop === 'potato'
                    ? '🥔 Potato'
                    : crop === 'maize'
                    ? '🌽 Maize'
                    : crop === 'tomato'
                    ? '🍅 Tomato'
                    : '🧵 Cotton'}
                </button>
              ))}
            </div>
          </AgriculturalCard>

          <AgriculturalCard variant="soil" padding="lg">
            <h3 className="text-lg font-bold mb-4 text-amber-900">📸 Upload Image</h3>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center cursor-pointer hover:bg-amber-50 transition-colors"
              >
                <Camera className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="font-semibold text-amber-900 mb-1">Click to upload</p>
                <p className="text-sm text-amber-700">or drag and drop</p>
                <p className="text-xs text-amber-600 mt-2">JPG, PNG (max 5MB)</p>
              </div>
            ) : (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Leaf sample"
                  className="w-full h-40 object-cover rounded-lg border-2 border-amber-300"
                />
                <AgriculturalButton
                  fullWidth
                  variant="danger"
                  onClick={() => setImagePreview(null)}
                  className="text-sm"
                >
                  Remove Image
                </AgriculturalButton>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <AgriculturalButton
              fullWidth
              onClick={handleDetectDisease}
              variant="secondary"
              icon={Zap}
              disabled={!imagePreview || loading}
              className="mt-4"
            >
              {loading ? 'Analyzing...' : 'Detect Disease'}
            </AgriculturalButton>
          </AgriculturalCard>

          {detection && (
            <AgriculturalButton fullWidth onClick={resetDetection} variant="tertiary">
              Try Another Image
            </AgriculturalButton>
          )}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {detection ? (
            <>
              {/* Disease Overview */}
              <div>
                <AgriculturalCard variant="soil" padding="lg">
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-amber-900 mb-2">
                          {detection.diseaseName}
                        </h2>
                        <p className="text-gray-700">{detection.scientificName}</p>
                      </div>
                      <AgriculturalBadge variant={detection.urgency === 'critical' ? 'red' : detection.urgency === 'high' ? 'orange' : 'yellow'}>
                        {detection.urgency.toUpperCase()}
                      </AgriculturalBadge>
                    </div>

                    <AgriculturalProgress
                      value={detection.confidence}
                      max={100}
                      label="Detection Confidence"
                      color="brown"
                    />
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2 border-amber-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Severity</p>
                      <p className="font-bold text-amber-600 text-lg capitalize">
                        {detection.severity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Spread Risk</p>
                      <p className="font-bold text-orange-600 text-lg capitalize">
                        {detection.spreadRisk}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Treatment Days</p>
                      <p className="font-bold text-green-600 text-lg">
                        {detection.treatmentDaysNeeded}
                      </p>
                    </div>
                  </div>
                </AgriculturalCard>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">🔍 Symptoms</h4>
                <AgriculturalCard padding="lg">
                  <p className="text-gray-700 leading-relaxed mb-4">{detection.symptoms}</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {detection.visibleSigns?.slice(0, 4).map((sign: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        <span className="text-gray-700">{sign}</span>
                      </div>
                    ))}
                  </div>
                </AgriculturalCard>
              </div>

              {/* Treatments */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">💊 Treatment Options</h4>
                <div className="space-y-3">
                  {detection.treatments?.slice(0, 3).map((treatment: any, idx: number) => (
                    <AgriculturalCard key={idx} variant="soil" padding="lg">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-bold text-amber-900 text-lg">
                          {treatment.productName}
                        </h5>
                        <AgriculturalBadge variant="orange">
                          {treatment.type}
                        </AgriculturalBadge>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{treatment.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="bg-white rounded p-3">
                          <p className="text-gray-600 text-xs">Dosage</p>
                          <p className="font-bold text-amber-700">{treatment.dosage}</p>
                        </div>
                        <div className="bg-white rounded p-3">
                          <p className="text-gray-600 text-xs">Frequency</p>
                          <p className="font-bold text-amber-700">{treatment.frequency}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4" />
                          <span>Cost: ₹{treatment.cost}/{treatment.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4" />
                          <span>{treatment.duration}</span>
                        </div>
                      </div>
                    </AgriculturalCard>
                  ))}
                </div>
              </div>

              {/* Prevention & Management */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">🛡️ Prevention & Management</h4>
                <AgriculturalCard variant="growth" padding="lg">
                  <div className="space-y-3">
                    {detection.preventionMeasures?.slice(0, 4).map((measure: string, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm">{measure}</p>
                      </div>
                    ))}
                  </div>
                </AgriculturalCard>
              </div>

              {/* Urgency Alert */}
              {detection.urgency === 'critical' && (
                <AgriculturalAlert type="danger" title="⚠️ URGENT ACTION NEEDED">
                  This disease requires immediate treatment to prevent crop loss. Apply recommended
                  treatment within 24-48 hours and monitor closely.
                </AgriculturalAlert>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <AgriculturalButton fullWidth variant="secondary">
                  Order Treatment
                </AgriculturalButton>
                <AgriculturalButton fullWidth variant="tertiary">
                  Contact Expert
                </AgriculturalButton>
                <AgriculturalButton fullWidth variant="success">
                  Save Report
                </AgriculturalButton>
              </div>
            </>
          ) : (
            <AgriculturalCard variant="default" padding="lg">
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  👈 Select a crop and upload a leaf image to detect diseases
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Use clear, well-lit images for best results
                </p>
              </div>
            </AgriculturalCard>
          )}
        </div>
      </div>

      {/* Educational Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Disease Information</h3>
        <AgriculturalGrid columns={2} gap="lg">
          <AgriculturalCard padding="lg">
            <h4 className="font-bold text-gray-900 mb-3">📖 How to Use</h4>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Select the crop type from the list</li>
              <li>Take a clear photo of an affected leaf</li>
              <li>Upload the image and click "Detect Disease"</li>
              <li>Review diagnosis and treatment options</li>
              <li>Order treatment and apply as recommended</li>
            </ol>
          </AgriculturalCard>

          <AgriculturalCard padding="lg">
            <h4 className="font-bold text-gray-900 mb-3">✅ Best Practices</h4>
            <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Use natural sunlight for photos</li>
              <li>Show both leaf sides if possible</li>
              <li>Include symptoms clearly in frame</li>
              <li>Avoid shadows and blur</li>
              <li>Treat as soon as diagnosed</li>
            </ul>
          </AgriculturalCard>
        </AgriculturalGrid>
      </div>
    </div>
  );
};

export default DiseaseIdentifierUI;
