import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path="VERDICT_8_Slide_Pitch.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Constants
    BG_COLOR = RGBColor(17, 19, 24)        # #111318
    CARD_BG = RGBColor(26, 29, 38)         # #1A1D26
    CARD_BORDER = RGBColor(42, 46, 61)     # #2A2E3D
    TEXT_WHITE = RGBColor(255, 255, 255)   # #FFFFFF
    TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8
    TEXT_DIM = RGBColor(100, 116, 139)     # #64748B
    GOLD = RGBColor(245, 158, 11)          # #F59E0B
    EMERALD = RGBColor(16, 185, 129)       # #10B981
    SKY = RGBColor(56, 189, 248)           # #38BDF8
    CRIMSON = RGBColor(239, 68, 68)        # #EF4444

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.color.rgb = BG_COLOR
        return bg

    def add_header(slide, number_str, title_str, subtitle_str):
        # Category / Number tag
        tb_num = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        p_num = tb_num.text_frame.paragraphs[0]
        p_num.text = number_str.upper()
        p_num.font.size = Pt(11)
        p_num.font.bold = True
        p_num.font.color.rgb = GOLD

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.6))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title_str
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE

        # Subtitle
        if subtitle_str:
            tb_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.7), Inches(0.4))
            p_sub = tb_sub.text_frame.paragraphs[0]
            p_sub.text = subtitle_str
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, title="", title_color=GOLD):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        if title:
            tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(0.4))
            p = tb.text_frame.paragraphs[0]
            p.text = title
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = title_color
        return card

    # =========================================================================
    # SLIDE 1: COVER & EXECUTIVE SUMMARY
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)

    # Big Brand Title
    tb_main = s1.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.7), Inches(1.8))
    p1 = tb_main.text_frame.paragraphs[0]
    p1.text = "VERDICT"
    p1.font.size = Pt(54)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE

    p2 = tb_main.text_frame.add_paragraph()
    p2.text = "See beyond the buy."
    p2.font.size = Pt(26)
    p2.font.bold = True
    p2.font.color.rgb = GOLD

    p3 = tb_main.text_frame.add_paragraph()
    p3.text = "Universal Buyer-Side AI Purchasing & Ownership Intelligence Engine"
    p3.font.size = Pt(16)
    p3.font.color.rgb = TEXT_MUTED

    # 3 Summary Cards
    # Card 1: Problem Statement
    add_card(s1, 0.8, 3.2, 3.6, 3.6, "HACKATHON TRACK", SKY)
    tb = s1.shapes.add_textbox(Inches(1.0), Inches(3.8), Inches(3.2), Inches(2.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Problem Statement: PS-03"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "Reimagining Shopping with AI"
    p.font.size = Pt(12)
    p.font.color.rgb = GOLD
    p = tf.add_paragraph()
    p.text = "\nTeam: Apex Coders\nProduct: Full-Stack Universal Purchase Intelligence\nStatus: Built, Deployed & Live on Production"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Card 2: Core Value Prop
    add_card(s1, 4.8, 3.2, 3.8, 3.6, "BUYER-SIDE ADVOCATE", EMERALD)
    tb = s1.shapes.add_textbox(Inches(5.0), Inches(3.8), Inches(3.4), Inches(2.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Independent Consumer AI"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• 0 Sponsored Rankings: We work 100% for the buyer, never the retailer.\n• 11 Domains: Cars, Real Estate, Electronics, Appliances, Sports, Agriculture, etc.\n• Evidence-Grounded: Live search cross-examines marketing claims with receipts.\n• 5-Year TCO Forecast: Predicts repair, battery fade, and depreciation regret."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Card 3: Live Production Deployment
    add_card(s1, 8.9, 3.2, 3.6, 3.6, "PRODUCTION SYSTEM", GOLD)
    tb = s1.shapes.add_textbox(Inches(9.1), Inches(3.8), Inches(3.2), Inches(2.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Live Web Application"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\nLive URL: verdict-u9pt.onrender.com\nGitHub: github.com/aryanTmall/Verdict\nStack: Next.js 16 + Groq 120B + Live Search\nTest Suite: 55/55 Automated Vitest passing\nRoutes: 26 live production endpoints"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 2: THE PROBLEM & THE TRUST DEFICIT
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "01 / The Core Problem", "The E-Commerce Market Failure: We Buy on Promises, Regret in Month 5",
               "Shoppers are stranded between store-biased bots and deceptive week-one review signals.")

    # 3 Problem Columns
    # Col 1: Store-Biased Bots
    add_card(s2, 0.8, 1.9, 3.6, 5.0, "1. RETAILER-SIDE CONFLICT", CRIMSON)
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(3.2), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Assistants Work for the Store"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Retailer bots (Amazon Rufus, Alexa) are built to optimize cart conversion and clear vendor inventory.\n\n• They never advise you to WAIT for upcoming sales, never recommend rival marketplaces, and never warn about known motherboard or transmission failures.\n\n• Nobody in e-commerce today is the buyer's independent legal advocate."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Col 2: The Review Honeymoon
    add_card(s2, 4.8, 1.9, 3.8, 5.0, "2. THE REVIEW HONEYMOON", GOLD)
    tb = s2.shapes.add_textbox(Inches(5.0), Inches(2.5), Inches(3.4), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Early Praise vs Month-5 Regret"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Over 85% of online reviews are posted during week one ('Great unboxing! Looks sleek!').\n\n• True product regret strikes after month 5: battery degradation, thermal throttling under real workloads, soldered RAM bottlenecks, and costly OEM maintenance.\n\n• By the time the real cost appears, the return window has expired."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Col 3: The $25 Trust Deficit
    add_card(s2, 8.9, 1.9, 3.6, 5.0, "3. THE TRUST GAP", SKY)
    tb = s2.shapes.add_textbox(Inches(9.1), Inches(2.5), Inches(3.2), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "42% Refuse AI Shopping Advice"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Independent surveys (Product.AI Trust Report, n=1,463) reveal 42% of consumers refuse to trust an AI recommendation over $25 without manual cross-checking.\n\n• Generic LLM chatbots hallucinate product specs, invent non-existent prices, and parrot SEO affiliate blogs.\n\n• Consumers demand transparent evidence, verifiable receipts, and zero hallucination."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 3: THE UNIVERSAL SOLUTION ACROSS 11 INDUSTRIES
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "02 / The Solution", "VERDICT: Universal Purchase Intelligence Across 11 Real-World Domains",
               "A buyer-side intelligence platform that understands deep domain rules, Indian market realities, and multi-modal intake.")

    # Left: Multimodal Input (3.8w)
    add_card(s3, 0.8, 1.9, 3.8, 5.0, "MULTIMODAL MISSION INTAKE", SKY)
    tb = s3.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(3.4), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Speak, Type, Scan, or Drop a Link"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Natural Language Voice: Native speech-to-text in 22 Eighth Schedule Indian languages (Hindi, Hinglish, Tamil, Telugu, Marathi, Bengali, etc.).\n\n• Physical Product Scanner: Upload a camera photo or barcode to extract model, condition, and market comps.\n\n• Link Intelligence: Drop any Amazon, Flipkart, CarWale or RERA URL for instant cross-examination.\n\n• Reality Check Engine: Intercepts impossible budgets (e.g. 'Car for ₹1') with courteous market corrections."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Right: The 11 Built-In Industry Packs (7.8w)
    add_card(s3, 4.9, 1.9, 7.6, 5.0, "11 DEEP INDUSTRY INTELLIGENCE PACKS", EMERALD)
    tb = s3.shapes.add_textbox(Inches(5.1), Inches(2.5), Inches(7.2), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Domain-Specific Scoring & Market Formulas (Not Generic Answers)"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    
    domains = [
        ("Automotive", "Ex-showroom vs on-road RTO tax slabs (~12%), ARAI vs real traffic mileage, 5-yr service costs, facelift cycles."),
        ("Real Estate", "RERA registration checks, carpet-area efficiency ratios, water-logging history, builder litigation audits."),
        ("Electronics", "sRGB/DCI-P3 color gamuts, thermal throttling stress tests, soldered RAM traps, Linux/Docker compatibility."),
        ("Appliances", "BEE 5-Star power burn, inverter compressor 10-yr warranties, vibration noise dB, service network density."),
        ("Higher Ed", "AICTE/UGC accreditation, verified alumni placement median salaries, weekly workload feasibility (12-15h)."),
        ("Agriculture", "Rotavator PTO torque, diesel burn L/hr, 4WD utility compacts, subsidy clearance timelines."),
        ("Sports/Travel/Fashion", "Shoe strike geometry, luxury resort child-proofing, mechanical horology cost-per-wear over 3 years.")
    ]
    for d_name, d_desc in domains:
        p = tf.add_paragraph()
        p.text = f"• {d_name}: {d_desc}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 4: ARCHITECTURE — "CODE CALCULATES, AI INTERPRETS"
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "03 / System Architecture", "Truth Protection: Deterministic Engine Calculates, Cloud LLM Interprets",
               "LLMs hallucinate math and fabricate prices. VERDICT separates statistical reasoning from factual calculation.")

    # 3 Architecture Steps
    # Step 1: Retrieval & Multi-Query Search
    add_card(s4, 0.8, 1.9, 3.6, 5.0, "1. RETRIEVAL & RESEARCH", SKY)
    tb = s4.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(3.2), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Category-Aware Queries A–H"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Queries A–H: Automatic generation of 8 distinct search vectors (Discovery, Specs, Lab Benchmarks, Failures, Regret, Retail Comps, Lifecycle, Refurbished).\n\n• Unified Search Router: Tavily API + Brave Search + DuckDuckGo Lite zero-key fallback.\n\n• Source Tiering (1–4): Manufacturer (Tier 1) > Lab (Tier 2: Notebookcheck, GSMArena) > Community (Tier 3: Reddit, Team-BHP) > Web (Tier 4).\n\n• Conflict Detection: Tier 1 specs strictly overrule Tier 4 marketing claims."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Step 2: Deterministic Calculation Engine
    add_card(s4, 4.8, 1.9, 3.8, 5.0, "2. DETERMINISTIC ENGINE", EMERALD)
    tb = s4.shapes.add_textbox(Inches(5.0), Inches(2.5), Inches(3.4), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Code Decides (0–100 Scores)"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Hard Requirement Gates: If a product lacks 16GB RAM for Docker or automatic transmission for city traffic, it is DISMISSED—high average scores cannot mask fatal flaws.\n\n• Mathematical Formula: Weighted composite across Performance, Longevity, Reliability, Value, Battery, Portability.\n\n• TCO Modeling: Exact 5-year cost projection (Depreciation + Consumables + Upgrades - Resale Value)."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Step 3: Cloud LLM Synthesis
    add_card(s4, 8.9, 1.9, 3.6, 5.0, "3. CLOUD REASONING", GOLD)
    tb = s4.shapes.add_textbox(Inches(9.1), Inches(2.5), Inches(3.2), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Groq 120B / Gemini 2.5 Flash"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Groq Cloud (GPT-OSS 120B): Sub-second structured JSON reasoning running at 500 tokens/sec.\n\n• Google Gemini (gemini-2.5-flash): Multimodal image audit and structured JSON schema enforcement.\n\n• Zero Hallucination: The LLM is fed the structured Evidence Ledger and forbidden from inventing numbers or prices.\n\n• Explains the Verdict: Produces courtroom-grade BUY, WAIT, or SKIP justifications."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 5: SIGNATURE PRODUCTION FEATURES
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "04 / Core Features", "Live Production Modules: Evidence Ledger, Reality Check & Market Intelligence",
               "Features engineered directly in production code with verified test suites.")

    # 4 Feature Quadrants
    # Q1: Reality Check & Anti-Hallucination
    add_card(s5, 0.8, 1.9, 5.6, 2.4, "MODULE A: REALITY CHECK GUARDRAILS", CRIMSON)
    tb = s5.shapes.add_textbox(Inches(1.0), Inches(2.4), Inches(5.2), Inches(1.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "• Pre-Search Constraint Validation: Checks budget feasibility against live retail minimums before searching.\n• Prevents Mockery & Scams: Rejects requests like 'Car for ₹1' or '4K OLED for ₹5,000'.\n• Courteous Alternatives: Recommends realistic used options, target savings goals, or refurbished market pricing."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Q2: Claims Cross-Examination Ledger
    add_card(s5, 6.9, 1.9, 5.6, 2.4, "MODULE B: CLAIMS CROSS-EXAMINATION", EMERALD)
    tb = s5.shapes.add_textbox(Inches(7.1), Inches(2.4), Inches(5.2), Inches(1.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "• Claims Tested Against Owner Signal: Extracts seller claims ('40-hr battery', 'All-day comfort').\n• Verdict Labels: Classifies each claim as Supported, Contradicted, or Unverifiable.\n• Quoted Receipts: Displays exact verbatim quotes from long-term owners and instrumented test labs."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Q3: Second-Hand & Refurbished Matrix
    add_card(s5, 0.8, 4.5, 5.6, 2.4, "MODULE C: NEW VS USED VS REFURBISHED", GOLD)
    tb = s5.shapes.add_textbox(Inches(1.0), Inches(5.0), Inches(5.2), Inches(1.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "• Cross-Condition Radar: Compares Brand New vs Certified Pre-Owned vs Refurbished vs Used.\n• Depreciation Engine: Computes percentage savings, remaining operational lifespan, and repair risk.\n• Verified Comps: Aggregates listings from Cashify, Spinny, OLX, and Amazon Renewed."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Q4: Price Radar & Sale Autopilot
    add_card(s5, 6.9, 4.5, 5.6, 2.4, "MODULE D: PRICE RADAR & SALE AUTOPILOT", SKY)
    tb = s5.shapes.add_textbox(Inches(7.1), Inches(5.0), Inches(5.2), Inches(1.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "• Fake Sale Detector: Audits MRP vs 90-day moving average to catch artificial price hikes before sales.\n• Next-Gen Refresh Tracker: Identifies imminent model facelifts to trigger WAIT recommendations.\n• Automated Purchasing Rules: Pre-authorizes target price triggers with calendar (.ics) sync."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 6: COMPLETE FULL-STACK TECH STACK
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "05 / Tech Stack", "Production Full-Stack Implementation: Built for Speed, Scale & Zero Failure",
               "Fully responsive, production-ready stack deployed on modern cloud infrastructure.")

    # 4 Stack Cards
    # Frontend
    add_card(s6, 0.8, 1.9, 2.7, 5.0, "FRONTEND LAYER", SKY)
    tb = s6.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(2.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Modern Web UI"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Next.js 16 (App Router)\n• React 19 Client/Server\n• TypeScript 5 (Strict)\n• Tailwind CSS v4\n• Framer Motion (Transitions)\n• Recharts (TCO Graphs)\n• Lucide Icons\n• Lenis Smooth Scroll\n• Responsive Courtroom Theme"
    p.font.size = Pt(10)
    p.font.color.rgb = TEXT_MUTED

    # Backend & Core Engine
    add_card(s6, 3.8, 1.9, 2.7, 5.0, "BACKEND & LOGIC", EMERALD)
    tb = s6.shapes.add_textbox(Inches(4.0), Inches(2.5), Inches(2.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Serverless Architecture"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Node 22 (LTS) Runtime\n• 26 API Server Endpoints\n• Deterministic Math Engine\n• TCO Depreciation Formula\n• Zod Schema Validation\n• iCal (.ics) Calendar Sync\n• Error Boundary Protection\n• In-Memory TTL Cache\n• Sub-2s Average Latency"
    p.font.size = Pt(10)
    p.font.color.rgb = TEXT_MUTED

    # AI & Research Layer
    add_card(s6, 6.8, 1.9, 2.7, 5.0, "AI & SEARCH (RAG)", GOLD)
    tb = s6.shapes.add_textbox(Inches(7.0), Inches(2.5), Inches(2.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Multi-Model Cloud"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Groq Cloud (GPT-OSS 120B)\n• Google Gemini (2.5 Flash)\n• Anthropic Claude Sonnet\n• Local Ollama Fallback\n• Tavily & Brave Search APIs\n• DuckDuckGo Zero-Key Scraper\n• Source Tiering (1–4)\n• Strict Native JSON Mode\n• Web Speech 22 Languages"
    p.font.size = Pt(10)
    p.font.color.rgb = TEXT_MUTED

    # Cloud Deployment & QA
    add_card(s6, 9.8, 1.9, 2.7, 5.0, "DEVOPS & TESTING", CRIMSON)
    tb = s6.shapes.add_textbox(Inches(10.0), Inches(2.5), Inches(2.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Production Grade"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Render Cloud Web Service\n• Blueprint Auto-Deploy\n• Supabase Cloud PostgreSQL\n• Local JSON Fallback Vault\n• 55/55 Automated Tests\n• Vitest Test Framework\n• Turbopack Build Optimizer\n• Zero Peer Dep Conflicts\n• 99.9% Uptime Target"
    p.font.size = Pt(10)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 7: BUSINESS MODEL & ETHICS CHARTER
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "06 / Business Model", "Sustainable Commercialization: Free for Consumers, Essential for Industry",
               "Building trust requires aligning revenue with buyer success, not vendor cart conversion.")

    # 3 Revenue Pillars
    # Pillar 1: Consumer Freemium
    add_card(s7, 0.8, 1.9, 3.6, 5.0, "1. CONSUMER / VERDICT+", SKY)
    tb = s7.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(3.2), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Freemium & Subscription"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Free Tier: Unlimited mission parses, standard scoring, and product shortlist.\n\n• VERDICT+ (₹299/mo or ₹2,499/yr):\n  - Continuous Price Radar tracking\n  - Automated Deal Alerts via WhatsApp/SMS\n  - Multi-item Household TCO Portfolio\n  - Priority Groq 120B research queue\n\n• Zero Sponsored Placements: Premium members never see boosted listings."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Pillar 2: Retailer Return-Reduction API
    add_card(s7, 4.8, 1.9, 3.8, 5.0, "2. B2B RETURN REDUCTION", EMERALD)
    tb = s7.shapes.add_textbox(Inches(5.0), Inches(2.5), Inches(3.4), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Solving the ₹40,000 Cr Deficit"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Indian e-commerce faces an estimated 25–35% return rate on high-ticket goods (electronics, furniture, apparel).\n\n• VERDICT Fit API: Licensed to marketplaces to pre-screen buyer needs against specs before checkout.\n\n• Metric: 15% reduction in avoidable returns saves top retailers ₹500+ Cr annually in reverse logistics and restocking waste."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # Pillar 3: Verified Brand Right-of-Reply
    add_card(s7, 8.9, 1.9, 3.6, 5.0, "3. BRAND RIGHT OF REPLY", GOLD)
    tb = s7.shapes.add_textbox(Inches(9.1), Inches(2.5), Inches(3.2), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Credibility for Honest Brands"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p = tf.add_paragraph()
    p.text = "\n• Verified Claims Programme: Brands can submit certified lab test reports to challenge contradicted claims.\n\n• Anti-Pay-to-Win Charter: Brands can NEVER pay to boost scores or suppress verified defects.\n\n• B2B Fleet Intelligence: Enterprise SaaS for corporate IT departments evaluating hardware lifecycle costs across 1,000+ workstations."
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 8: FUTURE SCOPE & 5-YEAR VISION
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "07 / Future Scope", "Strategic Roadmap: From Purchase Decision to Autonomous Ownership Lifecycle",
               "Expanding VERDICT from an advisory courtroom into a fully autonomous buyer-side fiduciary agent.")

    # 4 Roadmap Columns
    phases = [
        ("PHASE 1 (Q1-Q2 2027)", "AUTONOMOUS AGENT PROCUREMENT", SKY, [
            "User-Authorized Auto Buy: Setting hard spending caps and authorized one-click purchase when target price is reached.",
            "Dynamic Negotiation: AI agent negotiates live showroom dealer quotes and marketplace flash bundles."
        ]),
        ("PHASE 2 (Q3-Q4 2027)", "FINTECH & CARD ARBITRAGE", EMERALD, [
            "Bank Offer Stacking: Real-time detection of instant credit card discounts, cashback portals, and no-cost EMI arbitrage.",
            "Buy-Now-Pay-Later Audit: Mathematical scrutiny of hidden interest rates and deferred penalty fees."
        ]),
        ("PHASE 3 (2028)", "IOT TELEMETRY & RESALE TIMING", GOLD, [
            "Live Hardware Health Sync: Integration with laptop battery cycles and vehicle OBD telemetry.",
            "Dynamic Resale Alert: Recommending optimal resale windows right before steep steep depreciation cliffs."
        ]),
        ("PHASE 4 (2029+)", "GLOBAL ENTERPRISE CAPEX", CRIMSON, [
            "B2B Corporate Procurement: Standardizing multi-crore enterprise fleet, server, and factory equipment decisions.",
            "Cross-Border Arbitrage: Real-time import duty, warranty reciprocity, and global currency arbitrage simulator."
        ])
    ]

    for idx, (p_title, p_sub, p_col, points) in enumerate(phases):
        x = 0.8 + idx * 2.95
        add_card(s8, x, 1.9, 2.8, 5.0, p_title, p_col)
        tb = s8.shapes.add_textbox(Inches(x + 0.2), Inches(2.5), Inches(2.4), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = p_sub
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_WHITE
        for pt in points:
            p = tf.add_paragraph()
            p.text = f"\n• {pt}"
            p.font.size = Pt(10)
            p.font.color.rgb = TEXT_MUTED

    prs.save(output_path)
    print(f"Successfully generated {output_path} with 8 high-impact slides!")

if __name__ == "__main__":
    out = "VERDICT_8_Slide_Pitch.pptx"
    if len(sys.argv) > 1:
        out = sys.argv[1]
    create_deck(out)
