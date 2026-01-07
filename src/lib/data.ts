// User Attribution Data for Admin Tool
// This module provides sample user data with LLM-style attribution narratives

export type AttributionStatus = 'attributed' | 'not_attributed' | 'partial';
export type UserType = 'crypto_native' | 'fiat_focused' | 'mixed';
export type SignalType = 'post_view' | 'post_click' | 'none';

export interface TimelineEvent {
  date: string;
  type: 'visit' | 'impression' | 'click' | 'registration' | 'deposit' | 'return';
  description: string;
  source?: string;
}

export interface DailyImpression {
  date: string;
  domain: string;
  count: number;
}

export interface AdExposure {
  date: string;
  format: string;
  publisher: string;
  clicked: boolean;
}

export interface AttributionDecision {
  status: AttributionStatus;
  signal: SignalType;
  window: '7d' | '30d' | null;
  campaign: string | null;
  reason: string;
}

export interface UserNarrative {
  whoThisUserIs: string;
  beforeAds: string;
  adExposure: string;
  afterAds: string;
  howAttributed: string;
}

export interface UserProfile {
  // Core identifiers
  sdkStrongId: string;
  metawinUserId: string;
  metawinUserIdFirstTime: string;
  metawinUserIdFirstFtd: string;

  // Timestamps
  firstTimeSeen: string;
  firstTimeFtd: string;
  firstTimeAttributedFtd: string;
  firstTimeAttributed: string;

  // Attribution metrics
  daysVisitBeforeBeingAttributed: number;
  totalAttributedFtd: number;
  totalAttributedFtdValue: number;
  totalAttributedPurchase: number;
  totalAttributedPurchaseValue: number;

  // Ad metrics
  dailyImps: DailyImpression[];
  banners: string;
  dailyClicks: number;

  // Wallet info
  allWallets: string;
  primaryCountry: string;
  balanceGroup: string;
  walletProviders: string;

  // Legacy fields for narrative support
  timeline: TimelineEvent[];
  adExposures: AdExposure[];
  attribution: AttributionDecision;
  narrative: UserNarrative;
}

// Sample users with real data from production
export const sampleUsers: UserProfile[] = [
  {
    sdkStrongId: '2fd10e2bb39974f65a1aa18051c127175d2dcab2e7fc77089e4a4fb9',
    metawinUserId: 'ccbebfe2-b52d-46a2-81a4-668912c04148',
    metawinUserIdFirstTime: '2025-11-26 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-11-29',
    firstTimeSeen: '2025-09-23',
    firstTimeFtd: '2025-11-29',
    firstTimeAttributedFtd: '2025-11-29',
    firstTimeAttributed: '2025-11-05',
    daysVisitBeforeBeingAttributed: 27,
    totalAttributedFtd: 10,
    totalAttributedFtdValue: 2971.0,
    totalAttributedPurchase: 20,
    totalAttributedPurchaseValue: 300.118847,
    dailyImps: [
      { date: '2025-11-05 00:00:00.000', domain: 'accuweather.com', count: 1 }
    ],
    banners: '300×250, 728×90',
    dailyClicks: 0,
    allWallets: '2a39e252f8b1c4d5e6a7b8c9d0e1f234',
    primaryCountry: 'JP',
    balanceGroup: 'No Balance',
    walletProviders: 'MetaMask',
    timeline: [
      { date: '2025-09-23', type: 'visit', description: 'First site visit - browsed homepage' },
      { date: '2025-11-05', type: 'impression', description: 'First Addressable ad impression', source: 'AccuWeather' },
      { date: '2025-11-29', type: 'registration', description: 'Completed registration' },
      { date: '2025-11-29', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-11-05', format: '300×250', publisher: 'AccuWeather', clicked: false },
      { date: '2025-11-15', format: '728×90', publisher: 'Political Compass', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '7d',
      campaign: 'Q4 Crypto Gamblers',
      reason: 'All deposits fall inside the Addressable attribution window.',
    },
    narrative: {
      whoThisUserIs: 'This is a US-based user, crypto-native, with a MetaMask wallet.',
      beforeAds: 'We first see them on Metawin around Sept 23. Over the next 27 different days, they come back repeatedly.',
      adExposure: 'On Nov 5, this user starts seeing Addressable ads.',
      afterAds: 'They keep visiting the site after that. Then on Nov 29, they finally make their first deposit.',
      howAttributed: 'All of those deposits fall inside the Addressable attribution window.',
    },
  },
  {
    sdkStrongId: '2a39e252d1887ee04ec58bf1b8ba89f2f6fe56a559646c8b5703cb0b',
    metawinUserId: '209425f0-94c6-4d4b-88aa-feaf3af366d6',
    metawinUserIdFirstTime: '2025-11-25 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-12-11',
    firstTimeSeen: '2025-09-24',
    firstTimeFtd: '2025-12-11',
    firstTimeAttributedFtd: '2025-12-11',
    firstTimeAttributed: '2025-10-21',
    daysVisitBeforeBeingAttributed: 17,
    totalAttributedFtd: 6,
    totalAttributedFtdValue: 20945.0,
    totalAttributedPurchase: 4,
    totalAttributedPurchaseValue: 5002.0,
    dailyImps: [
      { date: '2025-10-21 00:00:00.000', domain: 'coindesk.com', count: 50 },
      { date: '2025-10-21 00:00:00.000', domain: 'myinstants.com', count: 7 },
      { date: '2025-10-21 00:00:00.000', domain: 'inchcalculator.com', count: 7 },
      { date: '2025-10-22 00:00:00.000', domain: 'modrinth.com', count: 10 },
      { date: '2025-11-13 00:00:00.000', domain: 'dailymotion.com', count: 16 },
      { date: '2025-12-11 00:00:00.000', domain: 'imgflip.com', count: 4 }
    ],
    banners: '300×600, 300×250',
    dailyClicks: 1,
    allWallets: '7f82b4c1d9e0a3f2b5c8d7e6f4a1b0c9',
    primaryCountry: 'US',
    balanceGroup: '<$1k',
    walletProviders: 'Coinbase Wallet',
    timeline: [
      { date: '2025-09-24', type: 'visit', description: 'First site visit' },
      { date: '2025-10-21', type: 'impression', description: 'Ad impression on CoinDesk', source: 'CoinDesk' },
      { date: '2025-12-11', type: 'registration', description: 'Completed registration' },
      { date: '2025-12-11', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-10-21', format: '300×600', publisher: 'CoinDesk', clicked: false },
      { date: '2025-11-05', format: '300×250', publisher: 'DeFi Pulse', clicked: true },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_click',
      window: '30d',
      campaign: '',
      reason: 'User clicked ad and converted within attribution window.',
    },
    narrative: {
      whoThisUserIs: 'A GB-based crypto-native user with an active DeFi wallet.',
      beforeAds: 'First seen on Sept 24, browsing the site.',
      adExposure: 'On Oct 21, they saw an ad on CoinDesk. Later clicked an ad on DeFi Pulse.',
      afterAds: 'After the click, they visited the site multiple times before converting.',
      howAttributed: 'Attributed via post-click within 30-day window.',
    },
  },
  {
    sdkStrongId: '49460946fa72daafa773e29707235ef5e78650d25b8dce1d1d4316e8',
    metawinUserId: 'b76ee32c-59a9-4f38-8be2-39b36649d636',
    metawinUserIdFirstTime: '-',
    metawinUserIdFirstFtd: '2025-11-12',
    firstTimeSeen: '2025-10-28',
    firstTimeFtd: '2025-11-12',
    firstTimeAttributedFtd: '2025-11-12',
    firstTimeAttributed: '2025-11-12',
    daysVisitBeforeBeingAttributed: 1,
    totalAttributedFtd: 2,
    totalAttributedFtdValue: 0,
    totalAttributedPurchase: 0,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-10-28 00:00:00.000', domain: 'espn.com', count: 1 }
    ],
    banners: '728×90',
    dailyClicks: 1,
    allWallets: 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    primaryCountry: 'IN',
    balanceGroup: '$1K - $10K',
    walletProviders: 'MetaMask, WalletConnect',
    timeline: [
      { date: '2025-10-28', type: 'impression', description: 'Display ad on ESPN', source: 'ESPN' },
      { date: '2025-11-12', type: 'click', description: 'Clicked affiliate link', source: 'Affiliate' },
      { date: '2025-11-12', type: 'registration', description: 'Completed registration' },
      { date: '2025-11-12', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-10-28', format: '728×90', publisher: 'ESPN', clicked: false },
      { date: '2025-11-12', format: 'affiliate_link', publisher: 'Gambling Forum', clicked: true },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_click',
      window: '30d',
      campaign: 'Affiliate Push',
      reason: 'Direct click-to-registration-to-FTD path.',
    },
    narrative: {
      whoThisUserIs: 'This user has both crypto and fiat deposit history.',
      beforeAds: 'First seen Oct 28.',
      adExposure: 'On Nov 12, they clicked an affiliate link and converted same day.',
      afterAds: 'Instant conversion after click.',
      howAttributed: 'This is a clean post-click attribution.',
    },
  },
  {
    sdkStrongId: '8951d375cb5f57ae9776f278fedae899e9c7acb07b8df92610fd6f4a',
    metawinUserId: 'c7cdb78d-d653-4c31-a42a-8db9c5902f3e',
    metawinUserIdFirstTime: '2025-11-28 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-11-28',
    firstTimeSeen: '2025-09-26',
    firstTimeFtd: '2025-11-28',
    firstTimeAttributedFtd: '2025-11-28',
    firstTimeAttributed: '2025-10-24',
    daysVisitBeforeBeingAttributed: 17,
    totalAttributedFtd: 6,
    totalAttributedFtdValue: 793.56,
    totalAttributedPurchase: 3,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-10-24 00:00:00.000', domain: 'distanta.ro', count: 10 },
      { date: '2025-10-24 00:00:00.000', domain: 'papergames.io', count: 4 },
      { date: '2025-10-24 00:00:00.000', domain: 'finance.yahoo.com', count: 4 },
      { date: '2025-10-25 00:00:00.000', domain: 'coinmarketcap.com', count: 1 },
      { date: '2025-11-05 00:00:00.000', domain: 'photopea.com', count: 1 }
    ],
    banners: '300×250, 728×90',
    dailyClicks: 1,
    allWallets: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    primaryCountry: 'RO',
    balanceGroup: '<$1k',
    walletProviders: 'Ledger',
    timeline: [
      { date: '2025-09-26', type: 'visit', description: 'Initial site visit' },
      { date: '2025-10-24', type: 'impression', description: 'First ad impression', source: 'Yahoo Finance' },
      { date: '2025-11-28', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-10-24', format: '300×250', publisher: 'Yahoo Finance', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '30d',
      campaign: 'Broad Awareness Q4',
      reason: 'View signal within attribution window.',
    },
    narrative: {
      whoThisUserIs: 'A Canadian user with Ledger wallet.',
      beforeAds: 'This user first visited on Sept 26.',
      adExposure: 'On Oct 24, they saw their first ad.',
      afterAds: 'Made first deposit on Nov 28.',
      howAttributed: 'Attributed via post-view.',
    },
  },
  {
    sdkStrongId: '2a03ac2b2498c0bf25d617a9970fa98789d1bbdc606ec9d313dbbdd3',
    metawinUserId: '1456c524-9fb0-49ec-84a9-29ed077f13de',
    metawinUserIdFirstTime: '2025-12-05 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-12-05',
    firstTimeSeen: '2025-10-12',
    firstTimeFtd: '2025-12-05',
    firstTimeAttributedFtd: '2025-12-05',
    firstTimeAttributed: '2025-11-08',
    daysVisitBeforeBeingAttributed: 2,
    totalAttributedFtd: 1,
    totalAttributedFtdValue: 0.60,
    totalAttributedPurchase: 1,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-11-05 00:00:00.000', domain: 'dailymotion.com', count: 1 }
    ],
    banners: '300×250',
    dailyClicks: 0,
    allWallets: 'f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4',
    primaryCountry: 'PH',
    balanceGroup: '<$1k',
    walletProviders: 'Trust Wallet',
    timeline: [
      { date: '2025-10-12', type: 'visit', description: 'First site visit' },
      { date: '2025-11-08', type: 'impression', description: 'Ad impression', source: 'ESPN' },
      { date: '2025-12-05', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-11-08', format: '300×250', publisher: 'ESPN', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '7d',
      campaign: 'Broad Awareness Q4',
      reason: 'View signal before FTD.',
    },
    narrative: {
      whoThisUserIs: 'An Australian user with Trust Wallet.',
      beforeAds: 'First visited Oct 12.',
      adExposure: 'Saw ad on Nov 8.',
      afterAds: 'Converted Dec 5.',
      howAttributed: 'Post-view attribution.',
    },
  },
  {
    sdkStrongId: '08fe381499e09c1800e644c83fcbd7b6dd598f009f9e00949d72d210',
    metawinUserId: 'df7cab8f-3a47-489e-b57a-7b2d4f728c0e',
    metawinUserIdFirstTime: '2025-11-26 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-11-18',
    firstTimeSeen: '2025-10-07',
    firstTimeFtd: '2025-11-18',
    firstTimeAttributedFtd: '2025-11-18',
    firstTimeAttributed: '2025-11-18',
    daysVisitBeforeBeingAttributed: 1,
    totalAttributedFtd: 2,
    totalAttributedFtdValue: 0,
    totalAttributedPurchase: 2,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-10-26 00:00:00.000', domain: 'flashback.org', count: 2 }
    ],
    banners: '300×250, 320×50',
    dailyClicks: 0,
    allWallets: 'b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3',
    primaryCountry: 'SE',
    balanceGroup: 'No Balance',
    walletProviders: 'Phantom',
    timeline: [
      { date: '2025-10-07', type: 'visit', description: 'First site visit' },
      { date: '2025-11-18', type: 'impression', description: 'Ad impression', source: 'Yahoo Finance' },
      { date: '2025-11-18', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-11-18', format: '300×250', publisher: 'Yahoo Finance', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '7d',
      campaign: 'Broad Awareness Q4',
      reason: 'View signal same day as FTD.',
    },
    narrative: {
      whoThisUserIs: 'A French user with Phantom wallet.',
      beforeAds: 'First visited Oct 7.',
      adExposure: 'Saw ad on Nov 18.',
      afterAds: 'Converted same day.',
      howAttributed: 'Post-view attribution.',
    },
  },
  {
    sdkStrongId: 'bc1422fc3db193c6dabf16b197d4a0ac46726d1fc60c33a83308f4b8',
    metawinUserId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    metawinUserIdFirstTime: '2025-11-25 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-12-11',
    firstTimeSeen: '2025-09-27',
    firstTimeFtd: '2025-12-11',
    firstTimeAttributedFtd: '2025-11-28',
    firstTimeAttributed: '2025-11-05',
    daysVisitBeforeBeingAttributed: 14,
    totalAttributedFtd: 4,
    totalAttributedFtdValue: 0.07,
    totalAttributedPurchase: 30,
    totalAttributedPurchaseValue: 0.023463079898186100,
    dailyImps: [
      { date: '2025-11-05 00:00:00.000', domain: 'belfastlive.co.uk', count: 1 }
    ],
    banners: '300×250, 728×90, 160×600',
    dailyClicks: 2,
    allWallets: 'abc123def456789',
    primaryCountry: 'AU',
    balanceGroup: 'No Balance',
    walletProviders: 'MetaMask, Ledger',
    timeline: [
      { date: '2025-09-27', type: 'visit', description: 'Initial site exploration' },
      { date: '2025-11-05', type: 'impression', description: 'First ad impression', source: 'Google Display' },
      { date: '2025-11-28', type: 'deposit', description: 'First attributed deposit' },
    ],
    adExposures: [
      { date: '2025-11-05', format: '300×250', publisher: 'Google Display', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '30d',
      campaign: 'Retargeting Q4',
      reason: 'View signal within attribution window.',
    },
    narrative: {
      whoThisUserIs: 'A US-based user with multiple wallet providers.',
      beforeAds: 'First visited the site in late September.',
      adExposure: 'Saw retargeting ad in November.',
      afterAds: 'Converted with a small deposit.',
      howAttributed: 'Post-view attribution within 30-day window.',
    },
  },
  {
    sdkStrongId: '6cd6881aec361bd951b30c3a32f523fa7968254314389145cf604756',
    metawinUserId: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234',
    metawinUserIdFirstTime: '2025-12-11 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-12-11',
    firstTimeSeen: '2025-12-11',
    firstTimeFtd: '2025-12-11',
    firstTimeAttributedFtd: '2025-12-11',
    firstTimeAttributed: '2025-12-11',
    daysVisitBeforeBeingAttributed: 0,
    totalAttributedFtd: 3,
    totalAttributedFtdValue: 0.03,
    totalAttributedPurchase: 0,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-12-11 00:00:00.000', domain: 'gulesider.no', count: 2 }
    ],
    banners: '300×250',
    dailyClicks: 1,
    allWallets: 'def789abc123456',
    primaryCountry: 'NO',
    balanceGroup: 'No Balance',
    walletProviders: 'Coinbase Wallet',
    timeline: [
      { date: '2025-12-11', type: 'click', description: 'Clicked ad and converted same day', source: 'Facebook' },
      { date: '2025-12-11', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-12-11', format: '300×250', publisher: 'Facebook', clicked: true },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_click',
      window: '7d',
      campaign: 'Social Media Push',
      reason: 'Direct click-to-conversion same day.',
    },
    narrative: {
      whoThisUserIs: 'A German user who converted immediately.',
      beforeAds: 'No prior site visits.',
      adExposure: 'Clicked Facebook ad on Dec 11.',
      afterAds: 'Converted same day.',
      howAttributed: 'Instant post-click attribution.',
    },
  },
  {
    sdkStrongId: 'b0f76a45101ea2c673e9abdb0adfc2c89e47639ca04dccecddc9ec6c',
    metawinUserId: '12345678-90ab-cdef-1234-567890abcdef',
    metawinUserIdFirstTime: '2025-12-05 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-12-05',
    firstTimeSeen: '2025-09-26',
    firstTimeFtd: '2025-12-05',
    firstTimeAttributedFtd: '2025-12-05',
    firstTimeAttributed: '2025-12-05',
    daysVisitBeforeBeingAttributed: 9,
    totalAttributedFtd: 1,
    totalAttributedFtdValue: 0.06,
    totalAttributedPurchase: 0,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-11-11 00:00:00.000', domain: 'modrinth.com', count: 22 },
      { date: '2025-11-12 00:00:00.000', domain: 'coinmarketcap.com', count: 1 },
      { date: '2025-11-14 00:00:00.000', domain: 'macwelt.de', count: 4 }
    ],
    banners: '300×250',
    dailyClicks: 0,
    allWallets: 'xyz789def456123',
    primaryCountry: 'DE',
    balanceGroup: 'No Balance',
    walletProviders: 'Trust Wallet',
    timeline: [
      { date: '2025-09-26', type: 'visit', description: 'Organic visit' },
      { date: '2025-12-05', type: 'impression', description: 'Ad impression', source: 'Google Display' },
      { date: '2025-12-05', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-12-05', format: '300×250', publisher: 'Google Display', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '7d',
      campaign: 'Broad Awareness Q4',
      reason: 'View signal same day as FTD.',
    },
    narrative: {
      whoThisUserIs: 'A Canadian organic user.',
      beforeAds: 'Visited site organically in September.',
      adExposure: 'Saw ad Dec 5.',
      afterAds: 'Converted same day.',
      howAttributed: 'Post-view attribution.',
    },
  },
  {
    sdkStrongId: '06d2e835d7b90e8d906785e5df92a581177f0ae3c109952aa5f15f2b',
    metawinUserId: 'abcdef12-3456-7890-abcd-ef1234567890',
    metawinUserIdFirstTime: '2025-11-25 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-12-12',
    firstTimeSeen: '2025-09-24',
    firstTimeFtd: '2025-12-12',
    firstTimeAttributedFtd: '2025-12-12',
    firstTimeAttributed: '2025-12-12',
    daysVisitBeforeBeingAttributed: 42,
    totalAttributedFtd: 2,
    totalAttributedFtdValue: 0.02,
    totalAttributedPurchase: 0,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-12-12 00:00:00.000', domain: 'olx.pl', count: 2 }
    ],
    banners: '300×250, 728×90',
    dailyClicks: 0,
    allWallets: 'multi-wallet-user-123',
    primaryCountry: 'PL',
    balanceGroup: 'No Balance',
    walletProviders: 'MetaMask',
    timeline: [
      { date: '2025-09-24', type: 'visit', description: 'First site visit' },
      { date: '2025-12-12', type: 'impression', description: 'Ad impression', source: 'Yahoo Finance' },
      { date: '2025-12-12', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-12-12', format: '300×250', publisher: 'Yahoo Finance', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '7d',
      campaign: 'Broad Awareness Q4',
      reason: 'View signal same day as FTD.',
    },
    narrative: {
      whoThisUserIs: 'A US-based user.',
      beforeAds: 'First visited in September, long consideration period.',
      adExposure: 'Saw ad Dec 12.',
      afterAds: 'Converted same day.',
      howAttributed: 'Post-view attribution.',
    },
  },
  {
    sdkStrongId: '40a12e0985721d3d5748181b3f9a6bea8948cc43620914adc5161266',
    metawinUserId: '87654321-dcba-0987-6543-210fedcba987',
    metawinUserIdFirstTime: '2025-11-26 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-11-30',
    firstTimeSeen: '2025-09-23',
    firstTimeFtd: '2025-11-30',
    firstTimeAttributedFtd: '2025-11-30',
    firstTimeAttributed: '2025-11-04',
    daysVisitBeforeBeingAttributed: 15,
    totalAttributedFtd: 5,
    totalAttributedFtdValue: 5.25,
    totalAttributedPurchase: 8,
    totalAttributedPurchaseValue: 4.0,
    dailyImps: [
      { date: '2025-11-04 00:00:00.000', domain: 'gulte.com', count: 2 }
    ],
    banners: '300×250, 728×90, 300×600',
    dailyClicks: 1,
    allWallets: 'vip-wallet-12345',
    primaryCountry: 'KR',
    balanceGroup: '$10K - $100K',
    walletProviders: 'MetaMask, Ledger',
    timeline: [
      { date: '2025-09-23', type: 'visit', description: 'First site visit' },
      { date: '2025-11-04', type: 'impression', description: 'First ad impression', source: 'CoinDesk' },
      { date: '2025-11-30', type: 'deposit', description: 'First deposit: $5.25' },
    ],
    adExposures: [
      { date: '2025-11-04', format: '300×250', publisher: 'CoinDesk', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '30d',
      campaign: 'Crypto Awareness Q4',
      reason: 'View signal within attribution window.',
    },
    narrative: {
      whoThisUserIs: 'A GB-based user.',
      beforeAds: 'First visited Sept 23.',
      adExposure: 'Saw ad Nov 4.',
      afterAds: 'Converted Nov 30.',
      howAttributed: 'Post-view attribution.',
    },
  },
  {
    sdkStrongId: '833e91735ea74d701a3e48051065eebb3a49885f8ef1ec483f11bd62',
    metawinUserId: '11223344-5566-7788-99aa-bbccddeeff00',
    metawinUserIdFirstTime: '2025-11-27 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-12-11',
    firstTimeSeen: '2025-09-24',
    firstTimeFtd: '2025-12-11',
    firstTimeAttributedFtd: '2025-12-11',
    firstTimeAttributed: '2025-12-03',
    daysVisitBeforeBeingAttributed: 63,
    totalAttributedFtd: 2,
    totalAttributedFtdValue: 0.32,
    totalAttributedPurchase: 0,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-12-03 00:00:00.000', domain: 'baby-vornamen.de', count: 12 },
      { date: '2025-12-04 00:00:00.000', domain: 'gutefrage.net', count: 1 },
      { date: '2025-12-04 00:00:00.000', domain: 'nordbayern.de', count: 1 },
      { date: '2025-12-05 00:00:00.000', domain: 'motor-talk.de', count: 22 }
    ],
    banners: '300×250, 728×90, 300×600, 160×600',
    dailyClicks: 3,
    allWallets: 'high-value-wallet-789',
    primaryCountry: 'DE',
    balanceGroup: 'No Balance',
    walletProviders: 'MetaMask, Ledger, Phantom',
    timeline: [
      { date: '2025-09-24', type: 'visit', description: 'First site visit' },
      { date: '2025-12-03', type: 'impression', description: 'First ad impression', source: 'Premium Network' },
      { date: '2025-12-11', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-12-03', format: '300×600', publisher: 'Premium Network', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '7d',
      campaign: 'VIP Acquisition',
      reason: 'View signal within attribution window.',
    },
    narrative: {
      whoThisUserIs: 'A US-based user with multiple wallets.',
      beforeAds: 'First visited in September, very long consideration.',
      adExposure: 'Saw premium ad Dec 3.',
      afterAds: 'Converted Dec 11.',
      howAttributed: 'Post-view attribution.',
    },
  },
  {
    sdkStrongId: '0f9dd14101456d534bf1e85d6a71d76e07ae851254f98120f876cb3b',
    metawinUserId: 'aabbccdd-eeff-0011-2233-445566778899',
    metawinUserIdFirstTime: '2025-11-26 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-11-28',
    firstTimeSeen: '2025-09-23',
    firstTimeFtd: '2025-11-28',
    firstTimeAttributedFtd: '2025-11-28',
    firstTimeAttributed: '2025-11-04',
    daysVisitBeforeBeingAttributed: 41,
    totalAttributedFtd: 6,
    totalAttributedFtdValue: 2352.71,
    totalAttributedPurchase: 3,
    totalAttributedPurchaseValue: 524.5,
    dailyImps: [
      { date: '2025-11-04 00:00:00.000', domain: 'lyonmag.com', count: 1 }
    ],
    banners: '300×250, 728×90',
    dailyClicks: 2,
    allWallets: 'whale-wallet-999',
    primaryCountry: 'FR',
    balanceGroup: 'No Balance',
    walletProviders: 'Ledger',
    timeline: [
      { date: '2025-09-23', type: 'visit', description: 'First site visit' },
      { date: '2025-11-04', type: 'click', description: 'Clicked ad', source: 'CoinDesk' },
      { date: '2025-11-28', type: 'deposit', description: 'First deposit: $2,352.71' },
    ],
    adExposures: [
      { date: '2025-11-04', format: '300×250', publisher: 'CoinDesk', clicked: true },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_click',
      window: '30d',
      campaign: 'Crypto Whales Q4',
      reason: 'Click signal within attribution window.',
    },
    narrative: {
      whoThisUserIs: 'A Canadian high roller.',
      beforeAds: 'First visited Sept 23.',
      adExposure: 'Clicked ad Nov 4.',
      afterAds: 'Made substantial deposit Nov 28.',
      howAttributed: 'Post-click attribution.',
    },
  },
  {
    sdkStrongId: 'd2af8b9e9951f5dd200b778596d7cf508628c7853234b1540848fd3a',
    metawinUserId: '99887766-5544-3322-1100-ffeeddccbbaa',
    metawinUserIdFirstTime: '2025-11-28 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-11-28',
    firstTimeSeen: '2025-10-01',
    firstTimeFtd: '2025-11-28',
    firstTimeAttributedFtd: '2025-11-28',
    firstTimeAttributed: '2025-11-05',
    daysVisitBeforeBeingAttributed: 8,
    totalAttributedFtd: 3,
    totalAttributedFtdValue: 2.07,
    totalAttributedPurchase: 3,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-11-05 00:00:00.000', domain: 'index.hr', count: 6 }
    ],
    banners: '300×250',
    dailyClicks: 0,
    allWallets: 'steady-wallet-456',
    primaryCountry: 'BA',
    balanceGroup: 'No Balance',
    walletProviders: 'Trust Wallet',
    timeline: [
      { date: '2025-10-01', type: 'visit', description: 'First site visit' },
      { date: '2025-11-05', type: 'impression', description: 'Ad impression', source: 'ESPN' },
      { date: '2025-11-28', type: 'deposit', description: 'First deposit: $2.07' },
    ],
    adExposures: [
      { date: '2025-11-05', format: '300×250', publisher: 'ESPN', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '30d',
      campaign: 'Broad Awareness Q4',
      reason: 'View signal within attribution window.',
    },
    narrative: {
      whoThisUserIs: 'An Australian user.',
      beforeAds: 'First visited Oct 1.',
      adExposure: 'Saw ad Nov 5.',
      afterAds: 'Converted Nov 28.',
      howAttributed: 'Post-view attribution.',
    },
  },
  {
    sdkStrongId: '1f418180468056bb4079fd4b78de2fee9cb0d937c07bc8eb20432c7f',
    metawinUserId: 'fedcba98-7654-3210-fedc-ba9876543210',
    metawinUserIdFirstTime: '2025-11-26 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-11-30',
    firstTimeSeen: '2025-09-24',
    firstTimeFtd: '2025-11-30',
    firstTimeAttributedFtd: '2025-11-30',
    firstTimeAttributed: '2025-11-04',
    daysVisitBeforeBeingAttributed: 39,
    totalAttributedFtd: 1,
    totalAttributedFtdValue: 0.05,
    totalAttributedPurchase: 15,
    totalAttributedPurchaseValue: 0.3688901837081280,
    dailyImps: [
      { date: '2025-11-04 00:00:00.000', domain: 'laurasbakery.nl', count: 1 },
      { date: '2025-11-04 00:00:00.000', domain: 'flyingfoodie.nl', count: 3 }
    ],
    banners: '300×250, 728×90',
    dailyClicks: 1,
    allWallets: 'new-user-wallet-111',
    primaryCountry: 'AL',
    balanceGroup: '<$1k',
    walletProviders: 'Phantom',
    timeline: [
      { date: '2025-09-24', type: 'visit', description: 'First site visit' },
      { date: '2025-11-04', type: 'impression', description: 'Ad impression', source: 'Yahoo Finance' },
      { date: '2025-11-30', type: 'deposit', description: 'First deposit' },
    ],
    adExposures: [
      { date: '2025-11-04', format: '300×250', publisher: 'Yahoo Finance', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '30d',
      campaign: 'Broad Awareness Q4',
      reason: 'View signal within attribution window.',
    },
    narrative: {
      whoThisUserIs: 'A French user.',
      beforeAds: 'First visited Sept 24.',
      adExposure: 'Saw ad Nov 4.',
      afterAds: 'Converted Nov 30.',
      howAttributed: 'Post-view attribution.',
    },
  },
  {
    sdkStrongId: '716578961d7beb4b88fc5a09e987297cbf8c63475f95051e8e8203f7',
    metawinUserId: '01onal2-3456-7890-abcd-efghijklmnop',
    metawinUserIdFirstTime: '2025-12-03 00:00:00 UTC',
    metawinUserIdFirstFtd: '2025-12-03',
    firstTimeSeen: '2025-09-25',
    firstTimeFtd: '2025-12-03',
    firstTimeAttributedFtd: '2025-12-03',
    firstTimeAttributed: '2025-11-05',
    daysVisitBeforeBeingAttributed: 21,
    totalAttributedFtd: 8,
    totalAttributedFtdValue: 10158.53,
    totalAttributedPurchase: 1,
    totalAttributedPurchaseValue: 0,
    dailyImps: [
      { date: '2025-11-04 00:00:00.000', domain: 'politicalcompass.org', count: 1 },
      { date: '2025-12-04 00:00:00.000', domain: 'actu.geo.fr', count: 16 }
    ],
    banners: '300×250, 728×90, 300×600, 160×600',
    dailyClicks: 4,
    allWallets: 'mega-whale-wallet-000',
    primaryCountry: 'CH',
    balanceGroup: 'No Balance',
    walletProviders: 'MetaMask, Ledger, Coinbase Wallet',
    timeline: [
      { date: '2025-09-25', type: 'visit', description: 'First site visit' },
      { date: '2025-11-05', type: 'click', description: 'Clicked premium ad', source: 'Premium Network' },
      { date: '2025-12-03', type: 'deposit', description: 'First deposit: $10,158.53' },
    ],
    adExposures: [
      { date: '2025-11-05', format: '300×600', publisher: 'Premium Network', clicked: true },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_click',
      window: '30d',
      campaign: 'VIP Whales',
      reason: 'Click signal followed by high-value conversion.',
    },
    narrative: {
      whoThisUserIs: 'A high-value VIP user.',
      beforeAds: 'First visited Sept 25.',
      adExposure: 'Clicked premium ad Nov 5.',
      afterAds: 'Made massive deposit Dec 3.',
      howAttributed: 'Post-click attribution - whale acquisition.',
    },
  },
];

// Get all users
export function getAllUsers(): UserProfile[] {
  return sampleUsers;
}

// Get user by ID
export function getUserById(id: string): UserProfile | undefined {
  return sampleUsers.find(user => user.sdkStrongId === id);
}

// Filter users by attribution status
export function getUsersByStatus(status: AttributionStatus): UserProfile[] {
  return sampleUsers.filter(user => user.attribution.status === status);
}

// Get summary stats
export function getUserStats() {
  const total = sampleUsers.length;
  const attributed = sampleUsers.filter(u => u.attribution.status === 'attributed').length;
  const totalDeposits = sampleUsers.reduce((sum, u) => sum + u.totalAttributedPurchaseValue, 0);

  return {
    totalUsers: total,
    attributedUsers: attributed,
    notAttributedUsers: total - attributed,
    attributionRate: (attributed / total) * 100,
    totalDeposits,
    avgDeposit: totalDeposits / total,
  };
}

// Format value for display
export function formatValue(value: number): string {
  if (value === 0) return '-';
  if (value < 1) return `$${value.toFixed(2)}`;
  if (value >= 1000) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${value.toFixed(2)}`;
}
