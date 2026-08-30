export interface DomainConfig {
  name: string;
  slug: string;
  key: string;
  iconName: 'Sprout' | 'Sun' | 'HeartPulse' | 'Navigation' | 'GraduationCap';
  taglineKey: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    name: 'AgriTech',
    slug: 'agritech',
    key: 'agritech',
    iconName: 'Sprout',
    taglineKey: 'domains.agritech.pitch',
    accentColor: 'emerald',
    badgeBg: 'bg-emerald2-500/10',
    badgeBorder: 'border-emerald2-500/30',
    badgeText: 'text-emerald2-400',
  },
  {
    name: 'CleanTech',
    slug: 'cleantech',
    key: 'cleantech',
    iconName: 'Sun',
    taglineKey: 'domains.cleantech.pitch',
    accentColor: 'amber',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
  },
  {
    name: 'HealthTech',
    slug: 'healthtech',
    key: 'healthtech',
    iconName: 'HeartPulse',
    taglineKey: 'domains.healthtech.pitch',
    accentColor: 'rose',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-400',
  },
  {
    name: 'Smart Mobility',
    slug: 'smart-mobility',
    key: 'smartMobility',
    iconName: 'Navigation',
    taglineKey: 'domains.smartMobility.pitch',
    accentColor: 'sky',
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/30',
    badgeText: 'text-sky-400',
  },
  {
    name: 'EdTech',
    slug: 'edtech',
    key: 'edtech',
    iconName: 'GraduationCap',
    taglineKey: 'domains.edtech.pitch',
    accentColor: 'indigo',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-400',
  },
];

export const SLUG_TO_DOMAIN_MAP: Record<string, string> = {
  agritech: 'AgriTech',
  cleantech: 'CleanTech',
  healthtech: 'HealthTech',
  'smart-mobility': 'Smart Mobility',
  edtech: 'EdTech',
};

export const DOMAIN_TO_SLUG_MAP: Record<string, string> = {
  AgriTech: 'agritech',
  CleanTech: 'cleantech',
  HealthTech: 'healthtech',
  'Smart Mobility': 'smart-mobility',
  EdTech: 'edtech',
};

export function getDomainConfigByName(name: string): DomainConfig | undefined {
  return DOMAIN_CONFIGS.find((d) => d.name.toLowerCase() === name.toLowerCase());
}

export function getDomainConfigBySlug(slug: string): DomainConfig | undefined {
  return DOMAIN_CONFIGS.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
}
