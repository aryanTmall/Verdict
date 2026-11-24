"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Camera, Link2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface IntakeIndexCardProps {
  onAnalyze: (text: string, isDemo?: boolean) => void;
  isLoading: boolean;
}

export function IntakeIndexCard({ onAnalyze, isLoading }: IntakeIndexCardProps) {
  const [missionText, setMissionText] = useState(
    "I am an engineering student. I need a laptop for coding, Android Studio, Docker, college, daily travel and occasional gaming. My budget is ₹75,000 and I want it to last four years."
  );
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Web Speech API
  const handleVoiceToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition is not supported in this browser. Please type your mission.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = voiceLang;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMissionText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setErrorMessage(`Microphone input error: ${event.error || "Could not hear audio"}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setErrorMessage("Failed to start voice recognition: " + err.message);
      setIsListening(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(",")[1];
      try {
        const res = await fetch("/api/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Data, mimeType: file.type }),
        });
        const data = await res.json();
        if (data.productName) {
          setMissionText(
            `Cross-examine the ${data.productName} for my college and development work. Budget ₹75,000 for 4 years.`
          );
        } else {
          setErrorMessage("Could not identify specific catalog product from image. Please describe your purchase.");
        }
      } catch (err) {
        setErrorMessage("Image analysis failed.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLinkSubmit = () => {
    if (!linkInput.trim()) return;
    setMissionText(
      `Cross-examine product from link: ${linkInput.trim()}. I need it for development, coding, and 4 years of college with ₹75,000 budget.`
    );
    setShowLinkModal(false);
    setLinkInput("");
  };

  return (
    <div className="relative mt-6 max-w-3xl w-full mx-auto">
      {/* Decorative Yellow Tape on Top Edge */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#F3C94B] shadow-sm -rotate-1 z-10 select-none pointer-events-none opacity-90 border-l border-r border-[#1B1A17]/20"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 96% 50%, 100% 100%, 0% 100%, 4% 50%)",
        }}
      />

      {/* Index Card Container */}
      <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] p-6 md:p-8 paper-shadow">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1B1A17]/20 text-xs font-mono text-[#8A8576] gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#1B1A17] uppercase tracking-wider">
              EXHIBIT 01: INTAKE STATEMENT
            </span>
            <span className="text-[10px] font-mono text-[#1F6B4F] font-bold px-1.5 py-0.5 rounded bg-white border border-[#1F6B4F]/30 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F6B4F]" />
              <span>LOCAL OLLAMA (LLAMA 3.1)</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onAnalyze(
                  "I am an engineering student. I need a laptop for coding, Android Studio, Docker, college, daily travel and occasional gaming. My budget is ₹75,000 and I want it to last four years.",
                  true
                );
              }}
              className="text-[#2540D9] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Preset Mission (?demo=1)</span>
            </button>
          </div>
        </div>

        {/* Text Area Input */}
        <div className="pt-4">
          <label htmlFor="mission-input" className="sr-only">
            Describe your purchase or ask a question
          </label>
          <textarea
            id="mission-input"
            rows={4}
            value={missionText}
            onChange={(e) => setMissionText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && missionText.trim() && !isLoading) {
                e.preventDefault();
                onAnalyze(missionText);
              }
            }}
            placeholder="Ask anything or describe your purchase (e.g. 'What is the best laptop under 60k for coding and light gaming?', 'MacBook Air vs Vivobook', 'Best ANC earbuds under 10k')..."
            className="w-full bg-transparent resize-none font-display text-base md:text-lg text-[#1B1A17] placeholder:text-[#8A8576] focus:outline-none leading-relaxed border-b border-dashed border-[#1B1A17]/30 pb-3"
          />
        </div>

        {errorMessage && (
          <div className="mt-2 text-xs font-mono text-[#D8381C] flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2">
            {/* Voice Button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition cursor-pointer ${
                isListening
                  ? "bg-[#D8381C] text-white border-[#D8381C] animate-pulse"
                  : "bg-white/80 hover:bg-white text-[#1B1A17] border-[#1B1A17]/30"
              }`}
              title="Speak mission"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListening ? "Listening..." : "Speak"}</span>
            </button>

            {/* Language Toggle for Voice */}
            <button
              type="button"
              onClick={() => setVoiceLang((l) => (l === "en-IN" ? "hi-IN" : "en-IN"))}
              className="text-[11px] font-mono text-[#8A8576] hover:text-[#1B1A17] px-2 py-1 rounded border border-transparent hover:border-[#1B1A17]/20"
              title="Toggle English / Hindi speech recognition"
            >
              [{voiceLang}]
            </button>

            {/* Photo / Screenshot Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/80 hover:bg-white text-[#1B1A17] border border-[#1B1A17]/30 transition cursor-pointer"
              title="Upload product photo or screenshot"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>

            {/* Link Paste Button */}
            <button
              type="button"
              onClick={() => setShowLinkModal(!showLinkModal)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/80 hover:bg-white text-[#1B1A17] border border-[#1B1A17]/30 transition cursor-pointer"
              title="Paste retailer product link"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Paste link</span>
            </button>
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            disabled={isLoading || !missionText.trim()}
            onClick={() => onAnalyze(missionText)}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#2540D9] hover:bg-[#1a31b0] text-white font-mono text-xs md:text-sm font-semibold tracking-wider uppercase shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? "Auditing with AI..." : "Search & Check Purchase"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Link Input Drawer */}
        {showLinkModal && (
          <div className="mt-4 pt-3 border-t border-dashed border-[#1B1A17]/30 flex items-center space-x-2">
            <input
              type="url"
              placeholder="Paste Indian retailer product URL (Amazon.in, Flipkart, Lenovo, Acer)..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="flex-1 bg-white px-3 py-1.5 text-xs font-mono border border-[#1B1A17]/40 rounded focus:outline-none"
            />
            <button
              onClick={handleLinkSubmit}
              className="px-3 py-1.5 bg-[#1B1A17] text-white text-xs font-mono rounded hover:bg-[#333]"
            >
              Apply Link
            </button>
          </div>
        )}

        {/* Category Quickstarts & Search Queries */}
        <div className="mt-4 pt-3 border-t border-[#1B1A17]/10 flex items-center space-x-2 text-xs font-mono text-[#8A8576] flex-wrap gap-y-1">
          <span>Try asking:</span>
          <button
            type="button"
            onClick={() => {
              const q = "Which laptop is best for coding and light gaming around 55k?";
              setMissionText(q);
              onAnalyze(q);
            }}
            className="text-[#1B1A17] hover:text-[#2540D9] underline cursor-pointer"
          >
            Best under ₹55k?
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              const q = "Is MacBook Air M2 good for programming or should I buy Windows?";
              setMissionText(q);
              onAnalyze(q);
            }}
            className="text-[#1B1A17] hover:text-[#2540D9] underline cursor-pointer"
          >
            MacBook vs Windows Dev?
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              const q = "Engineering college student. Android Studio, Docker, daily commute. ₹75,000 budget for 4 years.";
              setMissionText(q);
              onAnalyze(q);
            }}
            className="text-[#1B1A17] hover:text-[#2540D9] underline cursor-pointer"
          >
            Engineering Student (₹75k)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              const q = "Best true wireless earbuds with active noise cancellation under ₹15,000 for gym and flights.";
              setMissionText(q);
              onAnalyze(q);
            }}
            className="text-[#1B1A17] hover:text-[#2540D9] underline cursor-pointer"
          >
            Top ANC Earbuds (₹15k)
          </button>
        </div>
      </div>
    </div>
  );
}
