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
  id: string;
  walletAddress: string;
  userType: UserType;
  totalDeposits: number;
  ftdCount: number;
  firstDepositAmount: number;
  firstDepositDate: string;
  timeline: TimelineEvent[];
  adExposures: AdExposure[];
  attribution: AttributionDecision;
  narrative: UserNarrative;
}

// Sample users based on the MVP document sample output
export const sampleUsers: UserProfile[] = [
  {
    id: 'user_a',
    walletAddress: '2a39e252f8b1c4d5e6a7b8c9d0e1f234',
    userType: 'crypto_native',
    totalDeposits: 25900,
    ftdCount: 1,
    firstDepositAmount: 4200,
    firstDepositDate: '2025-12-11',
    timeline: [
      { date: '2025-09-24', type: 'visit', description: 'First site visit - browsed homepage' },
      { date: '2025-09-26', type: 'visit', description: 'Returned to explore games catalog' },
      { date: '2025-10-02', type: 'visit', description: 'Viewed slots section, no registration' },
      { date: '2025-10-08', type: 'visit', description: 'Checked promotions page' },
      { date: '2025-10-15', type: 'visit', description: 'Browsed VIP program details' },
      { date: '2025-10-21', type: 'impression', description: 'First Addressable ad impression', source: 'AccuWeather' },
      { date: '2025-10-25', type: 'impression', description: 'Display ad seen on Political Compass', source: 'Political Compass' },
      { date: '2025-11-01', type: 'visit', description: 'Returned to site directly' },
      { date: '2025-11-12', type: 'impression', description: 'Banner ad on Modrinth', source: 'Modrinth' },
      { date: '2025-12-11', type: 'registration', description: 'Completed registration' },
      { date: '2025-12-11', type: 'deposit', description: 'First deposit: $4,200' },
      { date: '2025-12-15', type: 'deposit', description: 'Second deposit: $6,500' },
      { date: '2025-12-22', type: 'deposit', description: 'Third deposit: $8,200' },
      { date: '2025-12-29', type: 'deposit', description: 'Fourth deposit: $7,000' },
    ],
    adExposures: [
      { date: '2025-10-21', format: '300×250', publisher: 'AccuWeather', clicked: false },
      { date: '2025-10-25', format: '728×90', publisher: 'Political Compass', clicked: false },
      { date: '2025-11-12', format: '300×250', publisher: 'Modrinth', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '7d',
      campaign: 'Q4 Crypto Gamblers',
      reason: 'All deposits fall inside the Addressable attribution window. No conversion history before ads, no click-based channel competing.',
    },
    narrative: {
      whoThisUserIs: `This is a US-based user, crypto-native, with a MetaMask wallet. From Addressable's side, they sit squarely in our gamblers cookie DMP, meaning we picked them up based on gambling behavior elsewhere on the web, not because they touched Metawin.

All in, this user deposited about $25.9k, with multiple FTDs and follow-on purchases. This is a real, high-value gambler.`,
      beforeAds: `We first see them on Metawin around Sept 24. Over the next 17 different days, they come back repeatedly. They browse, they explore, but they never deposit. No FTD, no purchases. Just classic consideration behavior.`,
      adExposure: `On Oct 21, this user starts seeing Addressable ads. These are shown off-site on regular publishers like AccuWeather, Political Compass, and Modrinth. Nothing crypto-heavy, nothing owned by Metawin.

They see a mix of standard display formats, 300×250s, 728×90s, a few others. They never click.`,
      afterAds: `They keep visiting the site after that. Still no immediate conversion, which is important—this isn't a "saw ad, instantly deposited" story.

Then on Dec 11, they finally make their first deposit. After that, they come back and deposit again and again. Every dollar of value comes after ads were in the picture.`,
      howAttributed: `All of those deposits fall inside the Addressable attribution window. There's no conversion history before ads, and no click-based channel competing here. It's a clean view-through case.`,
    },
  },
  {
    id: 'user_b',
    walletAddress: '7f82b4c1d9e0a3f2b5c8d7e6f4a1b0c9',
    userType: 'crypto_native',
    totalDeposits: 3200,
    ftdCount: 1,
    firstDepositAmount: 1800,
    firstDepositDate: '2025-12-28',
    timeline: [
      { date: '2025-09-15', type: 'impression', description: 'Ad impression on CoinDesk', source: 'CoinDesk' },
      { date: '2025-09-18', type: 'click', description: 'Clicked ad on DeFi Pulse', source: 'DeFi Pulse' },
      { date: '2025-09-18', type: 'visit', description: 'Landed on site, browsed briefly' },
      { date: '2025-09-20', type: 'visit', description: 'Returned organically, explored games' },
      { date: '2025-12-28', type: 'visit', description: 'Returned via organic Google search' },
      { date: '2025-12-28', type: 'registration', description: 'Completed registration' },
      { date: '2025-12-28', type: 'deposit', description: 'First deposit: $1,800' },
      { date: '2026-01-03', type: 'deposit', description: 'Second deposit: $1,400' },
    ],
    adExposures: [
      { date: '2025-09-15', format: '300×600', publisher: 'CoinDesk', clicked: false },
      { date: '2025-09-18', format: '300×250', publisher: 'DeFi Pulse', clicked: true },
    ],
    attribution: {
      status: 'not_attributed',
      signal: 'post_click',
      window: '30d',
      campaign: null,
      reason: 'Click signal from Sept 18 is outside the 30-day attribution window. FTD occurred 101 days after last click interaction.',
    },
    narrative: {
      whoThisUserIs: `A crypto-native user with an active DeFi wallet. They showed interest back in September but took over 3 months to convert. This is a long consideration cycle user.`,
      beforeAds: `We have no site activity before the September ad campaign touched them. The first interaction was through our CoinDesk display campaign.`,
      adExposure: `On Sept 15, they saw an ad on CoinDesk. Three days later, they clicked an ad on DeFi Pulse and landed on our site for the first time. This was direct campaign-driven acquisition—they found us through ads.`,
      afterAds: `After the click on Sept 18, they visited the site twice in September, then went completely dark. No activity for 99 days.

They came back on Dec 28 via organic Google search, registered, and deposited within the same session. A second deposit followed in January.`,
      howAttributed: `Not attributed. The click signal from September 18 is well outside our 30-day attribution window. Even though ads clearly introduced this user to the platform, the 101-day gap means we can't attribute under current rules.

This is a classic "long consideration cycle" case—ads worked, but the window expired.`,
    },
  },
  {
    id: 'user_c',
    walletAddress: 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    userType: 'mixed',
    totalDeposits: 8750,
    ftdCount: 1,
    firstDepositAmount: 500,
    firstDepositDate: '2025-12-20',
    timeline: [
      { date: '2025-12-10', type: 'impression', description: 'Display ad on ESPN', source: 'ESPN' },
      { date: '2025-12-15', type: 'click', description: 'Clicked affiliate link on gambling forum', source: 'Affiliate' },
      { date: '2025-12-15', type: 'visit', description: 'Landed on registration page' },
      { date: '2025-12-15', type: 'registration', description: 'Completed registration' },
      { date: '2025-12-20', type: 'deposit', description: 'First deposit: $500' },
      { date: '2025-12-22', type: 'deposit', description: 'Second deposit: $2,000' },
      { date: '2025-12-27', type: 'deposit', description: 'Third deposit: $3,250' },
      { date: '2026-01-02', type: 'deposit', description: 'Fourth deposit: $3,000' },
    ],
    adExposures: [
      { date: '2025-12-10', format: '728×90', publisher: 'ESPN', clicked: false },
      { date: '2025-12-15', format: 'affiliate_link', publisher: 'Gambling Forum', clicked: true },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_click',
      window: '30d',
      campaign: 'Affiliate Q4 Push',
      reason: 'Direct click-to-registration-to-FTD path within 5 days. Highest confidence attribution.',
    },
    narrative: {
      whoThisUserIs: `This user has both crypto and fiat deposit history, indicating comfort with multiple payment methods. They're US-based and show patterns of an experienced online gambler—fast registration-to-deposit conversion.`,
      beforeAds: `No prior site visits or interactions. This user was completely new to the platform before our campaigns reached them.`,
      adExposure: `On Dec 10, they saw a display ad on ESPN. Five days later, they clicked an affiliate link on a gambling forum. This was the conversion trigger.`,
      afterAds: `Same day as the click, they registered. Five days later, they made a modest first deposit of $500. But then they ramped up quickly—$2K, then $3.2K, then $3K.

Total value: $8,750 across four deposits in under two weeks.`,
      howAttributed: `This is a clean post-click attribution. They clicked on Dec 15, registered same day, first deposit on Dec 20—all within the 30-day window with a direct click signal. Highest confidence case.`,
    },
  },
  {
    id: 'user_d',
    walletAddress: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    userType: 'fiat_focused',
    totalDeposits: 12400,
    ftdCount: 1,
    firstDepositAmount: 2500,
    firstDepositDate: '2026-01-04',
    timeline: [
      { date: '2025-10-01', type: 'registration', description: 'Initial registration (no deposit)' },
      { date: '2025-10-05', type: 'visit', description: 'Browsed games but no deposit' },
      { date: '2025-10-12', type: 'visit', description: 'Checked balance, still no deposit' },
      { date: '2025-12-28', type: 'impression', description: 'Re-engagement email opened', source: 'Email Campaign' },
      { date: '2025-12-28', type: 'click', description: 'Clicked email CTA button', source: 'Email Campaign' },
      { date: '2025-12-28', type: 'visit', description: 'Returned to site via email link' },
      { date: '2026-01-04', type: 'deposit', description: 'First deposit: $2,500' },
      { date: '2026-01-05', type: 'deposit', description: 'Second deposit: $4,900' },
      { date: '2026-01-06', type: 'deposit', description: 'Third deposit: $5,000' },
    ],
    adExposures: [
      { date: '2025-12-28', format: 'email', publisher: 'Internal Email', clicked: true },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_click',
      window: '30d',
      campaign: 'Dormant User Reactivation',
      reason: 'Returning user who registered but never deposited. Re-engagement email drove successful conversion within window.',
    },
    narrative: {
      whoThisUserIs: `A fiat-focused user who registered in early October but never deposited. They showed enough interest to create an account but stalled at the deposit step. Classic dormant registration.`,
      beforeAds: `This user registered on Oct 1 during a promotional period. They returned twice in October to browse but never pulled the trigger on a deposit. Then they went dark for over two months.`,
      adExposure: `On Dec 28, they received our Dormant User Reactivation email campaign. They opened it and clicked the CTA button, returning to the site for the first time since October.`,
      afterAds: `One week after the email click, they finally made their first deposit—$2,500. The next day, another $4,900. The day after, $5,000 more.

Total: $12,400 in three days from a previously dormant registration.`,
      howAttributed: `Attributed as a Returning User reactivation. The email click on Dec 28 is the signal, and the FTD on Jan 4 is within the 30-day window. This is exactly what reactivation campaigns are designed to achieve.`,
    },
  },
  {
    id: 'user_e',
    walletAddress: 'f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4',
    userType: 'crypto_native',
    totalDeposits: 4100,
    ftdCount: 1,
    firstDepositAmount: 1500,
    firstDepositDate: '2025-12-18',
    timeline: [
      { date: '2025-12-18', type: 'visit', description: 'Arrived via organic Google search' },
      { date: '2025-12-18', type: 'registration', description: 'Registered same session' },
      { date: '2025-12-18', type: 'deposit', description: 'First deposit: $1,500' },
      { date: '2025-12-23', type: 'deposit', description: 'Second deposit: $1,200' },
      { date: '2025-12-30', type: 'deposit', description: 'Third deposit: $1,400' },
    ],
    adExposures: [],
    attribution: {
      status: 'not_attributed',
      signal: 'none',
      window: null,
      campaign: null,
      reason: 'No campaign signal detected in user history. Arrived via organic search with no prior ad exposure.',
    },
    narrative: {
      whoThisUserIs: `A crypto-native wallet holder who found us organically. No tracking signals in their history—they came directly through search without any recorded ad touchpoints.`,
      beforeAds: `No prior history exists. First recorded interaction was the same day they registered and deposited.`,
      adExposure: `None. This user has zero recorded ad impressions or clicks in our tracking system. They may have heard about us through word-of-mouth, social media mentions, or untracked sources.`,
      afterAds: `N/A—there were no ads in this user's journey. They arrived via organic Google search, registered, and deposited $1,500 in the same session. Classic organic acquisition pattern.`,
      howAttributed: `Not attributed. No qualifying signal found. This is either a true organic acquisition (word-of-mouth, social mentions) or came through an untracked channel (influencer, untagged links, etc.).

The user is valuable—$4,100 in deposits—but we can't attribute them under current tracking configuration.`,
    },
  },
  {
    id: 'user_f',
    walletAddress: 'b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3',
    userType: 'mixed',
    totalDeposits: 950,
    ftdCount: 1,
    firstDepositAmount: 250,
    firstDepositDate: '2025-12-05',
    timeline: [
      { date: '2025-11-20', type: 'impression', description: 'Display ad on Yahoo Finance', source: 'Yahoo Finance' },
      { date: '2025-11-22', type: 'impression', description: 'Display ad on Reddit', source: 'Reddit' },
      { date: '2025-11-24', type: 'visit', description: 'Visited site directly, brief browse' },
      { date: '2025-12-05', type: 'registration', description: 'Completed registration' },
      { date: '2025-12-05', type: 'deposit', description: 'First deposit: $250' },
      { date: '2025-12-12', type: 'deposit', description: 'Second deposit: $350' },
      { date: '2025-12-19', type: 'deposit', description: 'Third deposit: $350' },
    ],
    adExposures: [
      { date: '2025-11-20', format: '300×250', publisher: 'Yahoo Finance', clicked: false },
      { date: '2025-11-22', format: '320×50', publisher: 'Reddit', clicked: false },
    ],
    attribution: {
      status: 'attributed',
      signal: 'post_view',
      window: '7d',
      campaign: 'Broad Awareness Q4',
      reason: 'View signals on Nov 20-22, site visit Nov 24, FTD Dec 5. All within 7-day view window from last impression to deposit decision point.',
    },
    narrative: {
      whoThisUserIs: `A multi-device user comfortable with both crypto and traditional payments. Smaller depositor profile—$950 total across three deposits. Representative of our casual player segment.`,
      beforeAds: `No site activity before our ad campaigns reached them. First touchpoint was through display ads.`,
      adExposure: `Saw display ads on Yahoo Finance (Nov 20) and Reddit (Nov 22). Standard awareness formats, no clicks. Two days after the Reddit impression, they visited our site directly.`,
      afterAds: `After the brief Nov 24 visit (likely exploring), they returned 11 days later on Dec 5 to register and make a small first deposit. Weekly deposits followed—$350 each.

This is a "slow drip" depositor pattern—consistent but modest amounts.`,
      howAttributed: `Attributed via post-view. The Nov 22 Reddit impression is within the 7-day window of the Nov 24 site visit, which is the decision point. No click signal competing.

Lower confidence than post-click, but clean view-through attribution.`,
    },
  },
];

// Get all users
export function getAllUsers(): UserProfile[] {
  return sampleUsers;
}

// Get user by ID
export function getUserById(id: string): UserProfile | undefined {
  return sampleUsers.find(user => user.id === id);
}

// Filter users by attribution status
export function getUsersByStatus(status: AttributionStatus): UserProfile[] {
  return sampleUsers.filter(user => user.attribution.status === status);
}

// Get summary stats
export function getUserStats() {
  const total = sampleUsers.length;
  const attributed = sampleUsers.filter(u => u.attribution.status === 'attributed').length;
  const totalDeposits = sampleUsers.reduce((sum, u) => sum + u.totalDeposits, 0);

  return {
    totalUsers: total,
    attributedUsers: attributed,
    notAttributedUsers: total - attributed,
    attributionRate: (attributed / total) * 100,
    totalDeposits,
    avgDeposit: totalDeposits / total,
  };
}
