
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

// Format date from YYYY-MM-DD to "Nov 26, 2025"
function formatDateToReadable(dateStr: string): string {
    // Handle various date formats
    const cleanDate = dateStr.split(' ')[0]; // Remove time portion if present
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[month - 1] || parts[1];
        return `${monthName} ${day}, ${year}`;
    }
    return dateStr; // Return original if can't parse
}

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
        title: 'First Seen by Addressable',
        icon: Eye,
        colorClass: 'text-amber-600', // Yellow/Amber
        date: formatDateToReadable(user.firstTimeSeen),
        content: `User first seen on our system on ${formatDateToReadable(user.firstTimeSeen)}.`
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

        const impList = firstDayImps.map(imp => `• ${imp.domain} - ${imp.count} impressions`).join('\n');

        sections.push({
            title: 'Ad Exposure Begins',
            icon: Eye,
            colorClass: 'text-purple-600',
            date: formatDateToReadable(firstImpDate),
            content: `The user starts seeing Addressable ads while browsing various sites:\n${impList}\n\nThis is not a single active interaction, but repeated passive exposure throughout the day.`
        });

        // Continued Exposure
        const subsequentImps = sortedImps.filter(imp => !imp.date.startsWith(firstImpDate));
        if (subsequentImps.length > 0) {
            // Group by date for a concise list
            const uniqueDates = Array.from(new Set(subsequentImps.map(imp => imp.date.split(' ')[0])));
            const continuedContent = subsequentImps.slice(0, 6).map(imp => {
                const date = imp.date.split(' ')[0];
                return `• ${imp.domain} - ${imp.count} impressions | ${formatDateToReadable(date)}`;
            }).join('\n');

            const extraCount = subsequentImps.length > 6 ? `\n...and exposure on ${subsequentImps.length - 6} more sites.` : '';

            sections.push({
                title: 'Continued Exposure Over Time',
                icon: Clock,
                colorClass: 'text-purple-600',
                content: `In the following days and weeks, exposure continues across additional sites:\n${continuedContent}${extraCount}\n\nThe exposure is spread over time and different contexts.`
            });
        }
    }



    // 4. User Identified (Matching metawinUserIdFirstTime or similar logic if distinct)
    // The user prompt example had "User Identified by Advertiser" distinct from FTD. 
    // We can use `metawinUserIdFirstTime` if it's different/relevant.
    // If `metawinUserIdFirstTime` matches `firstTimeSeen`, maybe skip or merge?
    // Let's add it if available.
    if (user.metawinUserIdFirstTime && user.metawinUserIdFirstTime !== user.firstTimeSeen) {
        sections.push({
            title: 'User ID provided by Advertiser',
            icon: User,
            colorClass: 'text-blue-600',
            date: formatDateToReadable(user.metawinUserIdFirstTime),
            content: `Received user identifier from Advertiser system.\nFull match established between ad activity and platform activity.`
        });
    }

    // 5. FTD
    if (user.firstTimeAttributedFtd) {
        const isAttributed = user.attribution.status === 'attributed';
        sections.push({
            title: 'First Time Deposit (FTD)',
            icon: DollarSign, // Using generic icon or we can import Wallet/Badge
            colorClass: 'text-yellow-600', // Gold/Yellow
            date: formatDateToReadable(user.firstTimeAttributedFtd),
            content: `The user makes their first deposit.\n• First FTD ever\n• First FTD attributed to us\n\nThe deposit meets attribution rules (window, signal) and is credited to the campaign.`
        });
    }

    // 6. Post FTD Value
    if (user.totalAttributedPurchase > 0) {
        sections.push({
            title: 'After the FTD - Ongoing Value',
            icon: TrendingUp,
            colorClass: 'text-indigo-500',
            content: `Following the FTD, the user continues to engage:\n• ${user.totalAttributedPurchase} attributed purchases\n• Total Value: $${user.totalAttributedPurchaseValue.toFixed(2)}\n• High-value behavior pattern detected.`
        });
    }

    return sections;
}
