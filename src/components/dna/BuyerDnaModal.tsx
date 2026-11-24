"use client";

import { useState, useEffect } from "react";
import {
  type BuyerDnaProfile,
  getStoredBuyerDna,
  saveBuyerDna,
  resetBuyerDna,
} from "@/lib/buyer-dna";
import {
  Dna,
  X,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Sliders,
  Plus,
  Trash2,
} from "lucide-react";

interface BuyerDnaModalProps {
  onClose: () => void;
  onDnaSaved?: (dna: BuyerDnaProfile) => void;
}

export function BuyerDnaModal({ onClose, onDnaSaved }: BuyerDnaModalProps) {
  const [dna, setDna] = useState<BuyerDnaProfile>(getStoredBuyerDna());
  const [newBrand, setNewBrand] = useState("");
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    setDna(getStoredBuyerDna());
  }, []);

  const handleSave = () => {
    const updated = saveBuyerDna(dna);
    setSavedAlert(true);
    if (onDnaSaved) onDnaSaved(updated);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    const reset = resetBuyerDna();
    setDna(reset);
    if (onDnaSaved) onDnaSaved(reset);
  };

  const addPreferredBrand = () => {
    if (newBrand.trim() && !dna.preferredBrands.includes(newBrand.trim())) {
      setDna({ ...dna, preferredBrands: [...dna.preferredBrands, newBrand.trim()] });
      setNewBrand("");
    }
  };

  const removePreferredBrand = (brand: string) => {
    setDna({ ...dna, preferredBrands: dna.preferredBrands.filter((b) => b !== brand) });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B1A17]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-mono">
      <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] max-w-2xl w-full p-6 paper-shadow-lg space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#1B1A17]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#1B1A17] text-[#F3C94B] rounded">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8A8576]">
                ADAPTIVE BUYER INTEL
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-[#1B1A17]">
                Personal Buyer DNA
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#1B1A17]/10 rounded border border-[#1B1A17]/30 text-[#1B1A17] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Toggle */}
        <div className="bg-white border-2 border-[#1B1A17] p-4 rounded flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-[#1B1A17]">Enable Adaptive DNA Weighting</div>
            <div className="text-[10px] text-[#8A8576]">
              Calibrates deterministic scoring formulas to your personal risk and longevity habits.
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={dna.isPersonalizationEnabled}
              onChange={(e) => setDna({ ...dna, isPersonalizationEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2540D9]"></div>
          </label>
        </div>

        {/* DNA Preference Matrix */}
        <div className="space-y-4 text-xs">
          {/* Risk Tolerance */}
          <div className="bg-white border border-[#1B1A17]/20 p-4 rounded space-y-2">
            <label className="block text-[11px] font-bold text-[#8A8576] uppercase">
              Risk Tolerance & Quality Gate
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: "CONSERVATIVE_ZERO_DEFECT", label: "Conservative / Zero-Defect", desc: "Prioritizes tested reliability & long warranties" },
                { key: "BALANCED", label: "Balanced Prudence", desc: "Equal weight to features and reliability" },
                { key: "EARLY_ADOPTER", label: "Early Adopter", desc: "Willing to accept teething issues for bleeding-edge tech" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setDna({ ...dna, riskTolerance: opt.key as any })}
                  className={`p-2.5 rounded border text-left transition cursor-pointer ${
                    dna.riskTolerance === opt.key
                      ? "border-[#2540D9] bg-[#2540D9]/10 font-bold text-[#2540D9]"
                      : "border-[#1B1A17]/20 bg-[#FBF7EA] text-[#1B1A17]"
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-[#8A8576] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Longevity Priority */}
          <div className="bg-white border border-[#1B1A17]/20 p-4 rounded space-y-2">
            <label className="block text-[11px] font-bold text-[#8A8576] uppercase">
              Expected Ownership Lifespan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: "MAXIMUM_LIFESPAN", label: "Maximum Lifespan (5+ Yrs)", desc: "Heavy focus on chassis durability and upgradeable memory" },
                { key: "BALANCED_4YEAR", label: "Standard Cycle (3-4 Yrs)", desc: "Standard depreciation horizon" },
                { key: "FREQUENT_UPGRADE", label: "Frequent Cycle (1-2 Yrs)", desc: "Maximizes upfront performance over long-term endurance" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setDna({ ...dna, longevityPriority: opt.key as any })}
                  className={`p-2.5 rounded border text-left transition cursor-pointer ${
                    dna.longevityPriority === opt.key
                      ? "border-[#1F6B4F] bg-[#1F6B4F]/10 font-bold text-[#1F6B4F]"
                      : "border-[#1B1A17]/20 bg-[#FBF7EA] text-[#1B1A17]"
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] text-[#8A8576] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Brands Chips */}
          <div className="bg-white border border-[#1B1A17]/20 p-4 rounded space-y-2">
            <label className="block text-[11px] font-bold text-[#8A8576] uppercase">
              Preferred Trusted Brands
            </label>
            <div className="flex flex-wrap gap-1.5">
              {dna.preferredBrands.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-1 bg-[#FBF7EA] border border-[#1B1A17]/30 text-[#1B1A17] rounded text-xs flex items-center space-x-1.5"
                >
                  <span>{b}</span>
                  <button
                    onClick={() => removePreferredBrand(b)}
                    className="text-[#D8381C] hover:text-black cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2 pt-2">
              <input
                type="text"
                placeholder="Add trusted brand (e.g. Toyota, Canon)..."
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPreferredBrand();
                  }
                }}
                className="flex-1 bg-[#FBF7EA] border border-[#1B1A17] p-1.5 rounded text-xs"
              />
              <button
                type="button"
                onClick={addPreferredBrand}
                className="px-3 py-1.5 bg-[#1B1A17] text-white rounded font-bold text-xs cursor-pointer hover:bg-[#333]"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {savedAlert && (
          <div className="p-3 bg-[#1F6B4F]/10 border border-[#1F6B4F] text-[#1F6B4F] text-xs font-bold rounded flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Buyer DNA Profile saved and calibrated to recommendation matrix!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1B1A17]/20 text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="text-[#D8381C] hover:underline flex items-center space-x-1 cursor-pointer font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Prudence</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#2540D9] hover:bg-[#1a31b0] text-white font-bold uppercase rounded shadow transition cursor-pointer flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save & Calibrate Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
}
