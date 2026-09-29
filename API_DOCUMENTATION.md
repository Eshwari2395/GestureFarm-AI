# Mitti-Mitra v2.0 - New Features API Documentation

## 📋 Table of Contents
1. Soil Health Testing
2. Fertilizer Recommendations
3. Water Management (Irrigation)
4. Plant Disease Identifier
5. Loan & Subsidy Tracker
6. IoT Sensor Integration

---

## 1️⃣ Soil Health Testing (`useSoilHealth`)

### Usage
```typescript
import { useSoilHealth } from "@/hooks/useSoilHealth";

const { 
  analyzeSoil, 
  saveSoilTest, 
  getRecommendations, 
  getSoilGrade,
  currentTest,
  tests,
  isLoading,
  error 
} = useSoilHealth({ language: "hi" });
```

### Methods

#### `analyzeSoil(test: SoilTest): SoilTest`
Analyze soil test and generate comprehensive report including health score and recommendations.

**Parameters:**
```typescript
{
  id: string;
  nitrogen: number;        // kg/ha (0-1000)
  phosphorus: number;      // kg/ha (0-100)
  potassium: number;       // kg/ha (0-700)
  pH: number;              // 0-14
  organicMatter: number;   // 0-10%
  moisture: number;        // 0-100%
  texture: "sandy" | "loamy" | "clay";
}
```

**Returns:**
```typescript
{
  healthScore: number;           // 0-100
  recommendations: string[];     // Specific advice
  suitableCrops: string[];      // Recommended crops
  ...otherFields
}
```

#### `saveSoilTest(test: SoilTest): Promise<void>`
Save soil test to database with analysis results.

#### `getSoilGrade(score: number): string`
Convert health score to grade (Excellent/Good/Fair/Poor).

### Example
```typescript
const test = {
  nitrogen: 200,
  phosphorus: 15,
  potassium: 150,
  pH: 6.5,
  organicMatter: 0.8,
  moisture: 25,
  texture: "loamy"
};

const analyzed = analyzeSoil(test);
console.log(`Soil Health: ${analyzed.healthScore}/100`);
console.log(`Grade: ${getSoilGrade(analyzed.healthScore)}`);
console.log(`Recommendations:`, analyzed.recommendations);
```

---

## 2️⃣ Fertilizer Recommendations (`useFertilizerRecommendation`)

### Usage
```typescript
import { useFertilizerRecommendation } from "@/hooks/useFertilizerRecommendation";

const {
  getRecommendation,
  getCropSchedule,
  calculateCost,
  getAlternativeProducts
} = useFertilizerRecommendation({ language: "hi" });
```

### Methods

#### `getRecommendation(crop, stage, soilNPK): FertilizerRecommendation`
Get fertilizer recommendation for a specific crop stage.

**Parameters:**
- `crop`: "rice" | "wheat" | "maize" | "potato" | "sugarcane" | "cotton" | "groundnut" | "tomato" | "onion"
- `stage`: "seedling" | "vegetative" | "flowering" | "fruiting" | "maturation"
- `soilNPK`: `{ n: number; p: number; k: number }`

**Returns:**
```typescript
{
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  products: [
    {
      name: string;        // e.g., "Urea (46%)"
      quantity: number;    // kg needed
      costInr: number;
    }
  ];
  estimatedCost: number;  // Total cost in INR
  yield?: number;         // Expected yield increase %
}
```

#### `getCropSchedule(crop): FertilizerRecommendation[]`
Get complete fertilizer schedule for all growth stages.

#### `calculateCost(recommendation): number`
Calculate total fertilizer cost.

#### `getAlternativeProducts(nutrient, quantity): FertilizerProduct[]`
Get alternative fertilizer products for a nutrient.

### Example
```typescript
const soilTest = { n: 280, p: 20, k: 180 };
const recommendation = getRecommendation("rice", "vegetative", soilTest);

console.log(`Apply: ${recommendation.products[0].name}`);
console.log(`Quantity: ${recommendation.products[0].quantity} kg`);
console.log(`Cost: ₹${recommendation.estimatedCost}`);
```

---

## 3️⃣ Water Management (`useWaterManagement`)

### Usage
```typescript
import { useWaterManagement } from "@/hooks/useWaterManagement";

const {
  generateSchedule,
  getIrrigationAdvice,
  calculateWaterSavings,
  getOptimalIrrigationMethod
} = useWaterManagement({ language: "hi" });
```

### Methods

#### `generateSchedule(crop, sowingDate, weather): IrrigationSchedule`
Generate complete irrigation schedule for the season.

**Parameters:**
```typescript
{
  cropType: string;        // Crop name
  sowingDate: string;      // ISO date
  rainfall: number;        // mm
  temperature: number;     // °C
  humidity: number;        // %
  evaporation: number;     // mm (pan evaporation)
  windSpeed: number;       // km/h
}
```

**Returns:**
```typescript
{
  irrigations: [
    {
      daysAfterSowing: number;
      waterRequired: number;  // mm
      method: "flood" | "sprinkler" | "drip";
      duration: number;      // hours
    }
  ];
  waterSavings: number;     // % vs conventional
  costPerHectare: number;   // INR
}
```

#### `getIrrigationAdvice(crop, daysAfterSowing, weather): string`
Get real-time irrigation advice for today.

#### `calculateWaterSavings(conventional, scheduled): number`
Calculate water savings percentage.

#### `getOptimalIrrigationMethod(crop, soilType): string`
Get recommended irrigation method.

### Example
```typescript
const schedule = generateSchedule("rice", "2024-06-01", {
  rainfall: 50,
  temperature: 28,
  humidity: 75,
  evaporation: 5,
  windSpeed: 10
});

console.log(`Irrigations needed: ${schedule.irrigations.length}`);
console.log(`Water savings: ${schedule.waterSavings}%`);
console.log(`Cost: ₹${schedule.costPerHectare}/hectare`);
```

---

## 4️⃣ Plant Disease Identifier (`useDiseaseIdentifier`)

### Usage
```typescript
import { useDiseaseIdentifier } from "@/hooks/useDiseaseIdentifier";

const {
  detectDisease,
  getDiseaseInfo,
  getTreatments,
  isLoading,
  confidence
} = useDiseaseIdentifier({ language: "hi" });
```

### Methods

#### `detectDisease(imageBase64, cropType): Promise<DiseaseDetectionResult>`
Detect disease from leaf image (AI-powered).

**Parameters:**
- `imageBase64`: Base64 encoded image string
- `cropType`: "rice" | "wheat" | "potato" | "maize" | "tomato" | "cotton"

**Returns:**
```typescript
{
  diseaseName: string;
  scientificName: string;
  confidence: number;              // 0-100%
  severity: "mild" | "moderate" | "severe";
  urgency: "low" | "medium" | "high" | "critical";
  treatments: Treatment[];
  preventionMeasures: string[];
  recommendations: string[];
}
```

#### `getDiseaseInfo(diseaseName): DiseaseDatabase | null`
Get detailed disease information.

#### `getTreatments(diseaseName): Treatment[]`
Get all treatment options for a disease.

### Supported Diseases (80+ total)
- **Rice**: Blast, Sheath Blight, Brown Spot
- **Wheat**: Rust, Septoria, Powdery Mildew
- **Potato**: Late Blight, Early Blight, Scab
- **Maize**: Leaf Spot, Stalk Rot, Gray Leaf Spot
- **Tomato**: Early Blight, Late Blight, Leaf Spot
- **Cotton**: Leaf Curl, Bacterial Blight, Wilt

### Example
```typescript
const result = await detectDisease(imageBase64, "tomato");

console.log(`Disease: ${result.diseaseName}`);
console.log(`Confidence: ${result.confidence}%`);
console.log(`Urgency: ${result.urgency}`);
console.log(`Treatment: ${result.treatments[0].name}`);
```

---

## 5️⃣ Loan & Subsidy Tracker (`useLoanTracker`)

### Usage
```typescript
import { useLoanTracker } from "@/hooks/useLoanTracker";

const {
  getAvailableLoans,
  getAvailableSubsidies,
  createApplication,
  trackApplication,
  calculateLoanBenefit,
  getDocumentChecklist
} = useLoanTracker({ state: "Karnataka" });
```

### Methods

#### `getAvailableLoans(state, landArea): LoanScheme[]`
Get available government loans based on eligibility.

**Parameters:**
- `state`: State name
- `landArea`: Farm size in acres

**Returns Array of:**
```typescript
{
  id: string;
  name: string;
  provider: string;
  maxAmount: number;        // INR
  interestRate: number;     // Annual %
  duration: number;         // Years
  subsidyAvailable: boolean;
  subsidyPercentage: number;
  applicationUrl: string;
  approvalTime: string;     // Days
}
```

#### `getAvailableSubsidies(state, crops, landArea): SubsidyScheme[]`
Get applicable government subsidy schemes.

#### `createApplication(schemeId, formData): Promise<LoanApplication>`
Create loan/subsidy application.

#### `trackApplication(applicationRef): Promise<LoanApplication | null>`
Track application status with reference number.

#### `calculateLoanBenefit(principal, rate, duration): { emi, totalPayable, totalInterest }`
Calculate EMI and loan details.

#### `getDocumentChecklist(schemeId): string[]`
Get required documents for a scheme.

### Available Schemes (Real Indian Government Programs)

#### Loans:
1. **PM Kisan Credit Card** - ₹3L, 4% interest
2. **SBI Agri Loan** - ₹10L, 6.5% interest
3. **NABARD AIF** - ₹50L, 5.5% interest
4. **PMMY Mudra Loan** - ₹10L, 3.5% interest

#### Subsidies:
1. **PM KISAN** - ₹6000/year direct cash
2. **Farm Equipment Subsidy** - 50% on equipment
3. **PMKSY Micro Irrigation** - 55% on drip/sprinkler
4. **Organic Farming** - 80% on mulching materials

### Example
```typescript
// Check available loans
const loans = getAvailableLoans("Maharashtra", 2.5);
console.log(`Available loans: ${loans.length}`);

// Calculate EMI
const benefit = calculateLoanBenefit(500000, 6, 3);
console.log(`Monthly EMI: ₹${benefit.emi}`);
console.log(`Total Interest: ₹${benefit.totalInterest}`);

// Get documents
const docs = getDocumentChecklist("pm-kisan-credit");
console.log(`Documents needed:`, docs);
```

---

## 6️⃣ IoT Sensor Integration (`useIoTSensors`)

### Usage
```typescript
import { useIoTSensors } from "@/hooks/useIoTSensors";

const {
  sensors,
  dashboard,
  addSensor,
  removeSensor,
  getLatestReading,
  getAverageReading,
  getActiveAlerts,
  getDashboard
} = useIoTSensors({ pollInterval: 30000 }); // Updates every 30 seconds
```

### Methods

#### `addSensor(sensorData): Promise<Sensor>`
Add new sensor to farm monitoring system.

**Parameters:**
```typescript
{
  name: string;
  type: "temperature" | "humidity" | "soilMoisture" | "pH" | "rainfall" | "light" | "npk";
  location: string;
  connectionType: "wifi" | "bluetooth" | "mqtt" | "http" | "lte";
  warningThreshold: number;
  criticalThreshold: number;
}
```

#### `getSensorData(sensorId, timeRange): SensorReading[]`
Get historical sensor data.

**Parameters:**
- `timeRange`: "1h" | "24h" | "7d" | "30d"

#### `getLatestReading(sensorId): SensorReading | null`
Get latest reading from a sensor.

#### `getAverageReading(sensorType, timeRange): number`
Get average reading for sensor type across all sensors.

#### `getActiveAlerts(): Alert[]`
Get all active sensor alerts.

**Returns:**
```typescript
[
  {
    sensorId: string;
    sensorName: string;
    message: string;
    severity: "warning" | "critical";
  }
]
```

#### `getDashboard(): FarmDashboard | null`
Get complete farm monitoring dashboard.

**Returns:**
```typescript
{
  sensors: Sensor[];
  average: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    pH: number;
    // ... other averages
  };
  status: "healthy" | "warning" | "critical";
  activeAlerts: number;
}
```

### Supported Sensor Types
1. **Temperature** - °C, -20 to 60, optimal 15-35
2. **Humidity** - %, 0-100, optimal 40-80
3. **Soil Moisture** - %, 0-100, optimal 30-70
4. **pH Level** - 0-14, optimal 6.0-7.5
5. **Rainfall** - mm, 0-500
6. **Light Intensity** - lux, 0-100000
7. **NPK Content** - mg/kg, 0-1000

### Supported Protocols
- WiFi (ESP8266, ESP32)
- Bluetooth LE (BLE sensors)
- MQTT (compatible with Blynk, Arduino IoT)
- HTTP/REST APIs
- LTE/4G (for remote areas)

### Example
```typescript
// Add temperature sensor
const tempSensor = await addSensor({
  name: "Field Temperature Sensor",
  type: "temperature",
  location: "North field",
  connectionType: "wifi",
  warningThreshold: 40,
  criticalThreshold: 45
});

// Get latest reading
const latest = getLatestReading(tempSensor.id);
console.log(`Current temp: ${latest?.value}°C`);

// Get dashboard
const dashboard = getDashboard();
console.log(`Farm status: ${dashboard?.status}`);
console.log(`Active alerts: ${dashboard?.activeAlerts}`);
```

### Integration Examples

#### With Blynk IoT Platform
```typescript
// Blynk sends MQTT data → Parse and add to sensor
const blynkReading = async (sensorId, value) => {
  const sensor = sensors.find(s => s.id === sensorId);
  if (sensor) {
    // Update sensor data
  }
};
```

#### With Arduino/ESP8266
```typescript
// Arduino sends data to your backend API
// Your backend calls: addSensor() to register
// Then getSensorData() retrieves readings
```

---

## 🔌 API Integration Summary

### External APIs Used
| Feature | API | Purpose | Required |
|---------|-----|---------|----------|
| Weather | OpenWeatherMap | Real weather for irrigation | No (Uses fallback) |
| Disease ID | TensorFlow.js | On-device ML model | No (Mock available) |
| Soil Data | ICAR Database | Soil recommendations | No (Offline). |
| Loans | Government APIs | Latest scheme info | No (Hardcoded) |
| IoT | Custom MQTT | Sensor data ingestion | Optional |

### No API Key Required
All features work offline with fallbacks. Optional APIs for enhanced features:

```env
# Optional - for better accuracy
VITE_OPENWEATHER_API_KEY=""
VITE_GOOGLE_ML_API_KEY=""
```

---

## 🚀 Getting Started

### 1. Import Hooks
```typescript
import { useSoilHealth } from "@/hooks/useSoilHealth";
import { useFertilizerRecommendation } from "@/hooks/useFertilizerRecommendation";
import { useWaterManagement } from "@/hooks/useWaterManagement";
import { useDiseaseIdentifier } from "@/hooks/useDiseaseIdentifier";
import { useLoanTracker } from "@/hooks/useLoanTracker";
import { useIoTSensors } from "@/hooks/useIoTSensors";
```

### 2. Use in Components
```typescript
const MyComponent = () => {
  const { analyzeSoil } = useSoilHealth();
  const { getRecommendation } = useFertilizerRecommendation();
  
  // Use hooks
};
```

### 3. Save to Database
```typescript
// All hooks support optional Supabase integration
// Uncomment in hooks to enable:
// await supabase.from("soil_tests").insert([analyzedTest]);
```

---

## 📊 Data Models

All data models are TypeScript interfaces defined in each hook file. They follow this pattern:

```typescript
export interface Entity {
  id: string;
  timestamp?: string;
  // ... specific fields
}
```

---

## ⚡ Performance Notes

- Soil analysis: <100ms
- Fertilizer calculation: <50ms
- Disease detection (mock): ~2s (real ML: 5-10s)
- Irrigation schedule: <200ms
- Loan search: <100ms
- Sensor updates: Real-time (configurable interval)

---

## 🐛 Error Handling

```typescript
const { error } = useSoilHealth();

if (error) {
  console.error("Soil analysis failed:", error);
  // Show user-friendly error message
}
```

---

## 📱 Mobile Optimization

All hooks are fully mobile-responsive and optimized for:
- Low bandwidth environments
- Offline-first operation
- Battery efficiency
- Touch interactions

---

## 🔐 Security & Privacy

- No data sent to external servers by default
- All processing done locally/on-device
- Optional cloud storage with encryption
- GDPR compliant (no tracking)

---

*Last Updated: Feb 18, 2026*
*Mitti-Mitra v2.0*
