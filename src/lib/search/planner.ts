import { PlannedQuery, SearchPlan } from './types';

interface QueryIntentParams {
  rawQuery: string;
  category?: string;
  industry?: string;
  budgetInr?: number;
  knownCandidates?: string[];
  hardConstraints?: string[];
  softConstraints?: string[];
}

export function generateSearchPlan(params: QueryIntentParams): SearchPlan {
  const { rawQuery, knownCandidates = [] } = params;
  const lower = rawQuery.toLowerCase();

  // Determine category & industry if not given
  let category = params.category || 'general';
  let industry = params.industry || 'universal';

  if (category === 'general') {
    if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('thinkpad')) {
      category = 'laptops';
      industry = 'electronics';
    } else if (lower.includes('phone') || lower.includes('smartphone') || lower.includes('iphone') || lower.includes('galaxy')) {
      category = 'smartphones';
      industry = 'electronics';
    } else if (lower.includes('car') || lower.includes('suv') || lower.includes('sedan') || lower.includes('creta')) {
      category = 'cars';
      industry = 'automotive';
    } else if (lower.includes('sofa') || lower.includes('couch') || lower.includes('bed')) {
      category = 'furniture';
      industry = 'universal';
    } else if (lower.includes('flat') || lower.includes('apartment') || lower.includes('villa') || lower.includes('property')) {
      category = 'residential';
      industry = 'real_estate';
    } else if (lower.includes('camera') || lower.includes('dslr') || lower.includes('mirrorless')) {
      category = 'cameras';
      industry = 'electronics';
    } else if (lower.includes('washing machine') || lower.includes('refrigerator') || lower.includes('ac')) {
      category = 'appliances';
      industry = 'appliances';
    }
  }

  // Extract constraints
  const hardConstraints: string[] = [...(params.hardConstraints || [])];
  const softConstraints: string[] = [...(params.softConstraints || [])];

  if (lower.includes('16gb') || lower.includes('16 gb')) hardConstraints.push('16GB RAM minimum');
  if (lower.includes('automatic') || lower.includes('amt') || lower.includes('cvt')) hardConstraints.push('Automatic transmission');
  if (lower.includes('4k') || lower.includes('oled')) hardConstraints.push('OLED / 4K display');
  if (lower.includes('video editing') || lower.includes('premier') || lower.includes('davinci')) softConstraints.push('Color-accurate display (>95% sRGB / DCI-P3)');
  if (lower.includes('battery') || lower.includes('long battery')) softConstraints.push('High battery endurance');
  if (lower.includes('gaming')) softConstraints.push('Dedicated GPU & high refresh rate');

  // Candidate anchor
  const primaryCandidate = knownCandidates[0] || (
    category === 'laptops' ? 'Lenovo LOQ Asus TUF Acer Nitro' :
    category === 'smartphones' ? 'Motorola Edge Realme GT OnePlus Nord' :
    category === 'cars' ? 'Hyundai Creta Tata Harrier Mahindra XUV700' :
    category === 'cameras' ? 'Sony A6700 Canon R10 Nikon Z50' :
    category
  );

  const budgetStr = params.budgetInr ? `under ${params.budgetInr > 100000 ? `${params.budgetInr / 100000} Lakh` : params.budgetInr}` : '';
  const yearStr = '2024 OR 2025';

  const queries: PlannedQuery[] = [];

  // Query A: Product Discovery
  queries.push({
    id: 'A',
    label: 'Market Discovery',
    query: `best ${category} ${budgetStr} india ${yearStr} recommendation site:in OR site:com`.trim(),
    purpose: 'Identify current market leaders, top benchmarked contenders, and active options within budget.',
    priority: 1,
  });

  // Query B: Candidate Specifics / Official Specs
  queries.push({
    id: 'B',
    label: 'Official Tech Specs',
    query: `${primaryCandidate} official specifications display ram storage battery site:lenovo.com OR site:apple.com OR site:asus.com OR site:amazon.in`.trim(),
    purpose: 'Retrieve verified hardware specifications, display color gamuts, upgradeable slots, and variant details.',
    priority: 1,
  });

  // Query C: Independent Reviews & Lab Benchmarks
  if (category === 'laptops' || category === 'smartphones') {
    queries.push({
      id: 'C',
      label: 'Lab Benchmarks & Editorial Review',
      query: `${primaryCandidate} review site:notebookcheck.net OR site:gsmarena.com OR site:rtings.com`.trim(),
      purpose: 'Obtain instrumented lab benchmarks, display color accuracy, thermal throttling tests, and endurance numbers.',
      priority: 2,
    });
  } else if (category === 'cars') {
    queries.push({
      id: 'C',
      label: 'Automotive Road Tests & Mileage',
      query: `${primaryCandidate} road test real world mileage suspension site:autocarindia.com OR site:team-bhp.com`.trim(),
      purpose: 'Obtain real-world fuel economy figures, suspension behavior, and road test impressions.',
      priority: 2,
    });
  } else {
    queries.push({
      id: 'C',
      label: 'Independent Testing',
      query: `${primaryCandidate} in-depth review test performance rating`.trim(),
      purpose: 'Check unbiased review ratings and stress tests.',
      priority: 2,
    });
  }

  // Query D: Long-Term Reliability & Known Hardware Issues
  queries.push({
    id: 'D',
    label: 'Known Defects & Failures',
    query: `${primaryCandidate} common problems failure defect issues site:reddit.com OR site:team-bhp.com`.trim(),
    purpose: 'Investigate motherboard failures, battery drain, thermal bottlenecks, or recall notices.',
    priority: 2,
  });

  // Query E: Common Complaints & Regret Factors
  queries.push({
    id: 'E',
    label: 'Owner Complaints & Regret',
    query: `${primaryCandidate} buyer regret complaints bad experience user review`.trim(),
    purpose: 'Analyze long-term ownership friction, service center response, and build degradation.',
    priority: 3,
  });

  // Query F: Live Price Comparison & Retail Listings
  queries.push({
    id: 'F',
    label: 'Live Retail Prices & Deals',
    query: `${primaryCandidate} price in india buy online amazon flipkart reliance croma`.trim(),
    purpose: 'Retrieve verified real-time retail pricing, stock status, and direct purchase links.',
    priority: 1,
  });

  // Query G: Product Lifecycle & Release Timing
  queries.push({
    id: 'G',
    label: 'Product Lifecycle & Next-Gen Launch',
    query: `${primaryCandidate} next generation refresh release date facelift price drop`.trim(),
    purpose: 'Determine if an imminent refresh cycle warrants a WAIT recommendation.',
    priority: 3,
  });

  // Query H: Pre-Owned & Refurbished Comps
  queries.push({
    id: 'H',
    label: 'Refurbished & Pre-Owned Benchmark',
    query: `${primaryCandidate} used refurbished certified price cashify olx spinny`.trim(),
    purpose: 'Calculate depreciation delta and pre-owned value score.',
    priority: 3,
  });

  return {
    originalQuery: rawQuery,
    category,
    industry,
    budgetInr: params.budgetInr,
    hardConstraints,
    softConstraints,
    queries,
  };
}
