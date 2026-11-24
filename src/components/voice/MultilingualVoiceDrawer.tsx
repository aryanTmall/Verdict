"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Languages,
  Sparkles,
  Check,
  AlertCircle,
  Play,
  Square,
} from "lucide-react";
import { INDIAN_LANGUAGES, type IndianLanguage, detectIndianLanguage } from "@/lib/multilingual";

interface MultilingualVoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitVoiceMission: (text: string) => void;
  currentProductName?: string;
}

export function MultilingualVoiceDrawer({
  isOpen,
  onClose,
  onSubmitVoiceMission,
  currentProductName = "Selected Product",
}: MultilingualVoiceDrawerProps) {
  const [selectedLang, setSelectedLang] = useState<IndianLanguage>(INDIAN_LANGUAGES[0]); // Hindi default
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [spokenResponseText, setSpokenResponseText] = useState<string>("");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsListening(false);
      setIsPlayingAudio(false);
    }
  }, [isOpen]);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please type or use sample phrases.");
      return;
    }

    setSpeechError(null);
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang.code;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + " ";
        }
        setTranscript(currentText.trim());

        // Auto-detect language if changed
        const detected = detectIndianLanguage(currentText);
        if (detected.code !== selectedLang.code && detected.code !== "en-IN") {
          setSelectedLang(detected);
        }
      };

      recognition.onerror = (event: any) => {
        setSpeechError(`Voice input issue: ${event.error || "Could not capture clear audio"}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setSpeechError("Microphone startup failed: " + err.message);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Text-To-Speech Playback
  const handlePlayVoiceSummary = async () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    try {
      const res = await fetch("/api/voice/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: currentProductName,
          verdictKind: "CAUTION",
          priceInr: 1870000,
          keyFinding: "Real world mileage drops to 10-11 kmpl in city traffic with AC.",
          languageCode: selectedLang.code,
        }),
      });

      const data = await res.json();
      setSpokenResponseText(data.speechText);

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(data.speechText);
        utterance.lang = selectedLang.code;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsPlayingAudio(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#FBF7EA] border-l-2 border-[#1B1A17] shadow-2xl p-6 flex flex-col justify-between font-mono animate-in slide-in-from-right duration-300">
      <div className="space-y-5 overflow-y-auto pr-1">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1B1A17]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#1B1A17] text-[#F3C94B] rounded">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase text-[#8A8576] tracking-wider">
                MULTILINGUAL INDIAN SPEECH
              </div>
              <h2 className="text-xl font-bold font-display text-[#1B1A17]">
                Voice Case File
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1B1A17]/10 rounded border border-[#1B1A17]/20 cursor-pointer"
          >
            <X className="w-5 h-5 text-[#1B1A17]" />
          </button>
        </div>

        {/* Language Selection */}
        <div className="bg-white border-2 border-[#1B1A17] p-3.5 rounded space-y-2 text-xs">
          <label className="block text-[10px] font-bold text-[#8A8576] uppercase">
            Select Language (All 22 Scheduled Indian Languages + Hinglish)
          </label>
          <select
            value={selectedLang.code}
            onChange={(e) => {
              const found = INDIAN_LANGUAGES.find((l) => l.code === e.target.value);
              if (found) {
                setSelectedLang(found);
                setTranscript(found.samplePhrase);
              }
            }}
            className="w-full bg-[#FBF7EA] border border-[#1B1A17] p-2 rounded font-bold text-[#1B1A17]"
          >
            {INDIAN_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName}) {lang.isSchedule8 ? "· 8th Schedule" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Live Audio Recording Status */}
        <div className="bg-white border-2 border-[#1B1A17] p-5 rounded text-center space-y-3">
          <div className="relative inline-block">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer mx-auto ${
                isListening
                  ? "bg-[#D8381C] text-white animate-pulse"
                  : "bg-[#2540D9] hover:bg-[#1a31b0] text-white"
              }`}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D8381C] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D8381C]" />
              </span>
            )}
          </div>

          <div className="text-xs font-bold text-[#1B1A17]">
            {isListening ? `Listening in ${selectedLang.name}...` : `Click to Speak in ${selectedLang.nativeName}`}
          </div>

          {speechError && (
            <div className="text-[11px] text-[#D8381C] bg-[#D8381C]/10 p-2 rounded border border-[#D8381C]">
              {speechError}
            </div>
          )}
        </div>

        {/* Transcript Box */}
        <div className="bg-white border-2 border-[#1B1A17] p-3.5 rounded space-y-2 text-xs">
          <div className="flex items-center justify-between text-[10px] text-[#8A8576] uppercase font-bold">
            <span>Recognized Transcript Preview</span>
            <span>{selectedLang.code}</span>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={4}
            placeholder={`Speak or type your requirement in ${selectedLang.name}...`}
            className="w-full bg-[#FBF7EA] border border-[#1B1A17]/30 p-2.5 rounded font-display text-sm text-[#1B1A17]"
          />
        </div>

        {/* Quick Sample Phrases */}
        <div className="space-y-1.5 text-xs">
          <div className="text-[10px] text-[#8A8576] uppercase font-bold">Sample Indian Queries</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              "मुझे ₹19 लाख के अंदर एक अच्छी फैमिली कार चाहिए।",
              "Mujhe 19 lakh ke andar car chahiye, on-road price batao.",
              "எனக்கு ₹19 லட்சத்திற்குள் ஒரு நல்ல கார் வேண்டும்.",
              "నాకు ₹19 లక్షల బడ్జెట్‌లో మంచి కారు కావాలి.",
            ].map((phrase, i) => (
              <button
                key={i}
                onClick={() => {
                  setTranscript(phrase);
                  setSelectedLang(detectIndianLanguage(phrase));
                }}
                className="text-[10px] bg-white hover:bg-[#FBF7EA] border border-[#1B1A17]/30 px-2.5 py-1 rounded text-[#1B1A17] cursor-pointer text-left"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Spoken Response Synthesis */}
        <div className="bg-white border border-[#1B1A17]/20 p-3 rounded space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1B1A17]">Verbal Cross-Examination Audio</span>
            <button
              onClick={handlePlayVoiceSummary}
              className="px-2.5 py-1 bg-[#1F6B4F] hover:bg-[#16523c] text-white rounded font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
            >
              {isPlayingAudio ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlayingAudio ? "Stop" : "Play Verdict Voice"}</span>
            </button>
          </div>
          {spokenResponseText && (
            <p className="text-[11px] text-[#8A8576] italic bg-[#FBF7EA] p-2 rounded">
              &ldquo;{spokenResponseText}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t-2 border-[#1B1A17]">
        <button
          onClick={() => {
            if (transcript.trim()) {
              onSubmitVoiceMission(transcript);
              onClose();
            }
          }}
          disabled={!transcript.trim()}
          className="w-full py-3 bg-[#2540D9] hover:bg-[#1a31b0] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Cross-Examination</span>
        </button>
      </div>
    </div>
  );
}
