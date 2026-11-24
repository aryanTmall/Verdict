import { describe, it, expect } from "vitest";
import { verifyQuoteSubstring, verifyDigitGuard, deterministicParseMission } from "./llm";

describe("LLM utilities & guards", () => {
  it("verifies quote substrings strictly and rejects non-substrings", () => {
    const reviews = [
      {
        id: "r1",
        rating: 4,
        body: "Battery backup lasts around 6 hours during full-stack development, not the advertised 12 hours.",
        date: "2026-06-01",
        verified: true,
      },
    ];

    expect(verifyQuoteSubstring("Battery backup lasts around 6 hours", reviews)).toBe(true);
    expect(verifyQuoteSubstring("Battery backup lasts around 15 hours", reviews)).toBe(false);
    expect(verifyQuoteSubstring("Completely fabricated claim", reviews)).toBe(false);
  });

  it("enforces quote length under 25 words", () => {
    const longText = new Array(30).fill("word").join(" ");
    const reviews = [{ id: "r1", rating: 5, body: longText, date: "2026-01-01", verified: true }];
    expect(verifyQuoteSubstring(longText, reviews)).toBe(false);
  });

  it("enforces strict digit guard", () => {
    const allowed = new Set(["75000", "16", "4", "7", "5", "0", "1", "6"]);
    expect(verifyDigitGuard("The price is 75000 with 16GB memory", allowed)).toBe(true);
    expect(verifyDigitGuard("Unexpected metric of 99999", allowed)).toBe(false);
  });

  it("deterministic parser parses budget, years, and engineering workloads", () => {
    const res = deterministicParseMission(
      "I am an engineering student. Need laptop for coding, Android Studio, Docker. Budget ₹75,000 for 4 years."
    );
    expect(res.profile.budgetInr).toBe(75000);
    expect(res.profile.years).toBe(4);
    expect(res.profile.workloads).toContain("android_studio");
    expect(res.profile.workloads).toContain("docker");
    expect(res.profile.minRamGb).toBe(16);
  });

  it("communicates with local Ollama chat API", async () => {
    const { queryOllamaChat } = await import("./llm");
    const reply = await queryOllamaChat("You are a helpful test bot.", "Reply with the single word: READY");
    if (reply) {
      expect(reply.length).toBeGreaterThan(0);
    }
  }, 15000);
});
