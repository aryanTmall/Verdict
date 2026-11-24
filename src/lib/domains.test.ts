import { describe, it, expect } from "vitest";
import { classifyQuery } from "./domains/classifier";
import { getDomainPack, generateUniversalProducts } from "./domains/registry";
import { parseMission } from "./llm";
import { evaluate } from "./engine";

describe("Phase 13: Universal 10-Industry Purchase Intelligence Engine Tests", () => {
  // Test 1: Automotive ₹19 Lakh Scenario
  it("Scenario 1: 'I need a car, my budget is 19 lakhs.'", async () => {
    const query = "I need a car, my budget is 19 lakhs.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("automotive");
    expect(classification.category).toBe("cars");
    expect(classification.budget).toBe(1900000);
    expect(classification.requiresClarification).toBe(true);
    expect(classification.missingInformation).toContain("on_road_or_ex_showroom_budget");
    expect(classification.clarifyingQuestions.length).toBeGreaterThan(0);

    const mission = await parseMission(query);
    expect(mission.catalogProducts).toBeDefined();
    expect(mission.catalogProducts!.length).toBe(3);

    const creta = mission.catalogProducts!.find(p => p.slug.includes("creta"));
    expect(creta).toBeDefined();
    expect(creta.primaryImageUrl).toMatch(/^https?:\/\/|^\/products\//);
    expect(creta.destinationUrl).toContain("http");
    expect(creta.priceInr).toBeLessThanOrEqual(1900000);
    expect(creta.domainSpecs.engine).toBeDefined();
    expect(creta.ownership.stations.length).toBeGreaterThan(3);

    // Evaluate in engine
    const evals = evaluate(mission.catalogProducts!, mission.profile);
    const eligible = evals.filter(e => e.eligible);
    expect(eligible.length).toBe(3);
  }, 15000);

  // Test 2: Electronics & Computing Laptop
  it("Scenario 2: 'I need a laptop under ₹75,000 for software development.'", async () => {
    const query = "I need a laptop under ₹75,000 for software development.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("electronics");
    expect(classification.category).toBe("laptops");
    expect(classification.budget).toBe(75000);

    const mission = await parseMission(query);
    expect(mission.profile.budgetInr).toBe(75000);
  }, 15000);

  // Test 3: Real Estate Bangalore Flat
  it("Scenario 3: 'Find a flat in Bangalore within ₹90 lakhs.'", async () => {
    const query = "Find a flat in Bangalore within ₹90 lakhs.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("real_estate");
    expect(classification.category).toBe("apartments");
    expect(classification.budget).toBe(9000000);
    expect(classification.city).toBe("Bangalore");

    const mission = await parseMission(query);
    expect(mission.catalogProducts!.length).toBe(3);
    const prestige = mission.catalogProducts!.find(p => p.slug.includes("prestige"));
    expect(prestige).toBeDefined();
    expect(prestige.domainSpecs.reraApproved).toBe(true);
    expect(prestige.domainSpecs.reraNumber).toBeDefined();
    expect(prestige.ownership.stations[0].station).toContain("Registry");

    const evals = evaluate(mission.catalogProducts!, mission.profile);
    expect(evals.filter(e => e.eligible).length).toBe(3);
  }, 15000);

  // Test 4: DSLR / Mirrorless Wildlife Photography
  it("Scenario 4: 'I want a DSLR for wildlife photography.'", async () => {
    const query = "I want a DSLR for wildlife photography.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("electronics");
    expect(classification.category).toBe("cameras");

    const mission = await parseMission(query);
    expect(mission.catalogProducts!.length).toBeGreaterThanOrEqual(2);
    const sony = mission.catalogProducts!.find(p => p.slug.includes("sony"));
    expect(sony).toBeDefined();
    expect(sony.bestFor.toLowerCase()).toContain("wildlife");
    expect(sony.primaryImageUrl).toContain("http");
    expect(sony.ownership.stations[0].metricLabel).toContain("Battery");

    const evals = evaluate(mission.catalogProducts!, mission.profile);
    expect(evals.filter(e => e.eligible).length).toBeGreaterThanOrEqual(2);
  }, 15000);

  // Test 5: Washing Machine for Family of Five
  it("Scenario 5: 'I need a washing machine for a family of five.'", async () => {
    const query = "I need a washing machine for a family of five.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("appliances");
    expect(classification.category).toBe("washing_machines");

    const mission = await parseMission(query);
    const bosch = mission.catalogProducts!.find(p => p.slug.includes("bosch"));
    expect(bosch).toBeDefined();
    expect(bosch.domainSpecs.capacity).toContain("9.0 kg");
    expect(bosch.destinationUrl).toContain("http");
    expect(bosch.ownership.stations[0].station).toContain("Installation");

    const evals = evaluate(mission.catalogProducts!, mission.profile);
    expect(evals.filter(e => e.eligible).length).toBeGreaterThanOrEqual(2);
  }, 15000);

  // Test 6: Running Shoes for Marathon Training
  it("Scenario 6: 'Find running shoes for marathon training.'", async () => {
    const query = "Find running shoes for marathon training.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("sports");
    expect(classification.category).toBe("running_shoes");

    const mission = await parseMission(query);
    const nike = mission.catalogProducts!.find(p => p.slug.includes("pegasus"));
    expect(nike).toBeDefined();
    expect(nike.domainSpecs.midsoleFoam).toContain("ReactX");
    expect(nike.ownership.stations[1].station).toContain("200 km");

    const evals = evaluate(mission.catalogProducts!, mission.profile);
    expect(evals.filter(e => e.eligible).length).toBe(2);
  }, 15000);

  // Test 7: Tractor for 5-Acre Farm
  it("Scenario 7: 'I need a tractor for a 5-acre farm.'", async () => {
    const query = "I need a tractor for a 5-acre farm.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("agriculture");
    expect(classification.category).toBe("tractors");

    const mission = await parseMission(query);
    const oja = mission.catalogProducts!.find(p => p.slug.includes("oja"));
    expect(oja).toBeDefined();
    expect(oja.domainSpecs.engineHp).toBe(27);
    expect(oja.domainSpecs.driveType).toContain("4WD");
    expect(oja.ownership.metricName).toContain("Diesel");

    const evals = evaluate(mission.catalogProducts!, mission.profile);
    expect(evals.filter(e => e.eligible).length).toBe(2);
  }, 15000);

  // Test 8: Hotel in Goa for Family Holiday
  it("Scenario 8: 'Find a hotel in Goa for a family holiday.'", async () => {
    const query = "Find a hotel in Goa for a family holiday.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("travel");
    expect(classification.category).toBe("resorts");

    const mission = await parseMission(query);
    const taj = mission.catalogProducts!.find(p => p.slug.includes("taj"));
    expect(taj).toBeDefined();
    expect(taj.domainSpecs.beachAccess).toContain("Benaulim");
    expect(taj.ownership.stations[0].station).toContain("Arrival");

    const evals = evaluate(mission.catalogProducts!, mission.profile);
    expect(evals.filter(e => e.eligible).length).toBe(2);
  }, 15000);

  // Test 9: Commercial Refrigerator for Restaurant
  it("Scenario 9: 'I want a commercial refrigerator for my restaurant.'", async () => {
    const query = "I want a commercial refrigerator for my restaurant.";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("appliances");
    expect(classification.category).toBe("commercial_chillers");

    const mission = await parseMission(query);
    const celfrost = mission.catalogProducts!.find(p => p.slug.includes("celfrost"));
    expect(celfrost).toBeDefined();
    expect(celfrost.domainSpecs.capacity).toContain("1000 Litres");
    expect(celfrost.domainSpecs.materialGrade).toContain("304");

    const evals = evaluate(mission.catalogProducts!, mission.profile);
    expect(evals.filter(e => e.eligible).length).toBeGreaterThanOrEqual(1);
  }, 15000);

  // Test 10: Unusual Niche Product (Universal Fallback Evaluator)
  it("Scenario 10: 'I need an espresso coffee machine, budget 25000'", async () => {
    const query = "I need an espresso coffee machine, budget 25000";
    const classification = classifyQuery(query);

    expect(classification.industry).toBe("universal");
    expect(classification.budget).toBe(25000);

    const mission = await parseMission(query);
    expect(mission.catalogProducts!.length).toBe(3);
    const p1 = mission.catalogProducts![0];
    expect(p1.priceInr).toBeLessThanOrEqual(25000);
    expect(p1.destinationUrl).toContain("amazon.in");
    expect(p1.primaryImageUrl).toContain("http");
    expect(p1.ownership.stations.length).toBeGreaterThanOrEqual(3);

    const evals = evaluate(mission.catalogProducts!, mission.profile);
    expect(evals.filter(e => e.eligible).length).toBe(3);
  }, 15000);
});
