export type Language = "en" | "hi" | "te";

export interface TranslationStrings {
  // App
  appName: string;
  appSubtitle: string;
  home: string;
  features: string;
  howItWorks: string;
  about: string;
  exploreFeatures: string;
  aiPoweredCompanion: string;
  liveSupport: string;
  reliableGuidance: string;
  reliableGuidanceText: string;
  localAwareness: string;
  localAwarenessText: string;
  fastActions: string;
  fastActionsText: string;
  gestureFarmTitle: string;
  heroDescription: string;
  voiceCommandsLabel: string;
  gestureControlLabel: string;
  farmInsightsLabel: string;
  
  // Greetings
  greeting: string;
  speakOrGesture: string;
  listening: string;
  understood: string;
  
  // Features
  weather: string;
  weatherSubtitle: string;
  crop: string;
  cropSubtitle: string;
  price: string;
  priceSubtitle: string;
  alert: string;
  alertSubtitle: string;
  pest: string;
  pestSubtitle: string;
  
  // Gestures
  showHand: string;
  thumbsUp: string;
  peaceSign: string;
  fist: string;
  openPalm: string;
  pointing: string;
  
  // Voice
  startListening: string;
  stopListening: string;
  speakNow: string;
  connecting: string;
  
  // Responses
  weatherResponse: string;
  cropResponse: string;
  priceResponse: string;
  alertResponse: string;
  pestResponse: string;
  riceAdvice: string;
  cottonAdvice: string;
  maizeAdvice: string;
  cropWeatherAdvice: string;
  
  // Status
  offlineReady: string;
  loading: string;
  error: string;
  retry: string;
  
  // Camera
  enableCamera: string;
  disableCamera: string;
  cameraOn: string;
  cameraOff: string;
  
  // TTS
  speakAgain: string;
  speaking: string;
  
  // Permissions
  locationPermission: string;
  microphonePermission: string;
  cameraPermission: string;
  
  // Errors
  browserNotSupported: string;
  locationDenied: string;
  weatherError: string;
  offlineCamera: string;
  voiceNetworkError: string;
  voiceMicrophoneDenied: string;
  voiceMicrophoneError: string;
  voiceStartError: string;
  
  // Location
  yourLocation: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    // App
    appName: "GestureFarm-AI",
    appSubtitle: "Turning gestures into farming intelligence",
    home: "Home",
    features: "Features",
    howItWorks: "How it Works",
    about: "About",
    exploreFeatures: "Explore Features",
    aiPoweredCompanion: "AI-powered farming companion",
    liveSupport: "Live support",
    reliableGuidance: "Reliable guidance",
    reliableGuidanceText: "Weather, crop, pest, and land advice in one place.",
    localAwareness: "Local awareness",
    localAwarenessText: "Location-based suggestions for better farm decisions.",
    fastActions: "Fast actions",
    fastActionsText: "Ask once and instantly get the support you need.",
    gestureFarmTitle: "GestureFarm-AI",
    heroDescription: "Turning gestures into farming intelligence.",
    voiceCommandsLabel: "Voice Commands",
    gestureControlLabel: "Gesture Control",
    farmInsightsLabel: "Farm Insights",
    
    // Greetings
    greeting: "Welcome to GestureFarm-AI! 🌾",
    speakOrGesture: "Say: weather, rice, cotton, maize, or market prices",
    listening: "🎤 Listening... speak now...",
    understood: "✅ Understood! Let me help you.",
    
    // Features
    weather: "Weather",
    weatherSubtitle: "Today's forecast",
    crop: "Crop Growth",
    cropSubtitle: "Tips to grow",
    price: "Market Prices",
    priceSubtitle: "E-NAM rates",
    alert: "Alerts",
    alertSubtitle: "Notifications",
    pest: "Pest Control",
    pestSubtitle: "Protect crops",
    
    // Gestures
    showHand: "Show hand",
    thumbsUp: "👍 Thumbs Up = Pest Control",
    peaceSign: "✌️ Two Fingers = Crop Tips",
    fist: "✊ Fist = Market Prices",
    openPalm: "🖐️ Open Palm = Crop Growth",
    pointing: "☝️ One Finger = Weather",
    
    // Voice
    startListening: "Start voice command",
    stopListening: "Stop listening",
    speakNow: "Speak now...",
    connecting: "Connecting...",
    
    // Responses
    weatherResponse: "Today's weather: ☀️ Sunny. Temperature {temp}°C. {rain}% chance of rain.",
    cropResponse: "🌱 Your crops need water every 3 days. Apply organic fertilizer for better growth. Check soil moisture regularly.",
    priceResponse: "💰 Today's wheat price ₹{price}/quintal from E-NAM. Up 2% from yesterday.",
    alertResponse: "🔔 Irrigate tomorrow at 6 AM. Good time to sow seeds.",
    pestResponse: "🐛 Okay! For pest control: Use neem oil spray every 7 days. Remove infected leaves. Set up yellow sticky traps.",
    riceAdvice: "🌾 Rice advice: keep the field evenly moist, avoid standing water after establishment, and watch for stem borer.",
    cottonAdvice: "🌿 Cotton advice: check the underside of leaves for sucking pests, keep weeds controlled, and avoid excess nitrogen.",
    maizeAdvice: "🌽 Maize advice: maintain soil moisture during flowering and check for fall armyworm in the whorl.",
    cropWeatherAdvice: "{crop} advice for {location}: it is {temp}°C with {rain}% rain chance. {advice}",
    
    // Status
    offlineReady: "Offline Ready",
    loading: "Loading...",
    error: "Error occurred",
    retry: "Try again",
    
    // Camera
    enableCamera: "Enable Camera",
    disableCamera: "Disable Camera",
    cameraOn: "Camera On",
    cameraOff: "Camera Off",
    
    // TTS
    speakAgain: "Speak again",
    speaking: "Speaking...",
    
    // Permissions
    locationPermission: "Allow location to get weather for your area",
    microphonePermission: "Allow microphone for voice commands",
    cameraPermission: "Allow camera for hand gestures",
    
    // Errors
    browserNotSupported: "Voice commands not supported in this browser. Try Chrome or Edge.",
    locationDenied: "Location access denied. Using default location.",
    weatherError: "Could not fetch weather. Please try again.",
    offlineCamera: "No internet. Use voice or buttons instead.",
    voiceNetworkError: "Voice service could not connect. Check your internet connection and use Chrome or Edge.",
    voiceMicrophoneDenied: "Microphone access is blocked. Allow microphone access in your browser settings, then try again.",
    voiceMicrophoneError: "The microphone is not available. Check that it is connected and not being used by another app.",
    voiceStartError: "Voice could not start. Click the microphone again and speak after the listening message.",
    
    // Location
    yourLocation: "Your Location",
  },
  
  hi: {
    // App
    appName: "मिट्टी मित्र-AI",
    appSubtitle: "MM-AI • आपका खेती मित्र",
    home: "होम",
    features: "सुविधाएं",
    howItWorks: "यह कैसे काम करता है",
    about: "हमारे बारे में",
    exploreFeatures: "सुविधाएं देखें",
    aiPoweredCompanion: "AI खेती सहायक",
    liveSupport: "लाइव सहायता",
    reliableGuidance: "भरोसेमंद सलाह",
    reliableGuidanceText: "मौसम, फसल, कीट और खेत की सलाह एक ही जगह।",
    localAwareness: "स्थानीय जानकारी",
    localAwarenessText: "बेहतर खेती के फैसलों के लिए स्थान आधारित सुझाव।",
    fastActions: "तेज़ सहायता",
    fastActionsText: "एक बार पूछें और तुरंत जरूरी मदद पाएं।",
    gestureFarmTitle: "जेस्चरफार्म-AI",
    heroDescription: "इशारों को खेती की जानकारी में बदलें।",
    voiceCommandsLabel: "आवाज़ कमांड",
    gestureControlLabel: "इशारा नियंत्रण",
    farmInsightsLabel: "खेत की जानकारी",
    
    // Greetings
    greeting: "नमस्ते किसान भाई! 🙏",
    speakOrGesture: "बोलें: मौसम, धान, कपास, मक्का या मंडी भाव",
    listening: "🎤 सुन रहा हूँ... बोलिए...",
    understood: "✅ समझ गया! मैं आपकी मदद करता हूँ।",
    
    // Features
    weather: "मौसम",
    weatherSubtitle: "आज का मौसम",
    crop: "फसल विकास",
    cropSubtitle: "उगाने की टिप्स",
    price: "मंडी भाव",
    priceSubtitle: "E-NAM दाम",
    alert: "सूचना",
    alertSubtitle: "अलर्ट",
    pest: "कीट नियंत्रण",
    pestSubtitle: "फसल बचाएं",
    
    // Gestures
    showHand: "हाथ दिखाएं",
    thumbsUp: "👍 अंगूठा = कीट नियंत्रण",
    peaceSign: "✌️ दो उंगली = फसल टिप्स",
    fist: "✊ मुट्ठी = मंडी भाव",
    openPalm: "🖐️ हथेली = फसल विकास",
    pointing: "☝️ एक उंगली = मौसम",
    
    // Voice
    startListening: "आवाज़ सुनना शुरू करें",
    stopListening: "सुनना बंद करें",
    speakNow: "अब बोलिए...",
    connecting: "कनेक्ट हो रहा है...",
    
    // Responses
    weatherResponse: "आज का मौसम: ☀️ धूप रहेगी। तापमान {temp}°C। बारिश की संभावना {rain}%।",
    cropResponse: "🌱 फसल को हर 3 दिन पानी दें। जैविक खाद डालें। मिट्टी की नमी जांचें।",
    priceResponse: "💰 आज गेहूं का भाव ₹{price}/क्विंटल E-NAM से। कल से 2% बढ़ा है।",
    alertResponse: "🔔 कल सुबह 6 बजे सिंचाई करें। बीज बोने का सही समय है।",
    pestResponse: "🐛 ठीक है! कीट नियंत्रण: हर 7 दिन नीम का तेल छिड़कें। संक्रमित पत्ते हटाएं। पीले चिपचिपे जाल लगाएं।",
    riceAdvice: "🌾 धान सलाह: खेत में समान नमी रखें, फसल जमने के बाद ज्यादा पानी न भरें और तना छेदक कीट देखें।",
    cottonAdvice: "🌿 कपास सलाह: पत्तियों के नीचे रस चूसने वाले कीट देखें, खरपतवार हटाएं और ज्यादा नाइट्रोजन न दें।",
    maizeAdvice: "🌽 मक्का सलाह: फूल आने के समय मिट्टी में नमी रखें और पत्तियों के बीच फॉल आर्मीवर्म देखें।",
    cropWeatherAdvice: "{location} के लिए {crop} सलाह: तापमान {temp}°C और बारिश की संभावना {rain}% है। {advice}",
    
    // Status
    offlineReady: "ऑफलाइन तैयार",
    loading: "लोड हो रहा है...",
    error: "कुछ गड़बड़ हुई",
    retry: "फिर से कोशिश करें",
    
    // Camera
    enableCamera: "कैमरा चालू करें",
    disableCamera: "कैमरा बंद करें",
    cameraOn: "कैमरा चालू",
    cameraOff: "कैमरा बंद",
    
    // TTS
    speakAgain: "फिर से बोलें",
    speaking: "बोल रहा हूँ...",
    
    // Permissions
    locationPermission: "अपने इलाके का मौसम जानने के लिए लोकेशन दें",
    microphonePermission: "आवाज़ के लिए माइक्रोफोन की अनुमति दें",
    cameraPermission: "हाथ के इशारों के लिए कैमरा की अनुमति दें",
    
    // Errors
    browserNotSupported: "इस ब्राउज़र में आवाज़ काम नहीं करती। Chrome या Edge इस्तेमाल करें।",
    locationDenied: "लोकेशन नहीं मिली। डिफ़ॉल्ट जगह का उपयोग करेंगे।",
    weatherError: "मौसम की जानकारी नहीं मिली। फिर से कोशिश करें।",
    offlineCamera: "इंटरनेट नहीं है। आवाज़ या बटन इस्तेमाल करें।",
    voiceNetworkError: "आवाज़ सेवा से कनेक्शन नहीं हो सका। इंटरनेट जांचें और Chrome या Edge इस्तेमाल करें।",
    voiceMicrophoneDenied: "माइक्रोफोन की अनुमति बंद है। ब्राउज़र सेटिंग में माइक्रोफोन की अनुमति दें और फिर कोशिश करें।",
    voiceMicrophoneError: "माइक्रोफोन उपलब्ध नहीं है। जांचें कि वह जुड़ा है और किसी दूसरे ऐप में उपयोग नहीं हो रहा है।",
    voiceStartError: "आवाज़ शुरू नहीं हो सकी। माइक्रोफोन फिर दबाएं और सुनने का संदेश आने के बाद बोलें।",
    
    // Location
    yourLocation: "आपका स्थान",
  },
  
  te: {
    // App
    appName: "మిట్టి మిత్ర-AI",
    appSubtitle: "MM-AI • మీ వ్యవసాయ మిత్రుడు",
    home: "హోమ్",
    features: "ఫీచర్లు",
    howItWorks: "ఇది ఎలా పనిచేస్తుంది",
    about: "మా గురించి",
    exploreFeatures: "ఫీచర్లు చూడండి",
    aiPoweredCompanion: "AI వ్యవసాయ సహాయకుడు",
    liveSupport: "లైవ్ సహాయం",
    reliableGuidance: "నమ్మకమైన సలహా",
    reliableGuidanceText: "వాతావరణం, పంట, పురుగు మరియు పొలం సలహా ఒకే చోట.",
    localAwareness: "స్థానిక సమాచారం",
    localAwarenessText: "మెరుగైన వ్యవసాయ నిర్ణయాల కోసం ప్రదేశ ఆధారిత సూచనలు.",
    fastActions: "వేగవంతమైన సహాయం",
    fastActionsText: "ఒక్కసారి అడగండి, వెంటనే అవసరమైన సహాయం పొందండి.",
    gestureFarmTitle: "జెస్చర్‌ఫార్మ్-AI",
    heroDescription: "చేతి సంకేతాలను వ్యవసాయ సమాచారంగా మార్చండి.",
    voiceCommandsLabel: "వాయిస్ ఆదేశాలు",
    gestureControlLabel: "సంకేత నియంత్రణ",
    farmInsightsLabel: "పొలం సమాచారం",
    
    // Greetings
    greeting: "నమస్కారం రైతు సోదరా! 🙏",
    speakOrGesture: "చెప్పండి: వాతావరణం, వరి, పత్తి, మొక్కజొన్న లేదా మార్కెట్ ధరలు",
    listening: "🎤 వింటున్నాను... మాట్లాడండి...",
    understood: "✅ అర్థమైంది! నేను మీకు సహాయం చేస్తాను.",
    
    // Features
    weather: "వాతావరణం",
    weatherSubtitle: "ఈరోజు వాతావరణం",
    crop: "పంట పెరుగుదల",
    cropSubtitle: "పెంచే చిట్కాలు",
    price: "మార్కెట్ ధరలు",
    priceSubtitle: "E-NAM రేట్లు",
    alert: "హెచ్చరికలు",
    alertSubtitle: "నోటిఫికేషన్లు",
    pest: "పురుగు నియంత్రణ",
    pestSubtitle: "పంటను కాపాడండి",
    
    // Gestures
    showHand: "చేయి చూపించండి",
    thumbsUp: "👍 బొటనవేలు = పురుగు నియంత్రణ",
    peaceSign: "✌️ రెండు వేళ్లు = పంట చిట్కాలు",
    fist: "✊ పిడికిలి = మార్కెట్ ధరలు",
    openPalm: "🖐️ అరచేయి = పంట పెరుగుదల",
    pointing: "☝️ ఒక వేలు = వాతావరణం",
    
    // Voice
    startListening: "వాయిస్ కమాండ్ ప్రారంభించు",
    stopListening: "వినడం ఆపు",
    speakNow: "ఇప్పుడు మాట్లాడండి...",
    connecting: "కనెక్ట్ అవుతోంది...",
    
    // Responses
    weatherResponse: "ఈరోజు వాతావరణం: ☀️ ఎండ ఉంటుంది। ఉష్ణోగ్రత {temp}°C। వర్షం అవకాశం {rain}%.",
    cropResponse: "🌱 పంటకు ప్రతి 3 రోజులకు నీరు పెట్టండి। సేంద్రియ ఎరువు వాడండి। మట్టి తేమ తనిఖీ చేయండి.",
    priceResponse: "💰 ఈరోజు గోధుమల ధర ₹{price}/క్వింటాల్ E-NAM నుండి। నిన్నటి కంటే 2% పెరిగింది.",
    alertResponse: "🔔 రేపు ఉదయం 6 గంటలకు నీరు పెట్టండి। విత్తనాలు వేయడానికి మంచి సమయం.",
    pestResponse: "🐛 సరే! పురుగు నియంత్రణ: ప్రతి 7 రోజులు వేప నూనె చల్లండి। సోకిన ఆకులు తొలగించండి। పసుపు అంటుకునే ట్రాప్‌లు పెట్టండి.",
    riceAdvice: "🌾 వరి సలహా: పొలంలో సమాన తేమ ఉంచండి, పంట స్థిరపడిన తర్వాత ఎక్కువ నీరు నిల్వ ఉండనివ్వకండి, కాండం తొలిచే పురుగును గమనించండి.",
    cottonAdvice: "🌿 పత్తి సలహా: ఆకుల కింద రసం పీల్చే పురుగులను తనిఖీ చేయండి, కలుపు మొక్కలను తొలగించండి, అధిక నైట్రోజన్ వాడకండి.",
    maizeAdvice: "🌽 మొక్కజొన్న సలహా: పూత దశలో నేల తేమను ఉంచండి, ఆకుల మధ్య ఫాల్ ఆర్మీవార్మ్‌ను తనిఖీ చేయండి.",
    cropWeatherAdvice: "{location} కోసం {crop} సలహా: ఉష్ణోగ్రత {temp}°C, వర్షం అవకాశం {rain}%. {advice}",
    
    // Status
    offlineReady: "ఆఫ్‌లైన్ సిద్ధం",
    loading: "లోడ్ అవుతోంది...",
    error: "లోపం జరిగింది",
    retry: "మళ్ళీ ప్రయత్నించండి",
    
    // Camera
    enableCamera: "కెమెరా ఆన్ చేయండి",
    disableCamera: "కెమెరా ఆఫ్ చేయండి",
    cameraOn: "కెమెరా ఆన్",
    cameraOff: "కెమెరా ఆఫ్",
    
    // TTS
    speakAgain: "మళ్ళీ చెప్పండి",
    speaking: "చెబుతున్నాను...",
    
    // Permissions
    locationPermission: "మీ ప్రాంత వాతావరణం కోసం లొకేషన్ అనుమతించండి",
    microphonePermission: "వాయిస్ కమాండ్ల కోసం మైక్రోఫోన్ అనుమతించండి",
    cameraPermission: "చేతి సంకేతాల కోసం కెమెరా అనుమతించండి",
    
    // Errors
    browserNotSupported: "ఈ బ్రౌజర్‌లో వాయిస్ పని చేయదు। Chrome లేదా Edge వాడండి.",
    locationDenied: "లొకేషన్ అనుమతి లేదు। డిఫాల్ట్ స్థానం వాడుతాము.",
    weatherError: "వాతావరణ సమాచారం రాలేదు। మళ్ళీ ప్రయత్నించండి.",
    offlineCamera: "ఇంటర్నెట్ లేదు. వాయిస్ లేదా బటన్లు వాడండి.",
    voiceNetworkError: "వాయిస్ సేవకు కనెక్ట్ కాలేదు. ఇంటర్నెట్ తనిఖీ చేసి Chrome లేదా Edge వాడండి.",
    voiceMicrophoneDenied: "మైక్రోఫోన్ అనుమతి నిలిపివేయబడింది. బ్రౌజర్ సెట్టింగ్‌లలో అనుమతి ఇచ్చి మళ్లీ ప్రయత్నించండి.",
    voiceMicrophoneError: "మైక్రోఫోన్ అందుబాటులో లేదు. అది కనెక్ట్ అయి ఉందో, మరొక యాప్ వాడటం లేదో తనిఖీ చేయండి.",
    voiceStartError: "వాయిస్ ప్రారంభం కాలేదు. మైక్రోఫోన్‌ను మళ్లీ నొక్కి, వినే సందేశం వచ్చిన తర్వాత మాట్లాడండి.",
    
    // Location
    yourLocation: "మీ స్థానం",
  },
};

// Voice command keywords for each language
export const voiceCommands: Record<Language, Record<string, string[]>> = {
  en: {
    weather: ["weather", "forecast", "rain", "temperature", "sun", "sunny", "hot", "cold"],
    crop: ["crop", "plant", "farm", "farming", "grow", "seed", "water", "irrigation", "growth"],
    price: ["price", "rate", "cost", "market", "sell", "buy", "wheat", "rice", "enam"],
    alert: ["alert", "notification", "remind", "reminder", "warning", "news"],
    pest: ["pest", "insect", "bug", "control", "spray", "neem", "disease", "protect"],
    rice: ["rice", "paddy"],
    cotton: ["cotton"],
    maize: ["maize", "corn"],
  },
  hi: {
    weather: ["मौसम", "मौसम बताओ", "आज का मौसम", "बारिश", "धूप", "तापमान", "गर्मी", "सर्दी", "पानी"],
    crop: ["फसल", "फसल सलाह", "खेती", "पौधा", "बीज", "सिंचाई", "पानी", "उगाना", "विकास"],
    price: ["भाव", "भाव बताओ", "मंडी भाव", "दाम", "कीमत", "मंडी", "बेचना", "गेहूं", "चावल", "रेट", "ईनाम"],
    alert: ["सूचना", "अलर्ट", "याद", "चेतावनी", "खबर", "नोटिफिकेशन"],
    pest: ["कीट", "कीड़ा", "कीट नियंत्रण", "नियंत्रण", "नीम", "स्प्रे", "बीमारी", "बचाव"],
    rice: ["धान", "धान सलाह", "चावल"],
    cotton: ["कपास", "कपास सलाह"],
    maize: ["मक्का", "मक्का सलाह"],
  },
  te: {
    weather: ["వాతావరణం", "వాతావరణం చెప్పు", "ఈరోజు వాతావరణం", "వర్షం", "ఎండ", "ఉష్ణోగ్రత", "వేడి", "చల్లగా"],
    crop: ["పంట", "పంట సలహా", "వ్యవసాయం", "మొక్క", "విత్తనం", "నీరు", "సాగు", "పెరుగుదల"],
    price: ["ధర", "ధర చెప్పు", "మార్కెట్ ధరలు", "రేటు", "ధరలు", "మార్కెట్", "అమ్మకం", "గోధుమలు", "వరి", "ఈనామ్"],
    alert: ["హెచ్చరిక", "నోటిఫికేషన్", "గుర్తు", "వార్త", "సమాచారం"],
    pest: ["పురుగు", "కీటకం", "పురుగు నియంత్రణ", "నియంత్రణ", "వేప", "స్ప్రే", "వ్యాధి", "రక్షణ"],
    rice: ["వరి", "వరి సలహా", "ధాన్యం"],
    cotton: ["పత్తి", "పత్తి సలహా"],
    maize: ["మొక్కజొన్న", "మొక్కజొన్న సలహా"],
  },
};

// Language display names
export const languageNames: Record<Language, string> = {
  en: "EN",
  hi: "हिं",
  te: "తె",
};

// Full language names
export const languageFullNames: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  te: "తెలుగు",
};

// Speech recognition language codes
export const speechLanguageCodes: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
};
