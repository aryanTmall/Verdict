export interface NormalizedProductSpec {
  brand: string;
  model: string;
  variant?: string;
  ramGb?: number;
  storageGb?: number;
  cpuOrEngine?: string;
  display?: string;
  priceInr?: number;
  priceType: 'retail' | 'msrp' | 'deal' | 'estimated' | 'refurbished';
  canonicalUrl?: string;
  directBuyUrl?: string;
}

export function extractInrPrice(text: string): { price?: number; priceType: NormalizedProductSpec['priceType'] } {
  // Check for Lakhs (e.g. 19.5 lakhs, 19 Lakh, ₹15 Lakhs)
  const lakhMatch = text.match(/(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(?:lakh|lac|lakhs|lacs)/i);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]);
    if (!isNaN(val)) {
      return { price: Math.round(val * 100000), priceType: 'retail' };
    }
  }

  // Check for Crores
  const crMatch = text.match(/(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(?:crore|cr|crores)/i);
  if (crMatch) {
    const val = parseFloat(crMatch[1]);
    if (!isNaN(val)) {
      return { price: Math.round(val * 10000000), priceType: 'retail' };
    }
  }

  // Check for standard INR formatted price (e.g. ₹74,990, Rs 80,000, 75000)
  const inrMatch = text.match(/(?:₹|rs\.?|inr)\s*([\d,]{4,10})/i);
  if (inrMatch) {
    const rawNum = inrMatch[1].replace(/,/g, '');
    const val = parseInt(rawNum, 10);
    if (!isNaN(val) && val > 100) {
      const isDeal = text.toLowerCase().includes('deal') || text.toLowerCase().includes('sale');
      return { price: val, priceType: isDeal ? 'deal' : 'retail' };
    }
  }

  return { priceType: 'estimated' };
}

export function extractHardwareSpecs(snippet: string): { ramGb?: number; storageGb?: number; display?: string } {
  const specs: { ramGb?: number; storageGb?: number; display?: string } = {};

  // RAM matching (e.g. 16GB RAM, 16 GB DDR5, 8GB unified)
  const ramMatch = snippet.match(/(\d{1,2})\s*gb\s*(?:ddr\d|ram|lpddr|unified|memory)?/i);
  if (ramMatch) {
    const gb = parseInt(ramMatch[1], 10);
    if (gb === 4 || gb === 8 || gb === 12 || gb === 16 || gb === 24 || gb === 32 || gb === 64) {
      specs.ramGb = gb;
    }
  }

  // Storage matching (e.g. 512GB SSD, 1TB NVMe, 256 GB)
  const tbMatch = snippet.match(/(\d)\s*tb\s*(?:ssd|storage|nvme|hdd)?/i);
  if (tbMatch) {
    specs.storageGb = parseInt(tbMatch[1], 10) * 1024;
  } else {
    const ssdMatch = snippet.match(/(\d{3,4})\s*gb\s*(?:ssd|storage|nvme|rom)/i);
    if (ssdMatch) {
      specs.storageGb = parseInt(ssdMatch[1], 10);
    }
  }

  // Display gamut or refresh rate (e.g. 100% sRGB, 144Hz, 120Hz OLED)
  const displayParts: string[] = [];
  if (/100%\s*srgb/i.test(snippet)) displayParts.push('100% sRGB');
  if (/oled/i.test(snippet)) displayParts.push('OLED');
  if (/144\s*hz/i.test(snippet)) displayParts.push('144Hz');
  if (/120\s*hz/i.test(snippet)) displayParts.push('120Hz');
  if (/amoled/i.test(snippet)) displayParts.push('AMOLED');

  if (displayParts.length > 0) {
    specs.display = displayParts.join(', ');
  }

  return specs;
}

export function validateRetailUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}
