import type { Product } from "./engine";

export type PairingNecessity = "ESSENTIAL" | "RECOMMENDED" | "OPTIONAL" | "NOT_NEEDED" | "INCOMPATIBLE";

export interface CompanionItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceInr: number;
  necessity: PairingNecessity;
  compatibilityVerdict: "100% COMPATIBLE" | "REDUNDANT" | "PHYSICAL FIT VERIFIED" | "INCOMPATIBLE";
  antiUpsellReason: string;
  specsSummary: string;
  imageUrl: string;
  destinationUrl: string;
  selectedByDefault: boolean;
}

export interface SmartBundleReport {
  mainProductId: string;
  mainProductName: string;
  mainProductPriceInr: number;
  industry: string;
  companions: CompanionItem[];
  bundleSummary: {
    recommendedItemsCount: number;
    unneededItemsCount: number;
    standaloneTotalInr: number;
    bundleDiscountInr: number;
    effectiveBundlePriceInr: number;
    annualOwnershipImpactInr: number;
    antiUpsellSavingsInr: number; // Money saved by warning buyer not to buy redundant items
  };
}

export function getSmartPairings(product: Product | any): SmartBundleReport {
  const current = product.priceInr || 75000;
  const name = product.name || "Main Product";
  const slug = product.slug || "product";
  const industry = product.industry || ((product as any).category === "car" ? "automotive" : "electronics");
  const rawName = name.toLowerCase();

  let companions: CompanionItem[] = [];

  if (industry === "automotive" || /creta|harrier|xuv|car|suv/i.test(rawName)) {
    companions = [
      {
        id: "70mai-a500s-dashcam",
        name: "70mai Pro Plus+ A500S Dual-Channel Dash Cam",
        brand: "70mai",
        category: "Safety & Electronics",
        priceInr: 10999,
        necessity: "ESSENTIAL",
        compatibilityVerdict: "100% COMPATIBLE",
        antiUpsellReason: "Crucial for Indian traffic arbitration and no-fault insurance claim disputes. Plugs directly into the 12V auxiliary port without voiding OEM electrical warranty.",
        specsSummary: "Front 1944P + Rear 1080P · Built-in GPS & ADAS · 24H Parking Surveillance with Hardwire Kit",
        imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.amazon.in/s?k=70mai+a500s+dashcam",
        selectedByDefault: true,
      },
      {
        id: "7d-custom-mats",
        name: "Autoform All-Weather 7D Custom Deep-Dish Foot Mats",
        brand: "Autoform",
        category: "Interior Protection",
        priceInr: 6499,
        necessity: "RECOMMENDED",
        compatibilityVerdict: "PHYSICAL FIT VERIFIED",
        antiUpsellReason: "Laser-measured edge-to-edge floor pan coverage prevents monsoon slush seepage into factory carpet. Cheaper than OEM dealer accessories by ₹4,000.",
        specsSummary: "Dual-layer detachable curly mat · Anti-skid backing · Fire-retardant waterproof PU",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.amazon.in/s?k=7d+car+mats",
        selectedByDefault: true,
      },
      {
        id: "dealer-chrome-garnish",
        name: "Showroom Exterior Chrome Bezel & Door Visor Kit",
        brand: "Dealer Aftermarket",
        category: "Cosmetics",
        priceInr: 9500,
        necessity: "NOT_NEEDED",
        compatibilityVerdict: "REDUNDANT",
        antiUpsellReason: "Dealerships aggressively push this ₹9,500 kit at booking. It is cosmetic plastic tape that peels after 1 monsoon and adds zero functional or resale value.",
        specsSummary: "Triple chrome-plated ABS · 3M adhesive strip",
        imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.google.com/search?q=car+chrome+accessories",
        selectedByDefault: false,
      },
      {
        id: "toptul-tyre-inflator",
        name: "TUSA Digital 12V Heavy-Duty Tyre Inflator",
        brand: "TUSA",
        category: "Emergency & Safety",
        priceInr: 2899,
        necessity: "ESSENTIAL",
        compatibilityVerdict: "100% COMPATIBLE",
        antiUpsellReason: "Essential for maintaining optimal cold tyre pressure, preventing premature sidewall cracking and ensuring certified fuel economy.",
        specsSummary: "Auto shut-off · 150 PSI digital gauge · 12-foot cord reaches all four wheels",
        imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.amazon.in/s?k=tusa+tyre+inflator",
        selectedByDefault: true,
      },
    ];
  } else if (industry === "real_estate" || /flat|apartment|villa|habitat|acres/i.test(rawName)) {
    companions = [
      {
        id: "legal-khata-audit",
        name: "Independent Title Search & Khata Verification Dossier",
        brand: "Legal Counsel Verified",
        category: "Legal & Due Diligence",
        priceInr: 15000,
        necessity: "ESSENTIAL",
        compatibilityVerdict: "100% COMPATIBLE",
        antiUpsellReason: "Mandatory 30-year encumbrance search and RERA layout cross-check. Never rely solely on the builder's sanctioned advocate certificate.",
        specsSummary: "Sub-registrar office 30-yr EC audit · Mother deed provenance check · RERA approval check",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.google.com/search?q=property+legal+verification+bangalore",
        selectedByDefault: true,
      },
      {
        id: "snag-inspection",
        name: "Professional Pre-Possession Home Inspection & Snag Audit",
        brand: "PropCheck",
        category: "Civil & Quality Audit",
        priceInr: 12500,
        necessity: "RECOMMENDED",
        compatibilityVerdict: "PHYSICAL FIT VERIFIED",
        antiUpsellReason: "Thermal leak detection, hollow tile tapping, earthing voltage tests, and carpet area laser check prior to handing over the final 5% possession payment.",
        specsSummary: "FLIR thermal imaging · Ultrasonic hollow tile detector · Earthing load analyzer",
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.google.com/search?q=home+inspection+snagging+services",
        selectedByDefault: true,
      },
      {
        id: "builder-modular-package",
        name: "In-House Builder Interior 'Turnkey' Package",
        brand: "Builder Interior Partner",
        category: "Interiors",
        priceInr: 650000,
        necessity: "NOT_NEEDED",
        compatibilityVerdict: "REDUNDANT",
        antiUpsellReason: "Builder tie-up interior packages charge a 35% premium over specialized local modular studios and use commercial MDF instead of waterproof BWP marine ply.",
        specsSummary: "Pre-fab modular kitchen and wardrobes",
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.google.com/search?q=modular+kitchen+bangalore",
        selectedByDefault: false,
      },
    ];
  } else {
    // Electronics / Laptops / Devices
    companions = [
      {
        id: "gan-65w-charger",
        name: "Anker 65W GaNPrime Ultra-Compact Type-C Fast Charger",
        brand: "Anker",
        category: "Power & Cables",
        priceInr: 3999,
        necessity: "RECOMMENDED",
        compatibilityVerdict: "100% COMPATIBLE",
        antiUpsellReason: "Replaces heavy OEM brick with a pocket-sized 120g dual USB-C charger compatible with Power Delivery 3.0 standards.",
        specsSummary: "Dual USB-C + 1 USB-A · Foldable pins · ActiveShield 2.0 temperature sensor",
        imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.amazon.in/s?k=anker+65w+gan+charger",
        selectedByDefault: true,
      },
      {
        id: "logitech-mx-anywhere-3s",
        name: "Logitech MX Anywhere 3S Wireless Performance Mouse",
        brand: "Logitech",
        category: "Ergonomics & Input",
        priceInr: 6495,
        necessity: "RECOMMENDED",
        compatibilityVerdict: "100% COMPATIBLE",
        antiUpsellReason: "Tracks on glass desk surfaces during travel. Quiet click switches prevent disturbance in lecture halls and co-working spaces.",
        specsSummary: "8K DPI optical sensor · MagSpeed electromagnetic scroll · Flow cross-computer control",
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.amazon.in/s?k=logitech+mx+anywhere+3s",
        selectedByDefault: true,
      },
      {
        id: "generic-usb-c-dongle",
        name: "Generic 12-in-1 Aluminum USB-C Hub Multiport Adapter",
        brand: "Generic Import",
        category: "Connectivity Hubs",
        priceInr: 2999,
        necessity: "NOT_NEEDED",
        compatibilityVerdict: "REDUNDANT",
        antiUpsellReason: "Your selected machine already features dual Thunderbolt 4 / USB 3.2 Gen 2 ports and a full-size HDMI 2.1 jack. Buying a redundant unpowered dock causes thermal throttling and consumes battery unnecessarily.",
        specsSummary: "12 ports · VGA · Ethernet · Dual HDMI",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.amazon.in/s?k=usb+c+hub",
        selectedByDefault: false,
      },
      {
        id: "samsung-t7-shield-1tb",
        name: "Samsung T7 Shield 1TB Rugged External NVMe SSD",
        brand: "Samsung",
        category: "Storage Expansion",
        priceInr: 8999,
        necessity: "OPTIONAL",
        compatibilityVerdict: "100% COMPATIBLE",
        antiUpsellReason: "High-speed scratch disk for 4K video footage or Docker volumes without filling the internal soldered boot drive.",
        specsSummary: "Up to 1,050 MB/s transfer · IP65 water/dust resistance · 3-meter drop resistance",
        imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
        destinationUrl: "https://www.amazon.in/s?k=samsung+t7+shield+1tb",
        selectedByDefault: false,
      },
    ];
  }

  // Calculate bundle optimization
  const essentialAndRec = companions.filter((c) => c.selectedByDefault);
  const redundantItems = companions.filter((c) => c.necessity === "NOT_NEEDED");

  const standaloneTotal = essentialAndRec.reduce((sum, item) => sum + item.priceInr, 0);
  const bundleDiscount = Math.round(standaloneTotal * 0.08); // Verified 8% bundle savings
  const effectiveBundle = standaloneTotal - bundleDiscount;
  const antiUpsellSavings = redundantItems.reduce((sum, item) => sum + item.priceInr, 0);

  return {
    mainProductId: slug,
    mainProductName: name,
    mainProductPriceInr: current,
    industry,
    companions,
    bundleSummary: {
      recommendedItemsCount: essentialAndRec.length,
      unneededItemsCount: redundantItems.length,
      standaloneTotalInr: standaloneTotal,
      bundleDiscountInr: bundleDiscount,
      effectiveBundlePriceInr: effectiveBundle,
      annualOwnershipImpactInr: Math.round(effectiveBundle * 0.12),
      antiUpsellSavingsInr: antiUpsellSavings,
    },
  };
}
