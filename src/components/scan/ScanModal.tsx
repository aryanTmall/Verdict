"use client";

import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  Barcode,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Search,
} from "lucide-react";
import type { ScanResult } from "@/lib/scan-service";

interface ScanModalProps {
  onClose: () => void;
  onSelectScannedProduct: (productName: string) => void;
}

export function ScanModal({ onClose, onSelectScannedProduct }: ScanModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "barcode">("upload");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera when camera tab is active
  useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err: any) {
      setCameraError("Camera access denied or unavailable. Please use the image upload tab.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCaptureFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
      executeScan({ imageBase64: base64, mimeType: "image/jpeg" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      executeScan({ imageBase64: base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const executeScan = async (params: { imageBase64?: string; barcode?: string; ocrText?: string; mimeType?: string }) => {
    setScanning(true);
    setScanResult(null);

    try {
      const res = await fetch("/api/products/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data: ScanResult = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B1A17]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-mono">
      <div className="bg-[#FBF7EA] border-2 border-[#1B1A17] rounded-[4px] max-w-2xl w-full p-6 paper-shadow-lg space-y-5 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1B1A17]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#2540D9] text-white rounded">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8A8576]">
                OPTICAL IDENTIFICATION & BARCODE LOOKUP
              </div>
              <h2 className="text-xl font-bold font-display text-[#1B1A17]">
                VERDICT Scan Anything
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

        {/* Input Method Tabs */}
        <div className="flex space-x-2 text-xs border-b border-[#1B1A17]/20 pb-2">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1.5 rounded font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              activeTab === "upload"
                ? "bg-[#1B1A17] text-white"
                : "bg-white border border-[#1B1A17]/20 text-[#1B1A17]"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => setActiveTab("camera")}
            className={`px-3 py-1.5 rounded font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              activeTab === "camera"
                ? "bg-[#1B1A17] text-white"
                : "bg-white border border-[#1B1A17]/20 text-[#1B1A17]"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => setActiveTab("barcode")}
            className={`px-3 py-1.5 rounded font-bold cursor-pointer transition flex items-center space-x-1.5 ${
              activeTab === "barcode"
                ? "bg-[#1B1A17] text-white"
                : "bg-white border border-[#1B1A17]/20 text-[#1B1A17]"
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>Barcode / GTIN</span>
          </button>
        </div>

        {/* Tab 1: Upload Zone */}
        {activeTab === "upload" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#1B1A17]/40 bg-white hover:bg-[#FBF7EA] p-8 rounded text-center cursor-pointer transition space-y-2"
          >
            <Upload className="w-8 h-8 text-[#8A8576] mx-auto" />
            <div className="text-xs font-bold text-[#1B1A17]">
              Click to upload product photo, screenshot, or packaging label
            </div>
            <div className="text-[10px] text-[#8A8576]">Supports JPG, PNG, WEBP up to 10MB</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Tab 2: Live Camera Feed */}
        {activeTab === "camera" && (
          <div className="space-y-3">
            {cameraError ? (
              <div className="bg-[#D8381C]/10 border border-[#D8381C] p-4 rounded text-xs text-[#D8381C]">
                {cameraError}
              </div>
            ) : (
              <div className="relative rounded overflow-hidden border-2 border-[#1B1A17] bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-dashed border-[#F3C94B]/60 m-8 pointer-events-none rounded" />
              </div>
            )}

            <button
              onClick={handleCaptureFromCamera}
              disabled={!cameraActive || scanning}
              className="w-full py-2.5 bg-[#2540D9] hover:bg-[#1a31b0] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Capture & Identify Specimen</span>
            </button>
          </div>
        )}

        {/* Tab 3: Barcode / GTIN */}
        {activeTab === "barcode" && (
          <div className="bg-white border-2 border-[#1B1A17] p-5 rounded space-y-3 text-xs">
            <label className="block text-[11px] font-bold text-[#8A8576] uppercase">
              Enter Barcode (EAN-13, UPC, or Serial Number)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. 8901030889123"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="flex-1 bg-[#FBF7EA] border border-[#1B1A17] p-2.5 rounded font-mono font-bold"
              />
              <button
                onClick={() => executeScan({ barcode: barcodeInput })}
                disabled={!barcodeInput.trim() || scanning}
                className="px-4 py-2.5 bg-[#1B1A17] text-white font-bold uppercase rounded cursor-pointer transition hover:bg-[#333]"
              >
                Lookup
              </button>
            </div>
            <p className="text-[10px] text-[#8A8576]">
              Instantly resolves official GS1 manufacturer catalog metadata and direct retailer links.
            </p>
          </div>
        )}

        {/* Scanning Spinner */}
        {scanning && (
          <div className="p-6 bg-white border border-[#1B1A17]/20 rounded text-center space-y-2 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-[#2540D9] mx-auto" />
            <div className="font-bold text-[#1B1A17]">Running Neural Visual Cross-Examination...</div>
            <div className="text-[10px] text-[#8A8576]">Extracting geometry, logos, model text, and pricing history</div>
          </div>
        )}

        {/* Scan Result Dossier */}
        {scanResult && (
          <div className="bg-white border-2 border-[#1B1A17] p-5 rounded space-y-4 text-xs animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1B1A17]/10 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#8A8576] font-bold">
                  {scanResult.scanMethod.replace(/_/g, " ")}
                </span>
                <h3 className="text-lg font-bold font-display text-[#1B1A17]">
                  {scanResult.identifiedProductName}
                </h3>
              </div>

              <div className="flex items-center space-x-1.5 bg-[#1F6B4F]/10 text-[#1F6B4F] px-2.5 py-1 rounded border border-[#1F6B4F] font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{Math.round(scanResult.confidence * 100)}% Match Confidence</span>
              </div>
            </div>

            {/* Attributes tags */}
            <div className="flex flex-wrap gap-1.5">
              {scanResult.detectedAttributes.map((attr, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[#FBF7EA] border border-[#1B1A17]/20 text-[#1B1A17] text-[10px] rounded font-semibold"
                >
                  ✓ {attr}
                </span>
              ))}
            </div>

            {/* Pricing & Decision Strip */}
            <div className="bg-[#FBF7EA] p-3 rounded border border-[#1B1A17]/15 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-[#8A8576]">Estimated Retail Median</div>
                <div className="text-base font-bold font-display text-[#1B1A17]">
                  ₹{scanResult.scannedProductSummary.estimatedRetailPriceInr.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onSelectScannedProduct(scanResult.identifiedProductName);
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#2540D9] hover:bg-[#1a31b0] text-white font-bold rounded cursor-pointer transition shadow flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cross-Examine This Product</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
