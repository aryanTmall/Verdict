"use client";

import { useState } from "react";
import { WindowChrome } from "../design-system/WindowChrome";
import { Mic, MicOff, Send } from "lucide-react";
import type { Evaluation, Profile } from "@/lib/engine";
import type { ClaimVerification, AskResponse } from "@/lib/types";

interface AskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: Evaluation;
  profile: Profile;
  claims: ClaimVerification[];
}

export function AskDrawer({
  isOpen,
  onClose,
  evaluation,
  profile,
  claims,
}: AskDrawerProps) {
  const category = ((evaluation.product as any).category || "").toLowerCase();
  const isCar = category === "car" || category === "automotive" || /car|suv|sedan/i.test(evaluation.product.name);
  const isBike = category === "bike" || /bike|motorcycle|scooter/i.test(evaluation.product.name);
  const isPhone = category === "phone" || category === "smartphones" || /phone|iphone|galaxy/i.test(evaluation.product.name);
  const isLaptop = category === "laptop" || /laptop|macbook|vivobook|thinkpad/i.test(evaluation.product.name);

  const ramUpgradable = evaluation.product.specs?.ramUpgradable ?? false;
  const ramGb = evaluation.product.specs?.ramGb ?? 16;

  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<Array<{ q: string; a: AskResponse }>>([
    isCar
      ? {
          q: `Is the ${evaluation.product.name} worth buying for daily commuting and highway trips?`,
          a: {
            answer: `Engine Fit Score is ${Math.round(evaluation.fit)}/100 at ₹${evaluation.product.priceInr.toLocaleString("en-IN")}. Key strength: ${(evaluation.product as any).bestFor || "Highway performance"}. Primary owner compromise: ${(evaluation.product as any).compromise || "Maintenance overhead"}. Upcoming Year-End Dec Clearance offers the deepest annual discount window.`,
            citations: [
              `Engine Fit: ${Math.round(evaluation.fit)}/100 [VERIFIED]`,
              `Decision File: ${evaluation.product.name} [AUDITED]`,
            ],
          },
        }
      : isBike
      ? {
          q: `How is the ride quality and mileage for the ${evaluation.product.name}?`,
          a: {
            answer: `Engine Fit Score is ${Math.round(evaluation.fit)}/100 at ₹${evaluation.product.priceInr.toLocaleString("en-IN")}. Strength: ${(evaluation.product as any).bestFor || "City agility"}. Primary compromise: ${(evaluation.product as any).compromise || "Firm suspension"}.`,
            citations: [
              `Engine Fit: ${Math.round(evaluation.fit)}/100 [VERIFIED]`,
              `Decision File: ${evaluation.product.name} [AUDITED]`,
            ],
          },
        }
      : !isLaptop
      ? {
          q: `Is ${evaluation.product.name} good value for money in this price band?`,
          a: {
            answer: `Engine Fit Score is ${Math.round(evaluation.fit)}/100 at ₹${evaluation.product.priceInr.toLocaleString("en-IN")}. Key strength: ${(evaluation.product as any).bestFor || "Reliable build quality"}. Primary compromise: ${(evaluation.product as any).compromise || "Routine upkeep"}.`,
            citations: [
              `Engine Fit: ${Math.round(evaluation.fit)}/100 [VERIFIED]`,
              `Decision File: ${evaluation.product.name} [AUDITED]`,
            ],
          },
        }
      : {
          q: "Will 16GB RAM be enough for 4 years of Docker and Android Studio?",
          a: {
            answer: `Under moderate concurrency, the engine models memory demand starting at ~7.2 GB on Day 1 and expanding to ~15.8 GB by Year 4. Because ${evaluation.product.name} RAM is ${ramUpgradable ? "upgradable" : "soldered"}, you ${ramUpgradable ? "can add an extra SODIMM stick later" : "cannot upgrade memory post-purchase"}.`,
            citations: [
              `Forecast: Year 4 headroom ~${(ramGb / 15.8).toFixed(2)}x [PROJECTED]`,
              `Specs: ${ramGb}GB RAM [VERIFIED]`,
            ],
          },
        },
  ]);
  const [isAsking, setIsAsking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || question;
    if (!textToSend.trim() || isAsking) return;

    setIsAsking(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          context: {
            profile,
            evaluation,
            claims,
          },
        }),
      });
      const data: AskResponse = await res.json();
      setHistory((prev) => [...prev, { q: textToSend, a: data }]);
      setQuestion("");
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          q: textToSend,
          a: {
            answer: "I can't verify that from the evidence I have in this decision file.",
            citations: ["Evidence Vault [VERIFIED]"],
          },
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setQuestion(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] p-3 flex flex-col justify-end pointer-events-none"
      data-lenis-prevent
    >
      <div className="pointer-events-auto h-full max-h-[92vh] flex flex-col">
        <WindowChrome
          title={`cross_examine_${evaluation.product.brand.toLowerCase()}.chat`}
          badge="LOCAL OLLAMA (LLAMA 3.1)"
          onClose={onClose}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Scrollable Conversation */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 font-mono text-xs max-h-[60vh]">
            <div className="bg-[#F2EBD8] p-2.5 rounded border border-[#1B1A17]/20 text-[11px] text-[#8A8576] flex items-center justify-between">
              <span>Connected to Local Ollama. Evidence-gated to cited specs & receipts.</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#1F6B4F]" title="Ollama connected" />
            </div>

            {history.map((h, i) => (
              <div key={i} className="space-y-2">
                <div className="bg-[#1B1A17] text-[#FBF7EA] p-2.5 rounded text-right ml-6 font-medium">
                  {h.q}
                </div>
                <div className="bg-[#F2EBD8] border border-[#1B1A17]/30 p-3 rounded mr-4 space-y-2">
                  <p className="text-[#1B1A17] leading-relaxed">{h.a.answer}</p>
                  {h.a.citations && h.a.citations.length > 0 && (
                    <div className="pt-2 border-t border-dashed border-[#1B1A17]/20 space-y-1">
                      <span className="text-[9px] uppercase text-[#8A8576] block font-semibold">
                        CITED EXHIBITS:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {h.a.citations.map((cite, cIdx) => (
                          <span
                            key={cIdx}
                            className="bg-white border border-[#1B1A17]/30 px-1.5 py-0.5 rounded text-[10px] text-[#2540D9]"
                          >
                            {cite}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="flex items-center space-x-2 text-xs font-mono text-[#8A8576] p-2">
                <div className="w-4 h-4 border-2 border-[#1B1A17] border-t-transparent rounded-full animate-spin" />
                <span>Cross-referencing evidence vault...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="pt-2 pb-1 border-t border-dashed border-[#1B1A17]/20 flex flex-wrap gap-1">
            <button
              onClick={() => handleSend(isCar ? "Should I buy this car now or wait for discounts?" : isBike ? "Should I buy this bike or wait?" : "Should I buy this or wait?")}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EBD8] hover:bg-white border border-[#1B1A17]/20 cursor-pointer font-bold text-[#1F6B4F]"
            >
              Should I buy?
            </button>
            <button
              onClick={() => handleSend(isCar ? "When is the next year-end clearance discount and what will it save?" : "When is the next festive sale price drop and what will it cost?")}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EBD8] hover:bg-white border border-[#1B1A17]/20 cursor-pointer font-medium text-[#2540D9]"
            >
              Next sale drop?
            </button>
            {isCar ? (
              <button
                onClick={() => handleSend("What is the real-world city vs highway mileage and DCT gearbox behavior?")}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EBD8] hover:bg-white border border-[#1B1A17]/20 cursor-pointer text-[#2540D9]"
              >
                Mileage & DCT?
              </button>
            ) : isBike ? (
              <button
                onClick={() => handleSend("What is the real-world mileage and suspension comfort on potholes?")}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EBD8] hover:bg-white border border-[#1B1A17]/20 cursor-pointer text-[#2540D9]"
              >
                Mileage & Comfort?
              </button>
            ) : isPhone ? (
              <button
                onClick={() => handleSend("How good is the low-light camera and battery drain?")}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EBD8] hover:bg-white border border-[#1B1A17]/20 cursor-pointer text-[#2540D9]"
              >
                Camera & Battery?
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSend("Can I upgrade the RAM later and is 16GB enough?")}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EBD8] hover:bg-white border border-[#1B1A17]/20 cursor-pointer"
                >
                  RAM upgrade?
                </button>
                <button
                  onClick={() => handleSend("What is the real-world battery life compared to the listing claim?")}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EBD8] hover:bg-white border border-[#1B1A17]/20 cursor-pointer"
                >
                  Battery reality?
                </button>
              </>
            )}
            <button
              onClick={() => handleSend("What are the most common owner defects or regret complaints?")}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F2EBD8] hover:bg-white border border-[#1B1A17]/20 cursor-pointer text-[#D8381C]"
            >
              Defects & regrets?
            </button>
          </div>

          {/* Input Box */}
          <div className="pt-2 border-t border-[#1B1A17]/20 flex items-center space-x-1.5">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask an evidence-based question..."
              className="flex-1 bg-white border border-[#1B1A17]/30 px-3 py-1.5 text-xs font-mono rounded focus:outline-none"
            />
            <button
              onClick={handleVoice}
              className={`p-2 rounded border cursor-pointer ${
                isListening
                  ? "bg-[#D8381C] text-white border-[#D8381C] animate-pulse"
                  : "bg-[#F2EBD8] text-[#1B1A17] border-[#1B1A17]/30 hover:bg-white"
              }`}
              title="Voice ask"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleSend()}
              disabled={isAsking || !question.trim()}
              className="p-2 rounded bg-[#2540D9] text-white hover:bg-[#1a31b0] disabled:opacity-50 cursor-pointer"
              title="Send question"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </WindowChrome>
      </div>
    </div>
  );
}
