/**
 * VERDICT — Affiliate Revenue & Purchase Link Abstraction Layer
 * 
 * CORE ARCHITECTURAL INVARIANT:
 * Affiliate commissions must NEVER affect product scores, rankings,
 * Best Overall selection, Best Value selection, or risk assessments.
 * An affiliate link is an exit monetization attribute — NOT a ranking attribute.
 */

export interface AffiliatePartnerConfig {
  partnerId: string;
  name: string;
  domainMatch: string[];
  paramKey: string;
  trackingTag: string;
  campaignParam?: string;
  isActive: boolean;
}

export const AFFILIATE_PARTNERS: Record<string, AffiliatePartnerConfig> = {
  amazon_in: {
    partnerId: "amazon_in",
    name: "Amazon India Associates",
    domainMatch: ["amazon.in", "amzn.to", "amzn.in"],
    paramKey: "tag",
    trackingTag: "verdict-in-21",
    campaignParam: "ascsubtag",
    isActive: true,
  },
  flipkart: {
    partnerId: "flipkart",
    name: "Flipkart Affiliate Program",
    domainMatch: ["flipkart.com", "dl.flipkart.com"],
    paramKey: "affid",
    trackingTag: "verdictaff",
    campaignParam: "affExtParam1",
    isActive: true,
  },
  croma: {
    partnerId: "croma",
    name: "Croma Retail Affiliate",
    domainMatch: ["croma.com"],
    paramKey: "utm_source",
    trackingTag: "verdict_intelligence",
    isActive: true,
  },
  carwale: {
    partnerId: "carwale",
    name: "CarWale Lead Partner Network",
    domainMatch: ["carwale.com", "cardekho.com"],
    paramKey: "partner",
    trackingTag: "verdict_auto",
    isActive: true,
  },
};

export const MONETIZATION_DISCLOSURE =
  "VERDICT may earn an affiliate commission if you purchase through certain verified partner links. In accordance with our Trust-First Charter, commercial relationships strictly NEVER influence our deterministic scores, ranking order, or Best Overall verdicts.";

export interface TrackedPurchaseLink {
  originalUrl: string;
  destinationUrl: string;
  retailerName: string;
  hasAffiliateTracking: boolean;
  trackingTag?: string;
  campaignSource: string;
  disclosure: string;
}

/**
 * Builds an affiliate-tracked destination URL preserving URL integrity and query strings.
 */
export function buildTrackedPurchaseLink(params: {
  rawUrl: string;
  retailer?: string;
  productName?: string;
  campaignSource?: string;
}): TrackedPurchaseLink {
  const rawUrl = (params.rawUrl || "").trim();
  const campaign = params.campaignSource || "verdict_buyer_intelligence";

  if (!rawUrl || rawUrl.startsWith("#") || rawUrl.startsWith("javascript:")) {
    return {
      originalUrl: rawUrl,
      destinationUrl: rawUrl,
      retailerName: params.retailer || "Retailer",
      hasAffiliateTracking: false,
      campaignSource: campaign,
      disclosure: MONETIZATION_DISCLOSURE,
    };
  }

  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();

    let matchedPartner: AffiliatePartnerConfig | undefined;
    for (const partner of Object.values(AFFILIATE_PARTNERS)) {
      if (partner.isActive && partner.domainMatch.some((d) => host.includes(d))) {
        matchedPartner = partner;
        break;
      }
    }

    if (!matchedPartner) {
      // Append standard non-affiliate UTM analytics
      parsed.searchParams.set("utm_source", "verdict");
      parsed.searchParams.set("utm_medium", "buyer_intelligence");
      parsed.searchParams.set("utm_campaign", campaign);

      return {
        originalUrl: rawUrl,
        destinationUrl: parsed.toString(),
        retailerName: params.retailer || host.replace(/^www\./, "").split(".")[0].toUpperCase(),
        hasAffiliateTracking: false,
        campaignSource: campaign,
        disclosure: MONETIZATION_DISCLOSURE,
      };
    }

    // Attach verified partner tracking parameter
    parsed.searchParams.set(matchedPartner.paramKey, matchedPartner.trackingTag);
    if (matchedPartner.campaignParam) {
      parsed.searchParams.set(matchedPartner.campaignParam, campaign);
    }
    parsed.searchParams.set("utm_source", "verdict");
    parsed.searchParams.set("utm_medium", "buyer_intelligence");

    return {
      originalUrl: rawUrl,
      destinationUrl: parsed.toString(),
      retailerName: params.retailer || matchedPartner.name,
      hasAffiliateTracking: true,
      trackingTag: matchedPartner.trackingTag,
      campaignSource: campaign,
      disclosure: MONETIZATION_DISCLOSURE,
    };
  } catch {
    // Return original if malformed
    return {
      originalUrl: rawUrl,
      destinationUrl: rawUrl,
      retailerName: params.retailer || "Retail Partner",
      hasAffiliateTracking: false,
      campaignSource: campaign,
      disclosure: MONETIZATION_DISCLOSURE,
    };
  }
}
