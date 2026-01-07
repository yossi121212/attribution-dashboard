
import { UserProfile } from './data';
import {
    Eye,
    MousePointer2,
    Wallet,
    ArrowRight,
    CheckCircle2,
    XCircle,
    User,
    Clock,
    Calendar,
    DollarSign,
    TrendingUp,
    Search
} from 'lucide-react';

export interface StorySection {
    title: string;
    icon: any; // Lucide icon
    content: string;
    colorClass: string; // e.g., 'text-amber-500'
    date?: string;
    isAttributed?: boolean;
}

export function generateUserStory(user: UserProfile): StorySection[] {
    const sections: StorySection[] = [];

    // 1. First Seen
    sections.push({
        title: 'First Seen',
        icon: Eye,
        colorClass: 'text-amber-600', // Yellow/Amber
        date: user.firstTimeSeen,
        content: `User first seen on our system on ${user.firstTimeSeen}.\nat this stage, there were no deposits or conversions — just the beginning of their digital footprint.`
    });

    // 2. Ad Exposure
    // Group impressions by date
    // For simplicity, we'll take the first day of impressions as "Ad Exposure Begins"
    // And if there are more days, "Continued Exposure"
    if (user.dailyImps && user.dailyImps.length > 0) {
        // Sort imps by date just in case
        const sortedImps = [...user.dailyImps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const firstImpDate = sortedImps[0].date.split(' ')[0]; // extract YYYY-MM-DD
        const firstDayImps = sortedImps.filter(imp => imp.date.startsWith(firstImpDate));

        const impList = firstDayImps.map(imp => `• ${imp.domain} — ${imp.count} impressions`).join('\n');

        sections.push({
            title: 'Ad Exposure Begins',
            icon: Eye,
            colorClass: 'text-purple-600',
            date: firstImpDate,
            content: `The user starts seeing Addressable ads while browsing various sites:\n${impList}\n\nThis is not a single active interaction, but repeated passive exposure throughout the day.`
        });

        // Continued Exposure
        const subsequentImps = sortedImps.filter(imp => !imp.date.startsWith(firstImpDate));
        if (subsequentImps.length > 0) {
            // Group by date for a concise list
            const uniqueDates = Array.from(new Set(subsequentImps.map(imp => imp.date.split(' ')[0])));
            const continuedContent = uniqueDates.slice(0, 3).map(date => {
                const daysImps = subsequentImps.filter(i => i.date.startsWith(date));
                const domains = daysImps.map(i => `${i.domain} (${i.count})`).join(', ');
                return `• ${date} — ${domains}`;
            }).join('\n');

            const extraCount = uniqueDates.length > 3 ? `\n...and exposure on ${uniqueDates.length - 3} more days.` : '';

            sections.push({
                title: 'Continued Exposure Over Time',
                icon: Clock,
                colorClass: 'text-purple-600',
                content: `In the following days and weeks, exposure continues across additional sites:\n${continuedContent}${extraCount}\n\nThe exposure is spread over time and different contexts.`
            });
        }
    }

    // 3. First Attribution Point
    if (user.attribution?.status === 'attributed' && user.firstTimeAttributed) {
        sections.push({
            title: 'First Attribution Point',
            icon: CheckCircle2,
            colorClass: 'text-emerald-600',
            date: user.firstTimeAttributed,
            content: `This is the first moment the user entered our attribution window.\nFrom this point on, qualifying actions may be attributed to the campaign.\n\nDays from first visit to attribution: ${user.daysVisitBeforeBeingAttributed}`
        });
    }

    // 4. User Identified (Matching metawinUserIdFirstTime or similar logic if distinct)
    // The user prompt example had "User Identified by Advertiser" distinct from FTD. 
    // We can use `metawinUserIdFirstTime` if it's different/relevant.
    // If `metawinUserIdFirstTime` matches `firstTimeSeen`, maybe skip or merge?
    // Let's add it if available.
    if (user.metawinUserIdFirstTime && user.metawinUserIdFirstTime !== user.firstTimeSeen) {
        sections.push({
            title: 'User Identified by Advertiser',
            icon: User,
            colorClass: 'text-blue-600',
            date: user.metawinUserIdFirstTime,
            content: `Received user identifier from Client system.\nFull match established between ad activity and platform activity.`
        });
    }

    // 5. FTD
    if (user.firstTimeAttributedFtd) {
        const isAttributed = user.attribution.status === 'attributed';
        sections.push({
            title: 'First Time Deposit (FTD)',
            icon: DollarSign, // Using generic icon or we can import Wallet/Badge
            colorClass: 'text-yellow-600', // Gold/Yellow
            date: user.firstTimeAttributedFtd,
            content: `The user makes their first deposit.\n• First FTD ever\n• First FTD attributed to us\n\nThe deposit meets attribution rules (window, signal) and is credited to the campaign.`
        });
    }

    // 6. Post FTD Value
    if (user.totalAttributedPurchase > 0) {
        sections.push({
            title: 'After the FTD — Ongoing Value',
            icon: TrendingUp,
            colorClass: 'text-indigo-500',
            content: `Following the FTD, the user continues to engage:\n• ${user.totalAttributedPurchase} attributed purchases\n• Total Value: $${user.totalAttributedPurchaseValue.toFixed(2)}\n• High-value behavior pattern detected.`
        });
    }

    // 7. Summary
    const summaryContent = user.attribution.status === 'attributed'
        ? `This user was exposed to ads across multiple days, entered the window ${user.daysVisitBeforeBeingAttributed} days later, and converted. Value generation occurred entirely post-exposure.`
        : `This user was seen but did not convert within the attribution window or satisfy the signal requirements.`;

    sections.push({
        title: 'Summary',
        icon: Search,
        colorClass: 'text-gray-700',
        content: summaryContent
    });

    return sections;
}
