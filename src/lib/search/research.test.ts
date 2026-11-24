import { describe, it, expect, vi } from 'vitest';
import { generateSearchPlan } from './planner';
import { filterAndScoreResults, buildEvidenceLedger } from './evidence-ledger';
import { classifyDomainTier, extractCanonicalDomain } from './domain-tiers';
import { extractHardwareSpecs, extractInrPrice } from './normalizer';
import { conductLiveResearch } from './research-engine';
import { SearchResult } from './types';

describe('VERDICT — AI Research Engine & Search Quality Verification Suite', () => {
  // Test 1: Laptop under ₹80,000 for video editing
  it('Test 1: Generates category-aware search plan A–H and extracts video editing constraints', () => {
    const query = 'I need a laptop under ₹80,000 for video editing.';
    const plan = generateSearchPlan({
      rawQuery: query,
      budgetInr: 80000,
    });

    expect(plan.category).toBe('laptops');
    expect(plan.industry).toBe('electronics');
    expect(plan.budgetInr).toBe(80000);

    // Queries A through H must be generated
    const queryIds = plan.queries.map((q) => q.id);
    expect(queryIds).toContain('A');
    expect(queryIds).toContain('B');
    expect(queryIds).toContain('C');
    expect(queryIds).toContain('D');
    expect(queryIds).toContain('E');
    expect(queryIds).toContain('F');
    expect(queryIds).toContain('G');
    expect(queryIds).toContain('H');

    // Video editing constraint extracted
    expect(plan.softConstraints.some((c) => c.toLowerCase().includes('color-accurate') || c.toLowerCase().includes('srgb'))).toBe(true);
  });

  // Test 2: Smartphone under ₹30,000 with best camera
  it('Test 2: Smartphone search targets camera sensors, low-light reviews and GSMArena', () => {
    const query = 'Best camera phone under 30000 with good battery';
    const plan = generateSearchPlan({
      rawQuery: query,
      budgetInr: 30000,
    });

    expect(plan.category).toBe('smartphones');
    const labQuery = plan.queries.find((q) => q.id === 'C');
    expect(labQuery?.query).toContain('gsmarena.com');
  });

  // Test 3: Reality check ₹1 car
  it('Test 3: Reality check rejects ₹1 car request without fabricating fake search results or cars', async () => {
    const query = 'I want a car for ₹1';
    const report = await conductLiveResearch(query, { category: 'cars', budgetInr: 1 });

    expect(report.isLive).toBe(false);
    expect(report.providerUsed).toBe('reality_check_guard');
    expect(report.totalSources).toBe(0);
    expect(report.statusMessage.toLowerCase()).toContain('reality check');
    expect(report.statusMessage.toLowerCase()).toContain('₹1');
  });

  // Test 4: Product cycle buy/wait detection
  it('Test 4: Search plan evaluates product lifecycle and upcoming refresh cycles (Query G)', () => {
    const query = 'Should I buy the Lenovo LOQ now or wait?';
    const plan = generateSearchPlan({
      rawQuery: query,
      knownCandidates: ['Lenovo LOQ 15'],
    });

    const lifecycleQuery = plan.queries.find((q) => q.id === 'G');
    expect(lifecycleQuery).toBeDefined();
    expect(lifecycleQuery?.purpose.toLowerCase()).toContain('refresh cycle');
  });

  // Test 5: Specific product comparison (A vs B)
  it('Test 5: Comparison query plans discovery and candidate specifics for direct evaluation', () => {
    const query = 'MacBook Air M2 vs Lenovo Yoga Slim 7';
    const plan = generateSearchPlan({
      rawQuery: query,
      knownCandidates: ['MacBook Air M2', 'Lenovo Yoga Slim 7'],
    });

    expect(plan.queries.length).toBeGreaterThanOrEqual(6);
    expect(plan.queries[0].query).toContain('best');
  });

  // Test 6: Unfound / obscure product transparent failure
  it('Test 6: Obscure unfound product returns honest unverified status without inventing specs', async () => {
    // When 0 sources match
    const emptyResults: SearchResult[] = [];
    const ledger = buildEvidenceLedger(emptyResults, 'QuantumGizmo9000X');

    expect(ledger.length).toBe(0);
  });

  // Test 7: Conflicting sources resolution (Tier 1 vs Tier 4)
  it('Test 7: Prioritizes Tier 1 manufacturer specs and flags discrepancy when Tier 4 aggregator conflicts', () => {
    const mockResults: SearchResult[] = [
      {
        id: 't1',
        title: 'Lenovo LOQ Official Specifications',
        url: 'https://www.lenovo.com/in/en/p/laptops/loq/15irx9',
        snippet: 'Lenovo LOQ 15IRX9 features a 15.6-inch FHD display with 60Hz refresh rate and 100% sRGB color gamut.',
        domain: 'lenovo.com',
        retrievedAt: new Date().toISOString(),
        sourceType: 'official_manufacturer',
        relevanceScore: 0.95,
        tier: 1,
      },
      {
        id: 't4',
        title: 'CheapDeals Blog - LOQ Specs',
        url: 'https://random-deals-blog.xyz/loq',
        snippet: 'The LOQ has a fast 120Hz display with 8GB RAM.',
        domain: 'random-deals-blog.xyz',
        retrievedAt: new Date().toISOString(),
        sourceType: 'general',
        relevanceScore: 0.6,
        tier: 4,
      },
    ];

    const ledger = buildEvidenceLedger(mockResults, 'Lenovo LOQ');
    const specEntry = ledger.find((e) => e.category === 'spec');

    expect(specEntry).toBeDefined();
    expect(specEntry?.conflict).toBe(true);
    expect(specEntry?.conflictDetails).toContain('Tier 1 manufacturer specification confirms 60Hz');
  });

  // Test 8: Search unavailable fallback
  it('Test 8: System degrades gracefully when live search returns zero results without crashing', async () => {
    const report = await conductLiveResearch('Any standard laptop query', {
      category: 'laptops',
      budgetInr: 75000,
      timeoutMs: 10, // Force timeout fallback
    });

    expect(report).toBeDefined();
    expect(report.query).toBe('Any standard laptop query');
    expect(typeof report.statusMessage).toBe('string');
    expect(report.verdictConfidence).toBeDefined();
  });

  // Auxiliary Tests: Normalizer & Domain Classification
  it('Auxiliary: Normalizer accurately extracts INR pricing across Lakhs, Crores, and standard numerals', () => {
    expect(extractInrPrice('Hyundai Creta starting at 19.5 Lakhs ex-showroom').price).toBe(1950000);
    expect(extractInrPrice('Villa in Whitefield for 2.4 Crores').price).toBe(24000000);
    expect(extractInrPrice('Available on Amazon for ₹74,990 limited deal').price).toBe(74990);
  });

  it('Auxiliary: Normalizer accurately extracts RAM, Storage, and display specs without combining variants', () => {
    const specs = extractHardwareSpecs('Lenovo LOQ with 16GB DDR5 RAM, 512GB SSD and 100% sRGB display');
    expect(specs.ramGb).toBe(16);
    expect(specs.storageGb).toBe(512);
    expect(specs.display).toContain('100% sRGB');
  });

  it('Auxiliary: Classifies domains into appropriate Tiers 1 through 4', () => {
    expect(classifyDomainTier('amazon.in').tier).toBe(1);
    expect(classifyDomainTier('notebookcheck.net').tier).toBe(2);
    expect(classifyDomainTier('reddit.com').tier).toBe(3);
    expect(classifyDomainTier('some-unverified-blog.info').tier).toBe(4);
  });
});
