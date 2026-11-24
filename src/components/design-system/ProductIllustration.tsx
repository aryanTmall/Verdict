"use client";

import { useState } from "react";

interface ProductIllustrationProps {
  name: string;
  brand: string;
  category?: string;
  imageUrl?: string;
  className?: string;
}

const KNOWN_CATALOG_SVGS = new Set([
  "acer-aspire-lite-15.svg",
  "acer-nitro-v-15.svg",
  "acer-swift-go-14-oled.svg",
  "apple-airpods-pro-2-usbc.svg",
  "apple-macbook-air-m2-8gb.svg",
  "apple-macbook-air-m3-16gb.svg",
  "apple-macbook-pro-14-m3-pro.svg",
  "asus-rog-zephyrus-g14.svg",
  "asus-tuf-gaming-f15-fx506hf.svg",
  "asus-vivobook-16-x1605va.svg",
  "asus-zenbook-14-oled-ux3405.svg",
  "boat-airdopes-141.svg",
  "dell-g15-5530.svg",
  "dell-inspiron-3530.svg",
  "dell-xps-13-plus.svg",
  "hp-15s-fq5329tu.svg",
  "hp-pavilion-plus-14.svg",
  "hp-victus-15-fb0157ax.svg",
  "infinix-zerobook-13th-gen.svg",
  "lenovo-ideapad-slim-3-15iau7.svg",
  "lenovo-ideapad-slim-5-16iah8.svg",
  "lenovo-loq-15iax9.svg",
  "lenovo-yoga-slim-7x.svg",
  "msi-thin-15-b12uc.svg",
  "nothing-ear-2024.svg",
  "oneplus-buds-pro-2.svg",
  "realme-buds-air-5-pro.svg",
  "samsung-galaxy-book4.svg",
  "sony-wf-1000xm5.svg",
  "xiaomi-notebook-pro-120g.svg",
  "hyundai-creta-sxo-turbo.webp",
  "hyundai-creta-sxo-turbo.jpg",
  "hyundai-creta-sxo-turbo.svg",
  "mahindra-xuv700-ax5-petrol.webp",
  "mahindra-xuv700-ax5-petrol.jpg",
  "mahindra-xuv700-ax5-petrol.svg",
  "tata-harrier-smart-diesel.webp",
  "tata-harrier-smart-diesel.jpg",
  "tata-harrier-smart-diesel.svg",
]);

export function ProductIllustration({
  name,
  brand,
  category = "laptop",
  imageUrl,
  className = "",
}: ProductIllustrationProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // Validate whether imageUrl points to a real available asset
  let isValidImageSource = false;
  if (imageUrl && !imgFailed) {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
      isValidImageSource = true;
    } else if (imageUrl.startsWith("/products/")) {
      const fileName = imageUrl.replace("/products/", "").split("?")[0];
      isValidImageSource =
        KNOWN_CATALOG_SVGS.has(fileName) ||
        /\.(webp|jpg|jpeg|png|svg)$/i.test(fileName);
    } else if (imageUrl.startsWith("/")) {
      isValidImageSource = true;
    }
  }

  const lowerName = name.toLowerCase();
  const lowerCat = (category || "").toLowerCase();
  const combo = `${lowerName} ${lowerCat}`;

  const isCar =
    lowerCat === "car" ||
    lowerCat === "automobile" ||
    lowerCat === "vehicle" ||
    /car|suv|sedan|hatchback|creta|harrier|xuv|venue|ciaz|city|verna|glanza|seltos|nexon|brezza|scorpio|thar|safari|innova|virtus|slavia|kushaq|taigun/i.test(
      combo
    );

  const isBike =
    lowerCat === "bike" ||
    lowerCat === "motorcycle" ||
    lowerCat === "scooter" ||
    /bike|motorcycle|scooter|royalenfield|bullet|classic 350|hunter 350|ktm|duke|yamaha|mt-15|r15|apache|pulsar|activa|jupiter|ola s1/i.test(
      combo
    );

  const isPhone =
    lowerCat === "phone" ||
    lowerCat === "smartphone" ||
    lowerCat === "mobile" ||
    /phone|iphone|galaxy|pixel|oneplus|smartphone|redmi|realme|iqoo/i.test(combo);

  const isEarbuds =
    lowerCat === "earbuds" ||
    lowerCat === "audio" ||
    lowerCat === "tws" ||
    /buds|ear|airpods|airdopes|headphones|earphones/i.test(combo);

  const isTv =
    lowerCat === "tv" ||
    lowerCat === "television" ||
    /tv|television|oled tv|qled/i.test(combo);

  const isSofa =
    lowerCat === "sofa" ||
    lowerCat === "couch" ||
    lowerCat === "furniture" ||
    /sofa|couch|seater|cushion|chesterfield|futon|recliner|furniture|chair|table|bed|mattress/i.test(combo);

  const isWatch =
    lowerCat === "watch" ||
    lowerCat === "smartwatch" ||
    /watch|smartwatch|amazfit|fitbit|apple watch|galaxy watch/i.test(combo);

  const isLaptop =
    lowerCat === "laptop" ||
    lowerCat === "notebook" ||
    lowerCat === "computer" ||
    /laptop|macbook|notebook|zenbook|vivobook|ideapad|thinkpad|yoga|blade|predator|legion|omen|tuf|loq|nitro|victus|aspire|swift/i.test(combo);

  const isGaming =
    lowerName.includes("tuf") ||
    lowerName.includes("loq") ||
    lowerName.includes("nitro") ||
    lowerName.includes("victus") ||
    lowerName.includes("gaming") ||
    lowerName.includes("g15") ||
    lowerName.includes("thin 15") ||
    lowerName.includes("zephyrus");

  const isMacBook = lowerName.includes("macbook");

  // If valid image provided, verified in catalog, and hasn't failed, render it directly
  if (isValidImageSource) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Guaranteed fallback: High-precision Case File vector device/vehicle schematic
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-3 select-none bg-[#F2EBD8] ${className}`}
    >
      <svg
        viewBox="0 0 240 140"
        className="w-full h-full max-h-28 text-[#1B1A17]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isCar ? (
          // ================= CAR / AUTOMOTIVE BLUEPRINT =================
          <g className="mix-blend-multiply">
            {/* Ground line */}
            <line x1="8" y1="102" x2="232" y2="102" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.4" />

            {/* Aerodynamic Car Body Silhouette */}
            <path
              d="M 22 84 L 38 84 C 42 68, 62 68, 66 84 L 174 84 C 178 68, 198 68, 202 84 L 222 84 C 226 84, 230 80, 228 72 L 218 56 C 214 50, 204 46, 186 46 L 150 46 L 110 28 C 102 25, 90 25, 78 28 L 50 46 L 24 54 C 16 56, 12 64, 12 72 L 12 78 C 12 82, 16 84, 22 84 Z"
              fill="#FBF7EA"
              stroke="currentColor"
              strokeWidth="2.5"
            />

            {/* Cabin Glass & Windows */}
            <path
              d="M 54 46 L 80 30 C 88 28, 98 28, 104 30 L 146 46 Z"
              fill="#F2EBD8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line x1="108" y1="30" x2="108" y2="46" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M 150 46 L 182 46 C 194 46, 200 50, 204 56 L 212 66 L 150 66 Z"
              fill="#F2EBD8"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            {/* Front Headlamp Cluster */}
            <polygon points="14,66 26,64 26,72 14,72" fill="#2540D9" />
            {/* Rear Tail Light */}
            <polygon points="226,64 218,64 218,72 226,70" fill="#D8381C" />

            {/* Front Wheel & Alloy Spokes */}
            <circle cx="52" cy="84" r="15" fill="#1B1A17" />
            <circle cx="52" cy="84" r="9" fill="#FBF7EA" stroke="#1B1A17" strokeWidth="2" />
            <circle cx="52" cy="84" r="3" fill="#D8381C" />
            <line x1="52" y1="75" x2="52" y2="93" stroke="#1B1A17" strokeWidth="1.5" />
            <line x1="43" y1="84" x2="61" y2="84" stroke="#1B1A17" strokeWidth="1.5" />

            {/* Rear Wheel & Alloy Spokes */}
            <circle cx="188" cy="84" r="15" fill="#1B1A17" />
            <circle cx="188" cy="84" r="9" fill="#FBF7EA" stroke="#1B1A17" strokeWidth="2" />
            <circle cx="188" cy="84" r="3" fill="#D8381C" />
            <line x1="188" y1="75" x2="188" y2="93" stroke="#1B1A17" strokeWidth="1.5" />
            <line x1="179" y1="84" x2="197" y2="84" stroke="#1B1A17" strokeWidth="1.5" />

            {/* Door Cut Lines & Handle */}
            <line x1="108" y1="46" x2="108" y2="82" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="148" y1="46" x2="148" y2="82" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
            <rect x="116" y="52" width="10" height="2" rx="1" fill="currentColor" />
            <rect x="156" y="52" width="10" height="2" rx="1" fill="currentColor" />

            {/* Brand Specimen Badge on Door */}
            <rect x="108" y="62" width="56" height="15" rx="2" fill="#1B1A17" />
            <text
              x="136"
              y="73"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono), monospace"
              fontSize="8"
              fontWeight="bold"
              fill="#FBF7EA"
            >
              {brand.toUpperCase()}
            </text>
          </g>
        ) : isBike ? (
          // ================= MOTORCYCLE / BIKE BLUEPRINT =================
          <g className="mix-blend-multiply">
            <line x1="15" y1="105" x2="225" y2="105" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.4" />
            {/* Front Wheel */}
            <circle cx="48" cy="86" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="48" cy="86" r="5" fill="#1B1A17" />
            {/* Rear Wheel */}
            <circle cx="192" cy="86" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="192" cy="86" r="5" fill="#1B1A17" />
            {/* Frame & Sculpted Fuel Tank */}
            <path
              d="M 48 86 L 78 38 L 102 32 C 118 32, 134 38, 142 45 L 166 52 L 192 86 L 132 86 L 94 62 Z"
              fill="#FBF7EA"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Engine Block */}
            <rect x="102" y="62" width="38" height="26" rx="4" fill="#1B1A17" />
            <line x1="106" y1="68" x2="136" y2="68" stroke="#FBF7EA" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="106" y1="74" x2="136" y2="74" stroke="#FBF7EA" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="106" y1="80" x2="136" y2="80" stroke="#FBF7EA" strokeWidth="1" strokeOpacity="0.5" />
            {/* Chrome Exhaust Pipe */}
            <path d="M 128 78 L 186 90 L 194 88" stroke="#D8381C" strokeWidth="3.5" fill="none" />
            {/* Handlebars, Fork & Headlamp */}
            <line x1="78" y1="38" x2="72" y2="24" stroke="currentColor" strokeWidth="3" />
            <line x1="66" y1="22" x2="78" y2="26" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="64" cy="34" r="5" fill="#2540D9" />
            {/* Brand on Tank */}
            <text
              x="122"
              y="46"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono), monospace"
              fontSize="8"
              fontWeight="bold"
              fill="currentColor"
            >
              {brand.toUpperCase()}
            </text>
          </g>
        ) : isPhone ? (
          // ================= SMARTPHONE BLUEPRINT =================
          <g className="mix-blend-multiply">
            {/* Phone Outer Chassis */}
            <rect x="75" y="10" width="90" height="120" rx="14" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />
            {/* Display Bezel */}
            <rect x="80" y="15" width="80" height="110" rx="10" fill="#F2EBD8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            {/* Camera Island */}
            <rect x="85" y="20" width="28" height="44" rx="7" fill="#1B1A17" />
            <circle cx="99" cy="30" r="5" fill="#2540D9" />
            <circle cx="99" cy="44" r="5" fill="#2540D9" />
            <circle cx="99" cy="56" r="2.5" fill="#D8381C" />
            {/* Display UI Lines */}
            <line x1="120" y1="30" x2="152" y2="30" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
            <line x1="120" y1="38" x2="146" y2="38" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
            <line x1="88" y1="80" x2="152" y2="80" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
            <line x1="88" y1="88" x2="136" y2="88" stroke="#2540D9" strokeWidth="2" strokeOpacity="0.8" />
            {/* Brand Specimen */}
            <rect x="95" y="100" width="50" height="14" rx="2" fill="#1B1A17" />
            <text
              x="120"
              y="110"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono), monospace"
              fontSize="7.5"
              fontWeight="bold"
              fill="#FBF7EA"
            >
              {brand.toUpperCase()}
            </text>
          </g>
        ) : isEarbuds ? (
          // ================= EARBUDS BLUEPRINT =================
          <g className="mix-blend-multiply">
            <rect x="50" y="40" width="140" height="75" rx="28" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />
            <path d="M50 68 C80 66, 160 66, 190 68" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="120" cy="80" r="3" fill="#1F6B4F" />
            <g transform="translate(15, 15) scale(0.7)">
              <circle cx="65" cy="55" r="16" fill="#F2EBD8" stroke="currentColor" strokeWidth="2.5" />
              <rect x="62" y="65" width="6" height="30" rx="3" fill="#1B1A17" />
            </g>
            <g transform="translate(150, 15) scale(0.7)">
              <circle cx="65" cy="55" r="16" fill="#F2EBD8" stroke="currentColor" strokeWidth="2.5" />
              <rect x="62" y="65" width="6" height="30" rx="3" fill="#1B1A17" />
            </g>
            <text
              x="120"
              y="98"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono), monospace"
              fontSize="10"
              fontWeight="600"
              fill="currentColor"
              letterSpacing="1"
            >
              {brand.toUpperCase()}
            </text>
          </g>
        ) : isSofa ? (
          // ================= SOFA / FURNITURE BLUEPRINT =================
          <g className="mix-blend-multiply">
            {/* Floor Shadow line */}
            <line x1="20" y1="114" x2="220" y2="114" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.4" />

            {/* Tapered Angled Solid Wood Legs */}
            <polygon points="34,96 28,114 33,114 39,96" fill="#1B1A17" />
            <polygon points="82,96 80,114 85,114 87,96" fill="#1B1A17" />
            <polygon points="153,96 155,114 160,114 158,96" fill="#1B1A17" />
            <polygon points="201,96 207,114 212,114 206,96" fill="#1B1A17" />

            {/* Main Structural Frame Base */}
            <rect x="24" y="78" width="192" height="20" rx="4" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />

            {/* Tufted Backrest */}
            <path
              d="M 28 78 L 28 32 C 28 24, 38 20, 48 20 L 192 20 C 202 20, 212 24, 212 32 L 212 78 Z"
              fill="#FBF7EA"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Stitching Vertical Segment Lines */}
            <line x1="88" y1="24" x2="88" y2="76" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" strokeOpacity="0.5" />
            <line x1="152" y1="24" x2="152" y2="76" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" strokeOpacity="0.5" />

            {/* Tufting Buttons */}
            <circle cx="58" cy="40" r="2.5" fill="#1B1A17" />
            <circle cx="120" cy="40" r="2.5" fill="#1B1A17" />
            <circle cx="182" cy="40" r="2.5" fill="#1B1A17" />
            <circle cx="58" cy="56" r="2.5" fill="#1B1A17" />
            <circle cx="120" cy="56" r="2.5" fill="#1B1A17" />
            <circle cx="182" cy="56" r="2.5" fill="#1B1A17" />

            {/* 3 Plump Seat Cushions */}
            <rect x="30" y="66" width="56" height="15" rx="4" fill="#F2EBD8" stroke="currentColor" strokeWidth="2" />
            <rect x="92" y="66" width="56" height="15" rx="4" fill="#F2EBD8" stroke="currentColor" strokeWidth="2" />
            <rect x="154" y="66" width="56" height="15" rx="4" fill="#F2EBD8" stroke="currentColor" strokeWidth="2" />

            {/* Comfortable Rounded Left & Right Armrests */}
            <rect x="18" y="44" width="16" height="40" rx="8" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />
            <rect x="206" y="44" width="16" height="40" rx="8" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />

            {/* Decorative Throw Pillow */}
            <polygon points="36,52 48,56 44,70 32,66" fill="#2540D9" />

            {/* Brand Specimen Badge on Center Rail */}
            <rect x="96" y="82" width="48" height="12" rx="2" fill="#1B1A17" />
            <text
              x="120"
              y="91"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono), monospace"
              fontSize="7"
              fontWeight="bold"
              fill="#FBF7EA"
            >
              {brand.toUpperCase()}
            </text>
          </g>
        ) : isTv ? (
          // ================= TV / DISPLAY BLUEPRINT =================
          <g className="mix-blend-multiply">
            <rect x="26" y="16" width="188" height="104" rx="4" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />
            <rect x="30" y="20" width="180" height="96" rx="2" fill="#F2EBD8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            {/* Dual Stand Legs */}
            <polygon points="56,120 62,120 60,132 50,132" fill="#1B1A17" />
            <polygon points="178,120 184,120 190,132 180,132" fill="#1B1A17" />
            {/* Screen 4K UI Elements */}
            <rect x="36" y="26" width="40" height="12" rx="2" fill="#1B1A17" />
            <text x="56" y="35" textAnchor="middle" fill="#FBF7EA" fontSize="7" fontWeight="bold">4K UHD</text>
            <line x1="36" y1="46" x2="110" y2="46" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
            <line x1="36" y1="54" x2="80" y2="54" stroke="#2540D9" strokeWidth="2" strokeOpacity="0.7" />
            {/* Brand */}
            <rect x="100" y="112" width="40" height="10" rx="1.5" fill="#1B1A17" />
            <text x="120" y="120" textAnchor="middle" fill="#FBF7EA" fontSize="6.5" fontWeight="bold">{brand.toUpperCase()}</text>
          </g>
        ) : !isLaptop ? (
          // ================= UNIVERSAL SPECIMEN BLUEPRINT =================
          <g className="mix-blend-multiply">
            <rect x="35" y="18" width="170" height="98" rx="8" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />
            <rect x="42" y="25" width="156" height="84" rx="6" fill="#F2EBD8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            {/* Precision Crosshairs & Calibrations */}
            <circle cx="120" cy="67" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" strokeOpacity="0.4" />
            <circle cx="120" cy="67" r="14" stroke="#2540D9" strokeWidth="1.5" fill="none" />
            <line x1="85" y1="67" x2="155" y2="67" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="120" y1="35" x2="120" y2="99" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            {/* Status indicators */}
            <circle cx="54" cy="36" r="3" fill="#1F6B4F" />
            <circle cx="64" cy="36" r="3" fill="#2540D9" />
            <circle cx="74" cy="36" r="3" fill="#D8381C" />
            {/* Brand Specimen Stamp */}
            <rect x="85" y="94" width="70" height="16" rx="2" fill="#1B1A17" />
            <text
              x="120"
              y="105"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono), monospace"
              fontSize="8"
              fontWeight="bold"
              fill="#FBF7EA"
            >
              {brand.toUpperCase()}
            </text>
          </g>
        ) : (
          // ================= LAPTOP BLUEPRINT =================
          <g className="mix-blend-multiply">
            <rect x="42" y="14" width="156" height="96" rx="5" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />
            <rect x="48" y="20" width="144" height="84" rx="3" fill="#F2EBD8" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="120" cy="17" r="1.5" fill="currentColor" />
            <line x1="56" y1="32" x2="110" y2="32" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
            <line x1="56" y1="42" x2="140" y2="42" stroke="#2540D9" strokeWidth="2" strokeOpacity="0.8" />
            <line x1="56" y1="52" x2="100" y2="52" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
            <line x1="56" y1="62" x2="155" y2="62" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
            <line x1="56" y1="72" x2="125" y2="72" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
            <rect x="135" y="78" width="50" height="18" rx="2" fill="#1B1A17" />
            <text
              x="160"
              y="90"
              textAnchor="middle"
              fontFamily="var(--font-ibm-plex-mono), monospace"
              fontSize="8"
              fontWeight="bold"
              fill="#FBF7EA"
            >
              {isMacBook ? "APPLE" : isGaming ? "GAMING" : brand.toUpperCase()}
            </text>
            <path d="M18 112 L222 112 L206 126 L34 126 Z" fill="#FBF7EA" stroke="currentColor" strokeWidth="2.5" />
            <path d="M106 112 L134 112" stroke="#2540D9" strokeWidth="3" />
            <rect x="36" y="126" width="16" height="3" rx="1.5" fill="currentColor" />
            <rect x="188" y="126" width="16" height="3" rx="1.5" fill="currentColor" />
          </g>
        )}
      </svg>
      <div className="text-[10px] font-mono text-[#8A8576] tracking-wider uppercase mt-1">
        {brand} ·{" "}
        {isCar
          ? "Automotive Specimen"
          : isBike
          ? "Motorcycle Specimen"
          : isPhone
          ? "Flagship Smartphone"
          : isEarbuds
          ? "True Wireless Audio"
          : isSofa
          ? "Living Room Furniture"
          : isTv
          ? "4K UHD Display"
          : isGaming
          ? "High-Performance Rig"
          : isLaptop
          ? "Ultrabook"
          : `${category.toUpperCase()} Specimen`}
      </div>
    </div>
  );
}
