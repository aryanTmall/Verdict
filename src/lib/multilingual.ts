export interface IndianLanguage {
  code: string;
  name: string;
  nativeName: string;
  isSchedule8: boolean;
  samplePhrase: string;
}

export const INDIAN_LANGUAGES: IndianLanguage[] = [
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", isSchedule8: true, samplePhrase: "मुझे ₹19 लाख के अंदर एक अच्छी फैमिली कार चाहिए।" },
  { code: "en-IN", name: "Indian English", nativeName: "English (IN)", isSchedule8: false, samplePhrase: "I need a car under ₹19 lakhs." },
  { code: "hi-Latn", name: "Hinglish", nativeName: "Hinglish", isSchedule8: false, samplePhrase: "Mujhe 19 lakh ke andar ek acchi car chahiye." },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்", isSchedule8: true, samplePhrase: "எனக்கு ₹19 லட்சத்திற்குள் ஒரு நல்ல கார் வேண்டும்." },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు", isSchedule8: true, samplePhrase: "నాకు ₹19 లక్షల బడ్జెట్‌లో మంచి కారు కావాలి." },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা", isSchedule8: true, samplePhrase: "আমাকে ১৯ লাখ টাকার মধ্যে একটি ভালো গাড়ি দিন।" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी", isSchedule8: true, samplePhrase: "मला १९ लाखांच्या आत एक चांगली गाडी हवी आहे." },
  { code: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી", isSchedule8: true, samplePhrase: "મને ₹19 લાખની અંદર એક સારી કાર જોઈએ છે." },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ", isSchedule8: true, samplePhrase: "ನನಗೆ ₹19 ಲಕ್ಷದೊಳಗೆ ಒಂದು ಒಳ್ಳೆಯ ಕಾರು ಬೇಕು." },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം", isSchedule8: true, samplePhrase: "എനിക്ക് ₹19 ലക്ഷത്തിൽ താഴെ ഒരു നല്ല കാർ വേണം." },
  { code: "pa-IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", isSchedule8: true, samplePhrase: "ਮੈਨੂੰ ₹19 ਲੱਖ ਦੇ ਅੰਦਰ ਇੱਕ ਚੰਗੀ ਕਾਰ ਚਾਹੀਦੀ ਹੈ।" },
  { code: "or-IN", name: "Odia", nativeName: "ଓଡ଼ିଆ", isSchedule8: true, samplePhrase: "ମୋତେ ₹୧୯ ଲକ୍ଷ ଭିତରେ ଗୋଟିଏ ଭଲ କାର ଦରକାର।" },
  { code: "ur-IN", name: "Urdu", nativeName: "اردو", isSchedule8: true, samplePhrase: "مجھے ۱۹ لاکھ کے اندر ایک اچھی گاڑی چاہیے۔" },
  { code: "as-IN", name: "Assamese", nativeName: "অসমীয়া", isSchedule8: true, samplePhrase: "মোক ১৯ লাখ টকাৰ ভিতৰত এখন ভাল গাড়ী লাগে।" },
  { code: "mai-IN", name: "Maithili", nativeName: "मैथिली", isSchedule8: true, samplePhrase: "हमरा १९ लाखक भितर एकटा नीक गाड़ी चाही।" },
  { code: "sat-IN", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", isSchedule8: true, samplePhrase: "ᱤᱧ ᱞᱟᱹᱜᱤᱫ ᱢᱤᱫᱴᱟᱝ ᱱᱟᱯᱟᱭ ᱜᱟᱹᱰᱤ ᱫᱚᱨᱠᱟᱨ᱾" },
  { code: "ks-IN", name: "Kashmiri", nativeName: "کٲشُر", isSchedule8: true, samplePhrase: "میہ چھ ۱۹ لکھن منٛز اکھ اصل گاڑی ضرورتھ۔" },
  { code: "ne-IN", name: "Nepali", nativeName: "नेपाली", isSchedule8: true, samplePhrase: "मलाई १९ लाख भित्र एउटा राम्रो गाडी चाहिन्छ।" },
  { code: "sd-IN", name: "Sindhi", nativeName: "سنڌي", isSchedule8: true, samplePhrase: "مون کي ۱۹ لکن اندر هڪ سٺي ڪار گهرجي." },
  { code: "kok-IN", name: "Konkani", nativeName: "कोंकणी", isSchedule8: true, samplePhrase: "म्हाका १९ लाखां भितर एक बरी गाडी जाय।" },
  { code: "doi-IN", name: "Dogri", nativeName: "डोगरी", isSchedule8: true, samplePhrase: "गी १९ लक्खै दे अंदर इक बढीया गड्डी चाहिदी।" },
  { code: "mni-IN", name: "Manipuri", nativeName: "মৈতৈলোন্", isSchedule8: true, samplePhrase: "ঐঙোন্দা ১৯ লাখকী মনুংদা ফবা গারী অমা পাম্মী।" },
  { code: "brx-IN", name: "Bodo", nativeName: "ब'ड'", isSchedule8: true, samplePhrase: "आंनो १९ लाखनि सिङाव गंसे मोजां गारि नांगौ।" },
  { code: "sa-IN", name: "Sanskrit", nativeName: "संस्कृतम्", isSchedule8: true, samplePhrase: "मह्यम् एकं श्रेष्ठं वाहनम् आवश्यकम् अस्ति।" },
];

/**
 * Detect language script or code from input text
 */
export function detectIndianLanguage(text: string): IndianLanguage {
  const t = text.trim();

  // Devanagari script: Hindi / Marathi / Maithili / Nepali / Konkani / Dogri / Bodo
  if (/[\u0900-\u097F]/.test(t)) {
    if (/आहे|मला|नाही|करायचं/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "mr-IN")!;
    if (/चाही|हमरा|नीक/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "mai-IN")!;
    if (/चाहिन्छ|मलाई|राम्रो/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "ne-IN")!;
    return INDIAN_LANGUAGES.find((l) => l.code === "hi-IN")!;
  }

  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "ta-IN")!;

  // Telugu script
  if (/[\u0C00-\u0C7F]/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "te-IN")!;

  // Bengali / Assamese script
  if (/[\u0980-\u09FF]/.test(t)) {
    if (/লাগে|এখন|মোক/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "as-IN")!;
    return INDIAN_LANGUAGES.find((l) => l.code === "bn-IN")!;
  }

  // Gujarati script
  if (/[\u0A80-\u0AFF]/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "gu-IN")!;

  // Kannada script
  if (/[\u0C80-\u0CFF]/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "kn-IN")!;

  // Malayalam script
  if (/[\u0D00-\u0D7F]/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "ml-IN")!;

  // Gurmukhi script (Punjabi)
  if (/[\u0A00-\u0A7F]/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "pa-IN")!;

  // Odia script
  if (/[\u0B00-\u0B7F]/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "or-IN")!;

  // Arabic / Nastaliq script: Urdu / Kashmiri / Sindhi
  if (/[\u0600-\u06FF]/.test(t)) return INDIAN_LANGUAGES.find((l) => l.code === "ur-IN")!;

  // Hinglish detection (Latin characters containing Hindi phonetic tokens)
  if (/\b(mujhe|chahiye|acha|acchi|hai|karna|hoga|bhi|lekin|lakh|crore|kitna|kaunsa)\b/i.test(t)) {
    return INDIAN_LANGUAGES.find((l) => l.code === "hi-Latn")!;
  }

  // Default to Indian English
  return INDIAN_LANGUAGES.find((l) => l.code === "en-IN")!;
}

/**
 * Generate localized verbal cross-examination summary for text-to-speech output
 */
export function getLocalizedVerbalVerdict(params: {
  productName: string;
  verdictKind: "BUY" | "WAIT" | "AVOID" | "CAUTION";
  priceInr: number;
  keyFinding: string;
  languageCode: string;
}): { speechText: string; language: IndianLanguage } {
  const lang = INDIAN_LANGUAGES.find((l) => l.code === params.languageCode) || INDIAN_LANGUAGES[0];
  const priceFormatted = `₹${params.priceInr.toLocaleString("en-IN")}`;

  let speech = "";

  switch (lang.code) {
    case "hi-IN":
      speech = `${params.productName} के लिए आधिकारिक फैसला: ${
        params.verdictKind === "BUY" ? "खरीदने की सिफारिश" : "सावधानी से खरीदें"
      }। कीमत ${priceFormatted} है। मुख्य निष्कर्ष: ${params.keyFinding}। वास्तविक समीक्षाओं के आधार पर ही निर्णय लें।`;
      break;

    case "hi-Latn":
      speech = `${params.productName} ke liye official verdict: ${
        params.verdictKind === "BUY" ? "Buy Recommendation" : "Buy with Caution"
      }. Effective price ${priceFormatted} hai. Key finding: ${params.keyFinding}. Review receipts check karke hi finalize karein.`;
      break;

    case "ta-IN":
      speech = `${params.productName} க்கான அதிகாரப்பூர்வ தீர்ப்பு: ${
        params.verdictKind === "BUY" ? "வாங்கலாம்" : "எச்சரிக்கையுடன் வாங்கவும்"
      }। விலை ${priceFormatted}. முக்கிய ஆதாரம்: ${params.keyFinding}।`;
      break;

    case "te-IN":
      speech = `${params.productName} కొరకు అధికారిక తీర్పు: ${
        params.verdictKind === "BUY" ? "కొనుగోలు చేయవచ్చు" : "జాగ్రత్తగా కొనండి"
      }। ధర ${priceFormatted}. ముఖ్య గమనిక: ${params.keyFinding}।`;
      break;

    case "bn-IN":
      speech = `${params.productName}-এর জন্য অফিসিয়াল রায়: ${
        params.verdictKind === "BUY" ? "কেনা সুপারিশ" : "সতর্কতার সাথে কিনুন"
      }। মূল্য ${priceFormatted}। মূল ফলাফল: ${params.keyFinding}।`;
      break;

    case "mr-IN":
      speech = `${params.productName} साठी अधिकृत निकाल: ${
        params.verdictKind === "BUY" ? "खरेदी करा" : "काळजीपूर्वक खरेदी करा"
      }। किंमत ${priceFormatted} आहे. मुख्य निरीक्षण: ${params.keyFinding}।`;
      break;

    default: // Indian English
      speech = `Official Verdict for ${params.productName}: ${
        params.verdictKind === "BUY" ? "APPROVED FOR PURCHASE" : "BUY WITH CAUTION"
      }. Evaluated at ${priceFormatted}. Key finding: ${params.keyFinding}. Based strictly on owner receipts.`;
      break;
  }

  return { speechText: speech, language: lang };
}
