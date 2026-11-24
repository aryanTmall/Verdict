import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { SavedVerdict } from "./types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null;

const LOCAL_VAULT_DIR = path.join(process.cwd(), "data", "vault");

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_VAULT_DIR)) {
    fs.mkdirSync(LOCAL_VAULT_DIR, { recursive: true });
  }
}

export async function saveVerdictToStorage(verdict: SavedVerdict): Promise<{ success: boolean; slug: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.from("verdicts").insert({
        id: verdict.id,
        slug: verdict.slug,
        created_at: verdict.createdAt,
        payload: verdict,
      });
      if (!error) return { success: true, slug: verdict.slug };
      console.warn("Supabase insert failed, falling back to local file storage:", error.message);
    } catch (err) {
      console.warn("Supabase connection error, falling back to local file storage:", err);
    }
  }

  // Fallback to local JSON store
  ensureLocalDir();
  const filePath = path.join(LOCAL_VAULT_DIR, `${verdict.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(verdict, null, 2), "utf-8");
  return { success: true, slug: verdict.slug };
}

export async function getVerdictFromStorage(slug: string): Promise<SavedVerdict | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("verdicts")
        .select("payload")
        .eq("slug", slug)
        .single();
      if (!error && data?.payload) {
        return data.payload as SavedVerdict;
      }
    } catch (err) {
      console.warn("Supabase lookup failed, trying local file store:", err);
    }
  }

  // Fallback to local file store
  ensureLocalDir();
  const filePath = path.join(LOCAL_VAULT_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as SavedVerdict;
  }

  return null;
}

export async function listSavedVerdicts(): Promise<SavedVerdict[]> {
  const results: SavedVerdict[] = [];

  ensureLocalDir();
  const files = fs.readdirSync(LOCAL_VAULT_DIR);
  for (const file of files) {
    if (file.endsWith(".json")) {
      try {
        const raw = fs.readFileSync(path.join(LOCAL_VAULT_DIR, file), "utf-8");
        results.push(JSON.parse(raw));
      } catch {
        // ignore corrupted files
      }
    }
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
