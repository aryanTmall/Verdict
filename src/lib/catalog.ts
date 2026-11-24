import fs from "node:fs";
import path from "node:path";
import type { CatalogItem, ReviewItem } from "../../scripts/derive";

let cachedCatalog: CatalogItem[] | null = null;

export function getCatalog(): CatalogItem[] {
  if (cachedCatalog) return cachedCatalog;
  const filePath = path.join(process.cwd(), "data", "catalog.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Catalog file not found at ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedCatalog = JSON.parse(raw);
  return cachedCatalog!;
}

export function getProductBySlug(slug: string): CatalogItem | undefined {
  const catalog = getCatalog();
  return catalog.find((p) => p.slug === slug);
}

export function getReviewsForProduct(slug: string): ReviewItem[] {
  const filePath = path.join(process.cwd(), "data", "reviews", `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}
