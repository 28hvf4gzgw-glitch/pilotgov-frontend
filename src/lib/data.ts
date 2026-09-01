export interface PastPilot {
  dept: string;
  title: string;
  outcome: string;
}

export interface Startup {
  id?: string;
  name: string;
  domain: string;
  tags: string[];
  eligibility: 'DPIIT Verified' | 'Provisional' | 'Pending';
  match: number;
  pilots: number;
  pitch: string;
  mission: string;
  trl: number;
  pastPilots: PastPilot[];
}

export const startups: Startup[] = [
  {
    id: 'agrosense-ai',
    name: 'AgroSense AI',
    domain: 'AgriTech',
    tags: ['IoT', 'AI'],
    eligibility: 'DPIIT Verified',
    match: 96,
    pilots: 3,
    pitch: 'Satellite + sensor analytics for crop yield forecasting across 12 states.',
    mission: 'Empower smallholder farmers with predictive agronomy so every district can plan against climate volatility.',
    trl: 8,
    pastPilots: [
      { dept: 'Dept. of Agriculture, Karnataka', title: 'Yield forecasting — 3 districts', outcome: 'Forecast accuracy 91% across kharif & rabi seasons' },
      { dept: 'Dept. of Rural Development', title: 'Crop loss assessment pilot', outcome: 'Reduced claim verification time by 40%' },
      { dept: 'NITI Aayog Innovation Cell', title: 'District-level climate risk model', outcome: 'Adopted for 8 district contingency plans' },
    ],
  },
  {
    id: 'cleangrid-energy',
    name: 'CleanGrid Energy',
    domain: 'CleanTech',
    tags: ['Grid', 'Solar'],
    eligibility: 'DPIIT Verified',
    match: 92,
    pilots: 2,
    pitch: 'Distributed solar microgrids for round-the-clock rural electrification.',
    mission: 'Replace diesel-dependent rural power with resilient, community-owned solar microgrids managed via a single dashboard.',
    trl: 7,
    pastPilots: [
      { dept: 'Dept. of Urban Infrastructure', title: 'Solar microgrids — 15 municipal zones', outcome: 'Scaled to full contract, 4.2MW deployed' },
      { dept: 'Ministry of New & Renewable Energy', title: 'Village microgrid resilience study', outcome: '99.4% uptime over 6-month pilot' },
    ],
  },
  {
    id: 'medtrack-solutions',
    name: 'MedTrack Solutions',
    domain: 'HealthTech',
    tags: ['EHR', 'Mobile'],
    eligibility: 'DPIIT Verified',
    match: 88,
    pilots: 4,
    pitch: 'Offline-first electronic health records for primary health centres.',
    mission: 'Ensure every primary health centre has a patient record that travels with the patient, online or off.',
    trl: 9,
    pastPilots: [
      { dept: 'Dept. of Health & Family Welfare', title: 'Offline EHR rollout — 50 PHCs', outcome: 'Patient record coverage up from 12% to 94%' },
      { dept: 'National Health Authority', title: 'ABHA integration pilot', outcome: 'Linked 1.8L records to Ayushman Bharat' },
      { dept: 'Dept. of Health, Tamil Nadu', title: 'Maternal tracking — 3 districts', outcome: 'Antenatal follow-up improved by 35%' },
      { dept: 'WHO India Field Office', title: 'Vaccine cold-chain logging', outcome: 'Zero spoilage events over 90-day pilot' },
    ],
  },
  {
    id: 'urbanflow-logistics',
    name: 'UrbanFlow Logistics',
    domain: 'Smart Mobility',
    tags: ['Routing', 'AI'],
    eligibility: 'DPIIT Verified',
    match: 84,
    pilots: 1,
    pitch: 'AI-driven traffic routing to cut urban commute times by 22%.',
    mission: 'Give city planners a live, adaptive routing layer that re-optimises signal timing and bus routes against real demand.',
    trl: 6,
    pastPilots: [
      { dept: 'Dept. of Urban Infrastructure', title: 'AI traffic routing — 3 corridor cities', outcome: 'Average commute down 22% on pilot corridors' },
    ],
  },
  {
    id: 'edubridge',
    name: 'EduBridge',
    domain: 'EdTech',
    tags: ['Learning', 'Vernacular'],
    eligibility: 'DPIIT Verified',
    match: 78,
    pilots: 2,
    pitch: 'Vernacular digital classrooms bridging the rural education gap.',
    mission: 'Bring grade-appropriate, mother-tongue digital lessons to villages where broadband is unreliable and device access is shared.',
    trl: 7,
    pastPilots: [
      { dept: 'Dept. of School Education, MP', title: 'Vernacular lessons — 60 schools', outcome: 'Lesson completion rate up from 28% to 71%' },
      { dept: 'Ministry of Education', title: 'DIKSHA content localisation', outcome: 'Content delivered in 6 regional languages' },
    ],
  },
];

export interface PilotCard {
  id: string;
  startup: string;
  dept: string;
  title: string;
  budget: string;
  progress: number;
  date: string;
  status?: string;
  scaledContractId?: string;
}

export interface ScaledContract {
  id: string;
  startup: string;
  domain: string;
  dept: string;
  title: string;
  value: string;
  date: string;
  trl: number;
  eligibility: 'DPIIT Verified' | 'Provisional' | 'Pending';
  description: string;
}

export interface ImpactSummary {
  needsPosted: number;
  activePilots: number;
  contractsScaled: number;
  totalScaledValue: string;
  pipelineFunnel: {
    posted: number;
    piloting: number;
    scaling: number;
    scaled: number;
  };
  byDomain: Record<string, number>;
  scaledContracts?: ScaledContract[];
}

export const fallbackScaledContracts: ScaledContract[] = [
  {
    id: 'cleangrid-solar-microgrids',
    startup: 'CleanGrid Energy',
    domain: 'CleanTech',
    dept: 'Dept. of Urban Infrastructure',
    title: 'Solar microgrids for 15 municipal zones',
    value: '₹4.5 Cr',
    date: 'Scaled Jun 2026',
    trl: 9,
    eligibility: 'DPIIT Verified',
    description: '4.2MW distributed solar microgrids deployed across municipal zones with 99.4% uptime resilience.',
  },
  {
    id: 'agrosense-crop-yield',
    startup: 'AgroSense AI',
    domain: 'AgriTech',
    dept: 'Dept. of Rural Development',
    title: 'Crop yield forecasting across 8 districts',
    value: '₹3.8 Cr',
    date: 'Scaled May 2026',
    trl: 8,
    eligibility: 'DPIIT Verified',
    description: 'District-level climate risk and predictive agronomy platform integrated with state crop contingency frameworks.',
  },
  {
    id: 'medtrack-offline-ehr',
    startup: 'MedTrack Solutions',
    domain: 'HealthTech',
    dept: 'Dept. of Health & Family Welfare',
    title: 'Offline EHR rollout in 120 primary health centres',
    value: '₹2.9 Cr',
    date: 'Scaled Apr 2026',
    trl: 9,
    eligibility: 'DPIIT Verified',
    description: 'Offline-first EHR platform linked with Ayushman Bharat ABHA IDs, maintaining zero data loss during connectivity outages.',
  },
  {
    id: 'urbanflow-traffic-routing',
    startup: 'UrbanFlow Logistics',
    domain: 'Smart Mobility',
    dept: 'Dept. of Urban Infrastructure',
    title: 'AI traffic routing pilot — 3 corridor cities',
    value: '₹2.1 Cr',
    date: 'Scaled Mar 2026',
    trl: 7,
    eligibility: 'DPIIT Verified',
    description: 'Adaptive traffic signal scheduling and routing algorithm reducing average corridor commute times by 22%.',
  },
  {
    id: 'edubridge-digital-classrooms',
    startup: 'EduBridge',
    domain: 'EdTech',
    dept: 'Dept. of School Education',
    title: 'Vernacular digital classrooms for 350 rural schools',
    value: '₹1.5 Cr',
    date: 'Scaled Feb 2026',
    trl: 8,
    eligibility: 'DPIIT Verified',
    description: 'Mother-tongue digital learning modules with offline sync improving curriculum completion rates from 28% to 71%.',
  },
];

export const fallbackImpactSummary: ImpactSummary = {
  needsPosted: 18,
  activePilots: 7,
  contractsScaled: 5,
  totalScaledValue: '₹14.8 Cr',
  pipelineFunnel: {
    posted: 18,
    piloting: 7,
    scaling: 5,
    scaled: 5,
  },
  byDomain: {
    AgriTech: 6,
    HealthTech: 5,
    CleanTech: 4,
    'Smart Mobility': 3,
    EdTech: 2,
  },
  scaledContracts: fallbackScaledContracts,
};

export interface PilotColumn {
  status: string;
  accent: string;
  cards: PilotCard[];
}

export const pilotColumns: PilotColumn[] = [
  {
    status: 'Applied',
    accent: 'text-sky-400',
    cards: [
      {
        id: 'edubridge-digital-classrooms',
        startup: 'EduBridge',
        dept: 'Dept. of Rural Development',
        title: 'Vernacular e-learning for 240 village schools',
        budget: '₹48L',
        progress: 10,
        date: 'Applied Mar 2026',
      },
    ],
  },
  {
    status: 'Piloting',
    accent: 'text-amber-400',
    cards: [
      {
        id: 'agrosense-crop-yield',
        startup: 'AgroSense AI',
        dept: 'Dept. of Rural Development',
        title: 'Crop yield forecasting across 8 districts',
        budget: '₹1.2Cr',
        progress: 60,
        date: 'Pilot started Jan 2026',
      },
      {
        id: 'medtrack-offline-ehr',
        startup: 'MedTrack Solutions',
        dept: 'Dept. of Health & Family Welfare',
        title: 'Offline EHR rollout in 50 primary health centres',
        budget: '₹85L',
        progress: 45,
        date: 'Pilot started Feb 2026',
      },
    ],
  },
  {
    status: 'Scaling',
    accent: 'text-emerald-400',
    cards: [
      {
        id: 'cleangrid-solar-microgrids',
        startup: 'CleanGrid Energy',
        dept: 'Dept. of Urban Infrastructure',
        title: 'Solar microgrids for 15 municipal zones',
        budget: '₹4.5Cr',
        progress: 100,
        date: 'Pilot started Jan 2026 · Scaled Jun 2026',
      },
    ],
  },
  {
    status: 'Completed',
    accent: 'text-white/60',
    cards: [
      {
        id: 'urbanflow-traffic-routing',
        startup: 'UrbanFlow Logistics',
        dept: 'Dept. of Urban Infrastructure',
        title: 'AI traffic routing pilot — 3 corridor cities',
        budget: '₹62L',
        progress: 100,
        date: 'Completed Apr 2026',
        status: 'Completed',
        scaledContractId: 'urbanflow-traffic-routing',
      },
    ],
  },
];

export const outcomeData = [
  { label: 'Cost savings vs traditional vendor', value: 34, unit: '%', delta: '+34%' },
  { label: 'Time-to-deploy (PilotGov)', value: 25, unit: 'days', delta: '45 vs 180' },
  { label: 'Pilot success rate', value: 78, unit: '%', delta: '+31%' },
  { label: 'Scaled to full contract', value: 64, unit: '%', delta: '+19%' },
];

export const departments = [
  'Dept. of Rural Development',
  'Dept. of Health & Family Welfare',
  'Dept. of Urban Infrastructure',
];

// Numeric/structural data only — display text (labels, notes, titles,
// descriptions) now lives in the i18n locale files under problem.stat*
// and howItWorks.step*, looked up by index in the components.
export const statValues = ['3.4%', '9 months', '67%'];
export const stepNumbers = ['01', '02', '03', '04'];
