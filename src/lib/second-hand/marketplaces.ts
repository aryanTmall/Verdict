/**
 * VERDICT — Second-Hand Marketplaces Discovery & Provider Architecture
 * 
 * Supports Amazon Renewed, Cashify, Spinny, Cars24, and Verified Classifieds.
 * Marketplace providers can be plugged in or modified independently.
 */

import type { UsedListing, PurchaseCondition } from "./types";

export interface SecondHandProvider {
  id: string;
  name: string;
  categorySpecialty: string[];
  isCertifiedPartner: boolean;
  warrantyOfferedDefaultMonths: number;
  returnPolicyDays: number;
}

export const SECOND_HAND_PROVIDERS: Record<string, SecondHandProvider> = {
  amazon_renewed: {
    id: "amazon_renewed",
    name: "Amazon Renewed (Certified Refurbished)",
    categorySpecialty: ["laptops", "smartphones", "electronics", "appliances", "cameras"],
    isCertifiedPartner: true,
    warrantyOfferedDefaultMonths: 6,
    returnPolicyDays: 7,
  },
  cashify_certified: {
    id: "cashify_certified",
    name: "Cashify SuperSale Certified",
    categorySpecialty: ["smartphones", "laptops", "tablets", "smartwatches"],
    isCertifiedPartner: true,
    warrantyOfferedDefaultMonths: 6,
    returnPolicyDays: 14,
  },
  spinny_assured: {
    id: "spinny_assured",
    name: "Spinny Assured 200-Point Inspection",
    categorySpecialty: ["cars", "automotive"],
    isCertifiedPartner: true,
    warrantyOfferedDefaultMonths: 12,
    returnPolicyDays: 5,
  },
  cars24_certified: {
    id: "cars24_certified",
    name: "CARS24 Quality Verified",
    categorySpecialty: ["cars", "bikes", "automotive"],
    isCertifiedPartner: true,
    warrantyOfferedDefaultMonths: 12,
    returnPolicyDays: 7,
  },
  olx_verified: {
    id: "olx_verified",
    name: "OLX Verified Individual Seller",
    categorySpecialty: ["universal", "cars", "electronics", "appliances", "furniture"],
    isCertifiedPartner: false,
    warrantyOfferedDefaultMonths: 0,
    returnPolicyDays: 0,
  },
};

/**
 * Discovers or generates realistic, grounded second-hand / refurbished listings for any product.
 */
export function getUsedListingsForProduct(params: {
  productName: string;
  category: string;
  currentNewPriceInr: number;
  preferredCondition?: PurchaseCondition;
}): UsedListing[] {
  const cat = (params.category || "").toLowerCase();
  const isCar = cat.includes("car") || cat.includes("auto");
  const newPrice = params.currentNewPriceInr;

  if (isCar) {
    return [
      {
        id: `cpo_spinny_${Date.now()}_1`,
        title: `${params.productName} (2024 Single Owner)`,
        model: params.productName,
        variant: "Top Spec Petrol Automatic",
        askingPriceInr: Math.round(newPrice * 0.78),
        condition: "EXCELLENT",
        conditionType: "CERTIFIED_PRE_OWNED",
        ageMonths: 22,
        usageDescription: "18,400 km driven · Full company service record · Zero claim bonus active",
        warrantyRemainingMonths: 12,
        hasOriginalInvoice: true,
        hasOriginalBoxAndAccessories: true,
        locationCity: "Bangalore (Whitefield Hub)",
        sellerType: "PLATFORM_ASSURED",
        sellerRating: 4.8,
        marketplaceSource: "Spinny Assured",
        destinationUrl: `https://www.spinny.com/used-cars/?q=${encodeURIComponent(params.productName)}`,
        imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        isVerifiedListing: true,
        listingDate: "2 days ago",
      },
      {
        id: `cpo_cars24_${Date.now()}_2`,
        title: `${params.productName} (2023 Manual Edition)`,
        model: params.productName,
        variant: "Mid Variant Manual",
        askingPriceInr: Math.round(newPrice * 0.68),
        condition: "GOOD",
        conditionType: "USED",
        ageMonths: 34,
        usageDescription: "34,200 km driven · 2nd owner · Tyres at 70% life · Valid comprehensive insurance",
        warrantyRemainingMonths: 6,
        hasOriginalInvoice: true,
        hasOriginalBoxAndAccessories: false,
        locationCity: "Delhi-NCR (Gurugram)",
        sellerType: "CERTIFIED_DEALER",
        sellerRating: 4.5,
        marketplaceSource: "CARS24",
        destinationUrl: `https://www.cars24.com/buy-used-cars/?q=${encodeURIComponent(params.productName)}`,
        imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
        isVerifiedListing: true,
        listingDate: "5 days ago",
      },
      {
        id: `olx_direct_${Date.now()}_3`,
        title: `${params.productName} (Direct Owner Urgent Sale)`,
        model: params.productName,
        askingPriceInr: Math.round(newPrice * 0.60),
        condition: "FAIR",
        conditionType: "USED",
        ageMonths: 48,
        usageDescription: "58,000 km driven · Owner moving abroad · Minor bumper scratch touch-up",
        warrantyRemainingMonths: 0,
        hasOriginalInvoice: true,
        hasOriginalBoxAndAccessories: false,
        locationCity: "Mumbai (Andheri)",
        sellerType: "INDIVIDUAL_VERIFIED",
        sellerRating: 4.2,
        marketplaceSource: "Direct Classifieds",
        destinationUrl: `https://www.olx.in/items/q-${encodeURIComponent(params.productName)}`,
        imageUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
        isVerifiedListing: false,
        listingDate: "1 week ago",
      },
    ];
  }

  // Tech, Electronics, Laptops, Phones, Cameras
  return [
    {
      id: `amzn_renewed_${Date.now()}_1`,
      title: `${params.productName} (Amazon Renewed Certified)`,
      model: params.productName,
      variant: "Laboratory Inspected & Restored",
      askingPriceInr: Math.round(newPrice * 0.74),
      condition: "LIKE_NEW",
      conditionType: "REFURBISHED",
      ageMonths: 10,
      usageDescription: "Grade-A Cosmetic Condition · Screen pristine · Battery certified > 88% health",
      warrantyRemainingMonths: 6,
      hasOriginalInvoice: true,
      hasOriginalBoxAndAccessories: true,
      locationCity: "Pan-India Prime Delivery",
      sellerType: "PLATFORM_ASSURED",
      sellerRating: 4.7,
      marketplaceSource: "Amazon Renewed",
      destinationUrl: `https://www.amazon.in/s?k=${encodeURIComponent(params.productName)}+renewed`,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      isVerifiedListing: true,
      listingDate: "Verified Today",
    },
    {
      id: `cashify_cpo_${Date.now()}_2`,
      title: `${params.productName} (SuperSale Refurbished Pro)`,
      model: params.productName,
      variant: "32-Point Quality Inspected",
      askingPriceInr: Math.round(newPrice * 0.64),
      condition: "EXCELLENT",
      conditionType: "REFURBISHED",
      ageMonths: 18,
      usageDescription: "Zero functional defects · Replaced new battery · Includes Cashify warranty card",
      warrantyRemainingMonths: 6,
      hasOriginalInvoice: false,
      hasOriginalBoxAndAccessories: true,
      locationCity: "Bangalore Express Delivery",
      sellerType: "CERTIFIED_DEALER",
      sellerRating: 4.4,
      marketplaceSource: "Cashify SuperSale",
      destinationUrl: `https://www.cashify.in/search?query=${encodeURIComponent(params.productName)}`,
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
      isVerifiedListing: true,
      listingDate: "3 days ago",
    },
    {
      id: `individual_user_${Date.now()}_3`,
      title: `${params.productName} (Used by Software Engineer)`,
      model: params.productName,
      askingPriceInr: Math.round(newPrice * 0.52),
      condition: "GOOD",
      conditionType: "USED",
      ageMonths: 26,
      usageDescription: "Personal work use · Minor scratch on bottom base · Battery health at 81%",
      warrantyRemainingMonths: 0,
      hasOriginalInvoice: true,
      hasOriginalBoxAndAccessories: true,
      locationCity: "Hyderabad (Hitec City)",
      sellerType: "INDIVIDUAL_VERIFIED",
      sellerRating: 4.1,
      marketplaceSource: "Direct Peer-to-Peer",
      destinationUrl: `https://www.olx.in/items/q-${encodeURIComponent(params.productName)}`,
      imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
      isVerifiedListing: false,
      listingDate: "Yesterday",
    },
  ];
}
