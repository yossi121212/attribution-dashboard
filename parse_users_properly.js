const fs = require('fs');

const csvPath = 'data_template.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');

// Robust CSV Line Parser
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result.map(s => s.replace(/^"|"$/g, ''));
}

const lines = csvData.trim().split('\n');
const users = [];

for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < 2) continue;

    // Parse daily_imps: {date domain=count, ...}
    let dailyImps = [];
    const dailyImpsRaw = row[10] || '';
    if (dailyImpsRaw.startsWith('{') && dailyImpsRaw.endsWith('}')) {
        const content = dailyImpsRaw.slice(1, -1);
        if (content) {
            const segments = content.split(', ');
            segments.forEach(seg => {
                const parts = seg.split(' ');
                if (parts.length >= 2) {
                    const date = parts[0];
                    const rest = parts.slice(2).join(' '); // Skip time part if present
                    const [domain, count] = rest.includes('=') ? rest.split('=') : [parts[parts.length - 2], parts[parts.length - 1].replace('=', '')];
                    // Clean domain: sometimes it has the time before it
                    const cleanDomain = domain.includes(' ') ? domain.split(' ').pop() : domain;

                    dailyImps.push({
                        date: date,
                        domain: cleanDomain,
                        count: parseInt(count) || 1
                    });
                }
            });
        }
    }

    // Timeline construction
    const timeline = [];
    const addEvent = (date, event, details) => {
        if (!date || date === '-' || date === '') return;
        const d = date.split(' ')[0];
        timeline.push({ date: d, event, details });
    };

    addEvent(row[1], 'First Seen', 'User first seen on our system.');
    if (dailyImps.length > 0) {
        dailyImps.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        addEvent(dailyImps[0].date, 'Ad Exposure Begins', 'User saw their first ad.');
    }
    addEvent(row[14], 'User ID provided by Advertiser', 'Advertiser mapping completed.');
    addEvent(row[2], 'First Time Deposit (FTD)', 'User completed their first deposit.');

    timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const user = {
        sdkStrongId: row[0],
        metawinUserId: row[13] || '-',
        metawinUserIdFirstTime: row[14] || '-',
        metawinUserIdFirstFtd: row[15] || '-',
        firstTimeSeen: row[1] ? row[1].split(' ')[0] : '',
        firstTimeFtd: row[2] ? row[2].split(' ')[0] : '',
        firstTimeAttributedFtd: row[4] ? row[4].split(' ')[0] : '',
        firstTimeAttributed: row[3] ? row[3].split(' ')[0] : '',
        daysVisitBeforeBeingAttributed: parseInt(row[5]) || 0,
        totalAttributedFtd: parseInt(row[6]) || 0,
        totalAttributedFtdValue: parseFloat(row[7]) || 0,
        totalAttributedPurchase: parseInt(row[8]) || 0,
        totalAttributedPurchaseValue: parseFloat(row[9]) || 0,
        dailyImps: dailyImps,
        banners: (row[11] || '').replace(/[\[\]]/g, ''),
        dailyClicks: parseInt(row[12]) || 0,
        allWallets: (row[16] || '').replace(/[\[\]]/g, ''),
        primaryCountry: row[17] || '',
        balanceGroup: row[18] || '',
        walletProviders: (row[19] || '').replace(/[\[\]]/g, ''),
        timeline: timeline,
        adExposures: dailyImps.map(imp => ({ date: imp.date, domain: imp.domain, count: imp.count })),
        attribution: {
            status: 'attributed',
            signal: parseInt(row[12]) > 0 ? 'post_click' : 'post_view',
            window: '30d',
            campaign: 'CSV Batch',
            reason: 'Attributed via CSV'
        },
        narrative: {
            whoThisUserIs: `User from ${row[17]}.`,
            beforeAds: '...',
            adExposure: '...',
            afterAds: '...',
            howAttributed: '...'
        }
    };
    users.push(user);
}

const tsContent = `
export interface DailyImpression {
  date: string;
  domain: string;
  count: number;
}

export interface TimelineEvent {
  date: string;
  event: string;
  details: string;
}

export interface AdExposure {
  date: string;
  domain: string;
  count: number;
}

export interface AttributionDetails {
  status: 'attributed' | 'organic' | 'pending';
  signal: 'post_click' | 'post_view';
  window: string;
  campaign: string;
  reason: string;
}

export interface NarrativeDetails {
  whoThisUserIs: string;
  beforeAds: string;
  adExposure: string;
  afterAds: string;
  howAttributed: string;
}

export interface UserProfile {
  sdkStrongId: string;
  metawinUserId: string;
  metawinUserIdFirstTime: string;
  metawinUserIdFirstFtd: string;
  firstTimeSeen: string;
  firstTimeFtd: string;
  firstTimeAttributedFtd: string;
  firstTimeAttributed: string;
  daysVisitBeforeBeingAttributed: number;
  totalAttributedFtd: number;
  totalAttributedFtdValue: number;
  totalAttributedPurchase: number;
  totalAttributedPurchaseValue: number;
  dailyImps: DailyImpression[];
  banners: string;
  dailyClicks: number;
  allWallets: string;
  primaryCountry: string;
  balanceGroup: string;
  walletProviders: string;
  timeline: TimelineEvent[];
  adExposures: AdExposure[];
  attribution: AttributionDetails;
  narrative: NarrativeDetails;
}

export const sampleUsers: UserProfile[] = ${JSON.stringify(users, null, 2)};
`;

fs.writeFileSync('src/lib/data.ts', tsContent);
console.log('Successfully updated src/lib/data.ts with ' + users.length + ' users.');
