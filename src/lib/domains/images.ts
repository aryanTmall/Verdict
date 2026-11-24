/**
 * Universal Category-Aware Image Intelligence
 * Maps any arbitrary product query or category to verified, high-resolution Unsplash product imagery.
 */

export function getCategoryImage(category: string, title: string = ""): string {
  const text = `${category} ${title}`.toLowerCase();

  // Musical Instruments
  if (/guitar|ukulele|acoustic|electric\s*guitar|bass|fender|yamaha\s*f/i.test(text)) {
    return "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80";
  }
  if (/piano|keyboard\s*piano|synthesizer|casio/i.test(text)) {
    return "https://images.unsplash.com/photo-1520523839898-50712825e617?auto=format&fit=crop&w=800&q=80";
  }
  if (/drum|percussion|cajon/i.test(text)) {
    return "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80";
  }

  // Audio & Acoustics
  if (/headphone|earbud|earphone|headset|airpod|soundbar|speaker|bose|sony\s*wh|sennheiser|audio/i.test(text)) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";
  }
  if (/microphone|mic|podcast|shure|rode/i.test(text)) {
    return "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80";
  }

  // Mobile & Tablets
  if (/phone|smartphone|mobile|iphone|galaxy|android|pixel|oneplus|redmi|realme/i.test(text)) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80";
  }
  if (/tablet|ipad|galaxy\s*tab|surface\s*pro/i.test(text)) {
    return "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80";
  }

  // Two-Wheelers & Cycles
  if (/bike|motorcycle|scooter|two[\s-]*wheeler|bullet|hunter|classic\s*350|activa|ather|ola\s*s1|raider|mt-15/i.test(text)) {
    return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80";
  }
  if (/cycle|bicycle|pedal|cycling|mountain\s*bike|mtb|firefox|hercules|trek/i.test(text)) {
    return "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80";
  }

  // Furniture & Home
  if (/sofa|couch|divan|chesterfield|wakefit\s*napper|sleepyhead/i.test(text)) {
    return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";
  }
  if (/chair|office\s*chair|desk\s*chair|ergonomic\s*chair|gaming\s*chair/i.test(text)) {
    return "https://images.unsplash.com/photo-1580481077195-c8e441999e46?auto=format&fit=crop&w=800&q=80";
  }
  if (/table|desk|dining\s*table|study\s*table/i.test(text)) {
    return "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80";
  }
  if (/bed|mattress|sleeping/i.test(text)) {
    return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80";
  }

  // Footwear & Apparel
  if (/shoe|shoes|sneaker|sneakers|running|footwear|boots|nike|adidas|asics|puma/i.test(text)) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80";
  }
  if (/jacket|coat|hoodie|apparel|shirt|t-shirt|clothing/i.test(text)) {
    return "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80";
  }
  if (/watch|watches|smartwatch|chronograph|seiko|rolex|tissot|apple\s*watch/i.test(text)) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
  }
  if (/perfume|fragrance|cologne|scent|eau\s*de|sauvage|dior|versace/i.test(text)) {
    return "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80";
  }
  if (/sunglasses|glasses|eyewear|spectacles|ray-ban/i.test(text)) {
    return "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80";
  }

  // Computing & Peripherals
  if (/keyboard|keychron|mechanical\s*keyboard|keycaps/i.test(text)) {
    return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80";
  }
  if (/mouse|trackpad|gaming\s*mouse|logitech/i.test(text)) {
    return "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80";
  }
  if (/monitor|display|screen|ultrawide|4k\s*monitor/i.test(text)) {
    return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80";
  }
  if (/laptop|macbook|thinkpad|notebook|zenbook|vivobook/i.test(text)) {
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80";
  }

  // Cameras & Optics
  if (/camera|dslr|mirrorless|lens|photography|sony\s*alpha|canon\s*eos|nikon/i.test(text)) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";
  }
  if (/drone|quadcopter|dji/i.test(text)) {
    return "https://images.unsplash.com/photo-1507582020432-2a3bc418123f?auto=format&fit=crop&w=800&q=80";
  }

  // Bags & Travel
  if (/backpack|bag|luggage|suitcase|duffle|trolley/i.test(text)) {
    return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80";
  }

  // Kitchen & Home Appliances
  if (/espresso|coffee|cafe|barista|cappuccino/i.test(text)) {
    return "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80";
  }
  if (/air\s*fryer|fryer|oven|toaster|microwave/i.test(text)) {
    return "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80";
  }
  if (/blender|mixer|juicer|grinder/i.test(text)) {
    return "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80";
  }
  if (/tv|television/i.test(text)) {
    return "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80";
  }
  if (/air\s*conditioner|ac\b|split\s*ac/i.test(text)) {
    return "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80";
  }
  if (/refrigerator|fridge|chiller/i.test(text)) {
    return "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80";
  }
  if (/washing\s*machine|washer/i.test(text)) {
    return "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80";
  }
  if (/car|creta|harrier|xuv|automobile|suv|sedan/i.test(text)) {
    return "/products/hyundai-creta-sxo-turbo.webp";
  }

  // Premium, clean editorial product presentation fallback (never an industrial factory worker!)
  return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80";
}
