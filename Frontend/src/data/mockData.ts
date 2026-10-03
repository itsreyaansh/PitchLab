import { AIJudge, StartupBrief, EvaluationReport, PitchSession } from '../types';

export const INITIAL_JUDGES: AIJudge[] = [
  {
    id: 'market-1',
    name: 'Aarav Mehta',
    role: 'Market Analyst',
    shortRole: 'Market',
    tagline: 'Evaluates market size, TAM/SAM, competitive landscape & positioning.',
    avatarColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/40',
    accentHex: '#F59E0B',
    voiceGender: 'male',
    voicePitch: 0.95,
    voiceRate: 1.0,
    bio: 'Ex-McKinsey Principal & Partner at Summit Growth Capital. Focused on total addressable market clarity & market positioning.',
    keyFocus: ['TAM / SAM Validation', 'Competitor Moat', 'Customer Pain Severity'],
    expression: 'neutral',
    state: 'IDLE',
    avatarVariant: 'aarav'
  },
  {
    id: 'product-1',
    name: 'Maya Lin',
    role: 'Product & Technology',
    shortRole: 'Product & Tech',
    tagline: 'Analyzes technical architecture, UX differentiation & defensibility.',
    avatarColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40',
    accentHex: '#06B6D4',
    voiceGender: 'female',
    voicePitch: 1.1,
    voiceRate: 1.05,
    bio: 'Former VP of Product at Stripe & Founder of InfraCore. Obsessed with slick product workflows and technical defensibility.',
    keyFocus: ['Tech Stack Defensibility', 'User Experience Depth', 'Scalability Architecture'],
    expression: 'neutral',
    state: 'IDLE',
    avatarVariant: 'maya'
  },
  {
    id: 'finance-1',
    name: 'Rohan Deshmukh',
    role: 'Finance & Business',
    shortRole: 'Finance',
    tagline: 'Grills on unit economics, CAC/LTV ratio, gross margins & runway.',
    avatarColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
    accentHex: '#10B981',
    voiceGender: 'male',
    voicePitch: 0.9,
    voiceRate: 0.95,
    bio: 'Managing Director at Horizon Ventures. Known for rigorous interrogation of customer acquisition cost vs lifetime value.',
    keyFocus: ['CAC vs LTV', 'Gross Margin Model', 'Runway & Burn Efficiency'],
    expression: 'neutral',
    state: 'IDLE',
    avatarVariant: 'rohan'
  },
  {
    id: 'growth-1',
    name: 'Naina Kapoor',
    role: 'Growth & Marketing',
    shortRole: 'Growth',
    tagline: 'Tests GTM engine, viral referral loops & customer acquisition channels.',
    avatarColor: 'from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/40',
    accentHex: '#D946EF',
    voiceGender: 'female',
    voicePitch: 1.15,
    voiceRate: 1.1,
    bio: 'Growth Partner at Velocity Fund. Scaled 4 B2B SaaS startups from $0 to $20M ARR.',
    keyFocus: ['GTM Channel Economics', 'Retention Dynamics', 'Viral Referral Coefficient'],
    expression: 'neutral',
    state: 'IDLE',
    avatarVariant: 'naina'
  },
  {
    id: 'operations-1',
    name: 'Kabir Verma',
    role: 'Operations & Scale',
    shortRole: 'Operations',
    tagline: 'Examines operational bottlenecks, team readiness & execution velocity.',
    avatarColor: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/40',
    accentHex: '#6366F1',
    voiceGender: 'male',
    voicePitch: 1.0,
    voiceRate: 1.0,
    bio: 'Chief Operating Officer turned Angel Investor. Expert in supply chain, hiring cadence & regulatory navigation.',
    keyFocus: ['Operational Bottlenecks', 'Team Hiring Blueprint', 'Execution Risk'],
    expression: 'neutral',
    state: 'IDLE',
    avatarVariant: 'kabir'
  },
  {
    id: 'risk-1',
    name: 'Vikram Thorne',
    role: 'Investor & Risk',
    shortRole: 'Risk & Return',
    tagline: 'Challenges valuation, downside protection, cap table & exit multi-bagger potential.',
    avatarColor: 'from-rose-500/20 to-red-500/10 border-rose-500/40',
    accentHex: '#F43F5E',
    voiceGender: 'male',
    voicePitch: 0.85,
    voiceRate: 0.9,
    bio: 'Founding General Partner at Blackstone Venture Partners. Focuses on downside risk, regulatory exposure & 10x exit logic.',
    keyFocus: ['Valuation Justification', 'Cap Table Health', 'Downside Risk Exposure'],
    expression: 'neutral',
    state: 'IDLE',
    avatarVariant: 'vikram'
  }
];

export const SAMPLE_BRIEF: StartupBrief = {
  id: 'brief-watchai',
  startupName: 'WatchAI',
  tagline: 'Autonomous AI Visual Intelligence for Physical Retail Stores',
  problem: 'Physical retail stores lose over $112 Billion annually to stockouts, misplaced inventory, and slow customer checkout queues. Existing camera systems are passive security feeds that provide zero real-time operational intelligence.',
  solution: 'WatchAI connects directly to existing camera infrastructure via edge nodes to convert legacy video into live operational metrics: automated stockout alerts, queue prediction, and loss-prevention telemetry.',
  targetCustomer: 'Mid-to-large retail chains (100 to 5,000 locations) across Supermarkets, Electronics, and Fashion in North America & India.',
  marketSize: '$38.4B Global Retail Computer Vision Market expanding at 28.4% CAGR.',
  businessModel: 'B2B SaaS per camera per month subscription.',
  revenueModel: '$49/camera/month with average store deploying 30 cameras ($1,470/store/month ARR).',
  pricing: 'Standard Tier: $49/cam/mo. Enterprise Tier: $79/cam/mo with custom API integrations and on-prem edge hardware.',
  traction: '$420K ARR across 28 pilot retail stores (8 enterprise brands). 94% camera uptime and 98.2% detection precision.',
  competition: 'Legacy CCTV manufacturers (Hikvision/Axis - dumb hardware), Standard Analytics software (Aislelabs - basic WiFi counting).',
  competitiveAdvantage: 'Zero hardware replacement cost; proprietary ultra-lightweight ONNX edge model that processes 30 FPS on existing $50 cameras.',
  team: 'Founders: Vihaan (Ex-Google Computer Vision Lead) & Priya (Ex-Target Operations VP). 12 engineers & 3 GTM reps.',
  fundingAsk: '$2.5M Seed Round at $12M Post-Money Valuation.',
  useOfFunds: '50% Engineering & Edge AI optimization, 35% GTM Sales Team Expansion, 15% Operational Contingency.',
  growthStrategy: 'Direct Enterprise Sales targeting retail CTOs + direct integration partnership with top 3 POS hardware vendors.',
  rawText: `WatchAI — Autonomous AI Visual Intelligence for Retail
Target Customer: Enterprise retail store chains.
Problem: Physical retail stores lose $112B annually to inventory misplacement and long checkout queues.
Solution: Edge AI connected to existing CCTV cameras for real-time stockout and queue alerts.
Traction: $420K ARR, 28 locations active. $49/camera/month pricing.
Ask: $2.5M Seed round for GTM & Engineering expansion.`
};

export const MOCK_EVALUATION_REPORT: EvaluationReport = {
  sessionId: 'session-oct03-watchai',
  startupName: 'WatchAI',
  tagline: 'Autonomous AI Visual Intelligence for Retail',
  date: 'Oct 03, 2026',
  duration: '09:42',
  overallScore: 78,
  questionsCount: 18,
  agentCount: 6,
  categoryScores: [
    { category: 'Problem & Market Need', score: 86, maxScore: 100, keyIssue: 'Validated clear pain point in retail stockout loss.', status: 'strong' },
    { category: 'Solution & Tech Moat', score: 82, maxScore: 100, keyIssue: 'Edge ONNX model creates strong hardware agility.', status: 'strong' },
    { category: 'Business & Unit Economics', score: 61, maxScore: 100, keyIssue: 'CAC metrics & acquisition payload require empirical proof.', status: 'critical' },
    { category: 'Go-To-Market Strategy', score: 72, maxScore: 100, keyIssue: 'Sales cycle duration for enterprise retail is understated.', status: 'moderate' },
    { category: 'Operations & Scale', score: 79, maxScore: 100, keyIssue: 'Edge node hardware distribution & support burden.', status: 'moderate' },
    { category: 'Risk & Valuation', score: 68, maxScore: 100, keyIssue: '$12M Post-Money valuation is steep relative to $420K ARR.', status: 'critical' },
    { category: 'Founder Communication', score: 91, maxScore: 100, keyIssue: 'Direct, confident articulation under pressure cross-examination.', status: 'strong' }
  ],
  strengths: [
    { id: 's1', title: 'Crisp Problem Definition', description: 'Quantified $112B market pain with explicit target store sizes and camera metrics.' },
    { id: 's2', title: 'Zero Hardware Replacement Moat', description: 'Retrofitting existing CCTV infrastructure removes major enterprise sales friction.' },
    { id: 's3', title: 'High Pitch Composure', description: 'Maintained clear narrative flow when challenged on competitor CCTV hardware features.' }
  ],
  improvements: [
    {
      id: 'i1',
      category: 'FINANCE & UNIT ECONOMICS',
      title: 'Customer Acquisition Cost (CAC) Alignment',
      evidence: 'Stated CAC during brief presentation was ₹100 ($1.20) per lead, but later stated acquiring 200 stores cost $50,000 ($250 per store).',
      improveBy: 'Unify lead-level vs store-level CAC numbers in financial deck annex.',
      priority: 'high'
    },
    {
      id: 'i2',
      category: 'GO-TO-MARKET',
      title: 'Enterprise Sales Cycle Realism',
      evidence: 'Estimated a 30-day enterprise retail sales cycle. Standard retail IT procurement typically spans 90 to 180 days.',
      improveBy: 'Include pilot-to-contract conversion timeline benchmarks in your strategy.',
      priority: 'medium'
    },
    {
      id: 'i3',
      category: 'VALUATION & RISK',
      title: 'Valuation Multiple Justification',
      evidence: '$12M post-money valuation represents ~28x ARR multiple ($420K ARR), above current 15x SaaS benchmarks.',
      improveBy: 'Prepare comparative transaction comps showcasing hardware-free SaaS multiples.',
      priority: 'high'
    }
  ],
  contradictions: [
    {
      id: 'c1',
      title: 'Unit Acquisition Cost Discrepancy',
      earlierStatement: '"Our customer acquisition cost (CAC) per location is around ₹100 ($1.20)."',
      laterStatement: '"We spent $50,000 in sales and marketing across our recent cohort to acquire 200 store locations."',
      calculation: 'Actual Acquisition Cost = $50,000 / 200 locations = $250 / location.',
      whyItMatters: 'The panel requires accurate unit economics to validate runway and GTM scalability.',
      category: 'Finance'
    },
    {
      id: 'c2',
      title: 'Edge Processing Latency Claim',
      earlierStatement: '"Processing happens 100% on the local edge camera node with zero cloud bandwidth usage."',
      laterStatement: '"We stream HD video feeds to our cloud backend for deep historical trend analysis."',
      calculation: 'Streaming HD video requires 4–6 Mbps per camera continuous cloud bandwidth.',
      whyItMatters: 'Product & Tech panel noted potential cloud egress cost spike not reflected in margin model.',
      category: 'Product & Tech'
    }
  ],
  unansweredQuestions: [
    {
      id: 'q1',
      index: 1,
      question: 'What is your net dollar retention (NDR) across your initial 8 enterprise retail pilots?',
      judgeRole: 'Finance & Business',
      whyImportant: 'Validates whether retail chains expand camera count after initial 30-day trial.'
    },
    {
      id: 'q2',
      index: 2,
      question: 'How do you handle privacy & GDPR / facial recognition regulatory restrictions in European stores?',
      judgeRole: 'Investor & Risk',
      whyImportant: 'Ensures global expansion is not blocked by data privacy laws.'
    },
    {
      id: 'q3',
      index: 3,
      question: 'If Hikvision or Axis embeds edge AI stockout models into their cameras natively, what is your moat?',
      judgeRole: 'Product & Technology',
      whyImportant: 'Crucial for long-term venture defense against camera OEMs.'
    }
  ],
  nextPitchChecklist: [
    { id: 'chk1', text: 'Reconcile CAC per store ($250) vs CAC per lead in deck annex', completed: false, category: 'Finance' },
    { id: 'chk2', text: 'Prepare GDPR non-biometric spatial tracking compliance sheet', completed: true, category: 'Risk' },
    { id: 'chk3', text: 'Include pilot expansion NDR cohort graph (show camera expansion velocity)', completed: false, category: 'Growth' },
    { id: 'chk4', text: 'Refine valuation justification comp table for $12M Seed ask', completed: false, category: 'Finance' },
    { id: 'chk5', text: 'Add OEM camera partner integration roadmap slide', completed: true, category: 'Product' }
  ],
  judgeInsights: [
    {
      judgeId: 'market-1',
      judgeName: 'Aarav Mehta',
      role: 'Market Analyst',
      score: 86,
      strengths: ['Clear quantification of retail losses ($112B)', 'Well defined TAM in North America'],
      concerns: ['Competitor list omitted specialized video analytics vendors like Aislelabs'],
      questionsAsked: 3,
      missingInfo: ['Breakdown of SAM in India vs US markets']
    },
    {
      judgeId: 'product-1',
      judgeName: 'Maya Lin',
      role: 'Product & Technology',
      score: 82,
      strengths: ['Clever ONNX edge optimization', 'Zero camera hardware replacement'],
      concerns: ['Bandwidth requirements for historical cloud analytics'],
      questionsAsked: 4,
      missingInfo: ['SDK support matrix for legacy 720p analog IP cameras']
    },
    {
      judgeId: 'finance-1',
      judgeName: 'Rohan Deshmukh',
      role: 'Finance & Business',
      score: 61,
      strengths: ['Simple $49/cam/mo pricing structure'],
      concerns: ['CAC calculation inconsistency ($1.20 vs $250/store)', 'Gross margin impact of cloud video storage'],
      questionsAsked: 4,
      missingInfo: ['LTV projection calculation breakdown']
    },
    {
      judgeId: 'growth-1',
      judgeName: 'Naina Kapoor',
      role: 'Growth & Marketing',
      score: 72,
      strengths: ['Direct sales approach to retail CTOs'],
      concerns: ['Underestimated sales cycle duration (claimed 30 days vs 90+ days)'],
      questionsAsked: 3,
      missingInfo: ['POS vendor integration partnership terms']
    },
    {
      judgeId: 'operations-1',
      judgeName: 'Kabir Verma',
      role: 'Operations & Scale',
      score: 79,
      strengths: ['Strong background in Google CV & retail ops'],
      concerns: ['Edge node maintenance overhead when expanding to 100+ stores'],
      questionsAsked: 2,
      missingInfo: ['Field support team deployment timeline']
    },
    {
      judgeId: 'risk-1',
      judgeName: 'Vikram Thorne',
      role: 'Investor & Risk',
      score: 68,
      strengths: ['Strong pilot retention so far'],
      concerns: ['28x ARR valuation ask ($12M post on $420K ARR)'],
      questionsAsked: 2,
      missingInfo: ['Cap table dilution history']
    }
  ]
};

export const RECENT_SESSIONS: PitchSession[] = [
  {
    id: 'session-oct03-watchai',
    startupName: 'WatchAI',
    tagline: 'Autonomous AI Visual Intelligence for Retail',
    date: 'Oct 03, 2026',
    duration: '09:42',
    overallScore: 78,
    brief: SAMPLE_BRIEF,
    status: 'completed',
    categoryHighlights: { finance: 61, market: 86, product: 82, communication: 91 }
  },
  {
    id: 'session-sep29-shopflow',
    startupName: 'ShopFlow',
    tagline: 'Instant 1-Click Checkout Infrastructure for WhatsApp Stores',
    date: 'Sep 29, 2026',
    duration: '11:08',
    overallScore: 72,
    brief: {
      ...SAMPLE_BRIEF,
      id: 'brief-shopflow',
      startupName: 'ShopFlow',
      tagline: '1-Click Checkout for WhatsApp Commerce',
      problem: 'WhatsApp merchants lose 65% of buyers at payment redirection links.'
    },
    status: 'completed',
    categoryHighlights: { finance: 74, market: 79, product: 68, communication: 85 }
  },
  {
    id: 'session-sep22-finpulse',
    startupName: 'FinPulse',
    tagline: 'AI Treasury & Automated Yield Optimizer for Mid-Market CFOs',
    date: 'Sep 22, 2026',
    duration: '08:15',
    overallScore: 89,
    brief: {
      ...SAMPLE_BRIEF,
      id: 'brief-finpulse',
      startupName: 'FinPulse',
      tagline: 'AI Treasury Engine for CFOs',
      problem: 'Corporate cash idle in checking accounts yields 0% interest while inflation burns 4%.'
    },
    status: 'completed',
    categoryHighlights: { finance: 92, market: 88, product: 89, communication: 94 }
  }
];

export const ANALYTICS_DATA = {
  scoreTrend: [
    { session: 'Pitch 1 (FinPulse)', score: 68, date: 'Sep 10' },
    { session: 'Pitch 2 (ShopFlow)', score: 72, date: 'Sep 22' },
    { session: 'Pitch 3 (WatchAI v1)', score: 74, date: 'Sep 29' },
    { session: 'Pitch 4 (WatchAI v2)', score: 78, date: 'Oct 03' },
    { session: 'Pitch 5 (FinPulse v2)', score: 89, date: 'Oct 03' }
  ],
  categoryProgress: [
    { category: 'Finance & Unit Econ', initial: 54, current: 70 },
    { category: 'Market & TAM', initial: 68, current: 86 },
    { category: 'Product & Tech', initial: 72, current: 82 },
    { category: 'Go-To-Market', initial: 60, current: 72 },
    { category: 'Founder Pitch Delivery', initial: 80, current: 91 }
  ],
  recurringIssues: [
    { issue: 'CAC vs LTV calculation clarity', occurrences: 4, severity: 'High' },
    { issue: 'Valuation comps multiple justification', occurrences: 3, severity: 'High' },
    { issue: 'Enterprise sales cycle duration realism', occurrences: 3, severity: 'Medium' },
    { issue: 'Competitor defensibility & moat response', occurrences: 2, severity: 'Medium' }
  ]
};

export const MOCK_PITCH_SESSIONS = RECENT_SESSIONS;

