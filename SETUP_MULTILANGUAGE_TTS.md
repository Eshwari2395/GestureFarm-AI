# Multi-Language Voice Commands Setup Guide

## Overview

The Mitti-Mitra app now supports voice responses in multiple languages:
- **Hindi** (हिंदी)
- **Telugu** (తెలుగు) 
- **English**

## How It Works

The app uses a cascading TTS (Text-to-Speech) system:

### 1. **Primary: Google Cloud Text-to-Speech API** (Optional)
- ✅ Best quality voices
- ✅ Supports 100+ languages
- ✅ Natural sounding Indian voices
- ❌ Requires API key & paid subscription (~$0.004 per 1000 characters)

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Cloud Text-to-Speech API"
4. Create a service account and download JSON key
5. Extract the API key and add to `.env`:
```
VITE_GOOGLE_CLOUD_TTS_API_KEY="your-google-api-key"
```

### 2. **Secondary: Bhashini API** (Free for Indian languages)
- ✅ Free for Hindi, Telugu, etc.
- ✅ Backed by Indian government
- ✅ No API key needed
- ⚠️ Currently uses browser TTS as fallback

**Status:** Integrated (Uses browser TTS as fallback)

### 3. **Tertiary: ElevenLabs API** (Good alternative)
- ✅ Premium quality voices
- ✅ Supports multiple languages
- ❌ Paid ($5-100/month)

**Setup:**
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up and get API key
3. Add to `.env`:
```
VITE_ELEVENLABS_API_KEY="your-elevenlabs-key"
```

### 4. **Fallback: Browser Web Speech API** (Always Available)
- ✅ Completely free
- ✅ Works offline
- ✅ No API key needed
- ⚠️ Quality depends on device/browser
- ⚠️ Requires system language packs installed

## System Language Pack Installation

### Windows (for better Hindi/Telugu voice support)
1. Settings → Time & Language → Language & region
2. Add Hindi and Telugu language packs
3. For Text-to-Speech:
   - Settings → Accessibility → Text-to-speech
   - Download voice packs for Hindi and Telugu

### macOS
1. System Preferences → Siri & Spotlight → Siri Voice
2. Or: System Preferences → Accessibility → Spoken Content
3. Choose additional language voices

### Linux
```bash
# For Ubuntu/Debian
sudo apt-get install language-pack-hi language-pack-te
sudo apt-get install espeak-ng
```

## Using the Feature

1. **Select Language**: Use the language selector in the app (top-right corner)
2. **Show a Gesture**: Point your finger, open palm, make a fist, etc.
3. **Hear Response**: The app will respond in your selected language

### Gesture Commands
- ☝️ **Pointing** → Weather
- 🖐️ **Open Palm** → Crop Growth Tips  
- ✊ **Fist** → Market Prices
- 👍 **Thumbs Up** → Pest Control
- ✌️ **Peace** → Crop Tips

## Testing

Open browser console (F12) and look for:
```
[speakWithBrowserTTS] Speaking in hi
[Voice Selection] Looking for voice for language: hi
🔊 Speaking response with language=hi
```

## Troubleshooting

### "Still hearing English despite selecting Hindi/Telugu"

**Solution 1: Install System Language Packs**
- Windows: Settings → Language packs → Download Hindi/Telugu

**Solution 2: Use Google Cloud TTS API**
- Get API key from Google Cloud Console
- Add to `.env` as shown above

**Solution 3: Use ElevenLabs**
- Get API key from ElevenLabs
- Add to `.env` as shown above

### "No voice found for [language]"

This means your browser doesn't have that language installed. Install the language pack for your operating system.

### "Audio playback failed"

- Check browser console for errors
- Try disabling browser extensions
- Try a different browser (Chrome has best support)

## Cost Comparison

| Service | Cost | Language Support | Quality |
|---------|------|------------------|---------|
| Browser TTS | Free | Depends on OS | Medium |
| Google Cloud | ~$0.004/1K chars | 100+ | High |
| Bhashini | Free | Limited (Indian) | Medium |
| ElevenLabs | $5-100/mo | Multiple | Very High |

## Recommended Setup

For **best experience with Hindi/Telugu**:
1. **Primary**: Google Cloud TTS API (if budget allows)
2. **Secondary**: Browser TTS (with language packs installed)

For **free solution**:
1. Install system language packs
2. Use Browser TTS (automatic fallback)

## Code Changes

The app now uses `useMultiLanguageTTS` hook which:
```typescript
const { speak, stop, isSpeaking, isLoading, error } = useMultiLanguageTTS({
  language: "hi", // or "te", "en"
  onStart: () => console.log("Started"),
  onEnd: () => console.log("Finished"),
  onError: (err) => console.error("Error:", err),
});

// Use it
await speak("नमस्ते!", "hi"); // Hindi
await speak("నమస్కారం!", "te"); // Telugu
```

## Language Codes

- `en` = English (en-IN preferred for Indian English)
- `hi` = Hindi (Devanagari script)
- `te` = Telugu (Telugu script)

## Next Steps

1. Choose your preferred TTS service
2. Get API key if needed
3. Add to `.env`
4. Restart the dev server
5. Test with gestures or voice commands

---

**Questions?** Check the browser console logs for detailed debugging information.
