import { NextResponse } from "next/server";
import { isSafeUrl } from "@/lib/url-validator";

/**
 * Universal Product Link Intelligence Parser
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json({ error: "URL is strictly required." }, { status: 400 });
    }

    if (!isSafeUrl(rawUrl)) {
      return NextResponse.json(
        { error: "Security restriction: Private, internal, or non-HTTP URLs are strictly rejected." },
        { status: 400 }
      );
    }

    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname;

    let productName = "Audited Product";
    let brand = "Manufacturer";
    let category = "electronics";
    let estimatedPriceInr = 75000;

    // Amazon India URL parser
    if (host.includes("amazon.in") || host.includes("amazon.com")) {
      const match = path.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i) || path.match(/\/([^\/]+)\/dp\//i);
      const slugName = match && match[1] && !match[1].match(/^[A-Z0-9]{10}$/)
        ? match[1].replace(/-/g, " ")
        : path.split("/")[1]?.replace(/-/g, " ") || "Amazon Retail Specimen";
      productName = decodeURIComponent(slugName).replace(/\b(ref=|pf_rd_)[^\s]+/gi, "").trim();
      brand = productName.split(" ")[0] || "Amazon Seller";
      estimatedPriceInr = 69990;
    }
    // Flipkart URL parser
    else if (host.includes("flipkart.com")) {
      const slugPart = path.split("/")[1] || "Flipkart Product";
      productName = decodeURIComponent(slugPart).replace(/-/g, " ").trim();
      brand = productName.split(" ")[0] || "Flipkart Seller";
      estimatedPriceInr = 64990;
    }
    // CarWale / CarDekho
    else if (host.includes("carwale.com") || host.includes("cardekho.com")) {
      const segments = path.split("/").filter(Boolean);
      const carModel = segments[segments.length - 1] || segments[0] || "Passenger Vehicle";
      productName = decodeURIComponent(carModel).replace(/-/g, " ").toUpperCase();
      brand = segments[0]?.replace(/-/g, " ") || "Automotive OEM";
      category = "cars";
      estimatedPriceInr = 1870000;
    }
    // General Domain Parser
    else {
      const segments = path.split("/").filter(Boolean);
      const lastSeg = segments[segments.length - 1] || host;
      productName = decodeURIComponent(lastSeg).replace(/[-_]/g, " ").trim();
      brand = host.replace(/^www\./, "").split(".")[0].toUpperCase();
    }

    const suggestedMissionText = `Cross-examine the ${productName} extracted from ${host}. What are its true owner-reported regrets, real running costs, and how does it compare to top alternatives?`;

    return NextResponse.json({
      success: true,
      extractedProduct: {
        name: productName,
        brand,
        category,
        estimatedPriceInr,
        destinationUrl: rawUrl,
        host,
      },
      suggestedMissionText,
    });
  } catch (err: any) {
    console.error("Product link parse error:", err);
    return NextResponse.json({ error: "Failed to parse product link." }, { status: 500 });
  }
}
