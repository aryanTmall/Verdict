import { SourceTier, SourceType } from './types';

// Known domains mapping to Tiers and SourceTypes
const TIER_1_DOMAINS: Record<string, SourceType> = {
  // Official Tech & Retailers
  'amazon.in': 'retailer',
  'amazon.com': 'retailer',
  'flipkart.com': 'retailer',
  'apple.com': 'official_manufacturer',
  'lenovo.com': 'official_manufacturer',
  'asus.com': 'official_manufacturer',
  'dell.com': 'official_manufacturer',
  'hp.com': 'official_manufacturer',
  'samsung.com': 'official_manufacturer',
  'sony.co.in': 'official_manufacturer',
  'sony.com': 'official_manufacturer',
  'croma.com': 'retailer',
  'reliancedigital.in': 'retailer',
  // Automotive
  'hyundai.com': 'official_manufacturer',
  'tatamotors.com': 'official_manufacturer',
  'marutisuzuki.com': 'official_manufacturer',
  'mahindra.com': 'official_manufacturer',
  'toyotabharat.com': 'official_manufacturer',
  'cardekho.com': 'retailer',
  'carwale.com': 'retailer',
  'bikewale.com': 'retailer',
  // Real Estate
  'rera.karnataka.gov.in': 'official_manufacturer',
  'maharera.mahaonline.gov.in': 'official_manufacturer',
  '99acres.com': 'retailer',
  'magicbricks.com': 'retailer',
  'housing.com': 'retailer',
};

const TIER_2_DOMAINS: Record<string, SourceType> = {
  // Established Tech Publications & Benchmarks
  'notebookcheck.net': 'benchmark',
  'gsmarena.com': 'review_publication',
  'rtings.com': 'benchmark',
  'anandtech.com': 'benchmark',
  'tomshardware.com': 'review_publication',
  'theverge.com': 'review_publication',
  'techradar.com': 'review_publication',
  'engadget.com': 'review_publication',
  'cnet.com': 'review_publication',
  'wired.com': 'review_publication',
  'dpreview.com': 'review_publication',
  'digitalcameraworld.com': 'review_publication',
  'pcmag.com': 'review_publication',
  '9to5mac.com': 'review_publication',
  'androidauthority.com': 'review_publication',
  '91mobiles.com': 'review_publication',
  'gadgets360.com': 'review_publication',
  // Automotive Publications
  'autocarindia.com': 'review_publication',
  'overdrive.in': 'review_publication',
  'zigwheels.com': 'review_publication',
  'motorbeam.com': 'review_publication',
  // Appliances & General
  'consumer-reports.org': 'benchmark',
  'which.co.uk': 'review_publication',
  'nytimes.com': 'review_publication', // Wirecutter
};

const TIER_3_DOMAINS: Record<string, SourceType> = {
  'reddit.com': 'forum_community',
  'old.reddit.com': 'forum_community',
  'team-bhp.com': 'forum_community',
  'xda-developers.com': 'forum_community',
  'head-fi.org': 'forum_community',
  'avforums.com': 'forum_community',
  'quora.com': 'forum_community',
  'stackoverflow.com': 'forum_community',
  'linustechtips.com': 'forum_community',
};

export function extractCanonicalDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    let host = parsed.hostname.toLowerCase();
    if (host.startsWith('www.')) host = host.slice(4);
    return host;
  } catch {
    return 'unknown-source.com';
  }
}

export function classifyDomainTier(domain: string): { tier: SourceTier; sourceType: SourceType } {
  const cleanDomain = domain.toLowerCase().replace(/^www\./, '');

  // Exact or subdomain match for Tier 1
  for (const [t1Domain, type] of Object.entries(TIER_1_DOMAINS)) {
    if (cleanDomain === t1Domain || cleanDomain.endsWith(`.${t1Domain}`)) {
      return { tier: 1, sourceType: type };
    }
  }

  // Exact or subdomain match for Tier 2
  for (const [t2Domain, type] of Object.entries(TIER_2_DOMAINS)) {
    if (cleanDomain === t2Domain || cleanDomain.endsWith(`.${t2Domain}`)) {
      return { tier: 2, sourceType: type };
    }
  }

  // Exact or subdomain match for Tier 3
  for (const [t3Domain, type] of Object.entries(TIER_3_DOMAINS)) {
    if (cleanDomain === t3Domain || cleanDomain.endsWith(`.${t3Domain}`)) {
      return { tier: 3, sourceType: type };
    }
  }

  // Known TLD or keyword indicators
  if (cleanDomain.endsWith('.gov') || cleanDomain.endsWith('.gov.in') || cleanDomain.endsWith('.edu')) {
    return { tier: 1, sourceType: 'official_manufacturer' };
  }

  // Tier 4 general web
  return { tier: 4, sourceType: 'general' };
}
