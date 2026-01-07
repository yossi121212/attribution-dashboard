
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
        content: `User first detected by our pixel on ${formatDateToReadable(user.firstTimeSeen)}.`
    });

    // 2. Ad Exposure
    // Group impressions by date, but split into separate cards when other events fall between them
    if (user.dailyImps && user.dailyImps.length > 0) {
        // Sort imps by date
        const sortedImps = [...user.dailyImps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const firstImpDate = sortedImps[0].date.split(' ')[0];
        const firstDayImps = sortedImps.filter(imp => imp.date.startsWith(firstImpDate));

        const impList = firstDayImps.map(imp => `• ${imp.domain} - ${imp.count} impressions`).join('\n');

        sections.push({
            title: 'Ad Exposure Begins',
            icon: Eye,
            colorClass: 'text-purple-600',
            date: formatDateToReadable(firstImpDate),
            content: `The user starts seeing Addressable ads while browsing various sites:\n${impList}\n\nThis is not a single active interaction, but repeated passive exposure throughout the day.`
        });

        // Get all other event dates (non-impression events)
        const otherEventDates: Date[] = [];
        if (user.metawinUserIdFirstTime && user.metawinUserIdFirstTime !== user.firstTimeSeen) {
            otherEventDates.push(new Date(user.metawinUserIdFirstTime.split(' ')[0]));
        }
        if (user.firstTimeAttributedFtd) {
            otherEventDates.push(new Date(user.firstTimeAttributedFtd.split(' ')[0]));
        }
        otherEventDates.sort((a, b) => a.getTime() - b.getTime());

        // Group subsequent impressions - split when an event date falls in between
        const subsequentImps = sortedImps.filter(imp => !imp.date.startsWith(firstImpDate));
        if (subsequentImps.length > 0) {
            // Group impressions into segments based on event dates
            const segments: typeof subsequentImps[] = [];
            let currentSegment: typeof subsequentImps = [];
            let currentEventIndex = 0;

            subsequentImps.forEach(imp => {
                const impDate = new Date(imp.date.split(' ')[0]);

                // Check if we've passed an event date
                while (currentEventIndex < otherEventDates.length &&
                    impDate > otherEventDates[currentEventIndex]) {
                    // Save current segment and start new one
                    if (currentSegment.length > 0) {
                        segments.push(currentSegment);
                        currentSegment = [];
                    }
                    currentEventIndex++;
                }

                currentSegment.push(imp);
            });

            // Don't forget the last segment
            if (currentSegment.length > 0) {
                segments.push(currentSegment);
            }

            // Create a card for each segment
            segments.forEach((segment, segIdx) => {
                // Group by date within segment and show with dates
                const uniqueDates = Array.from(new Set(segment.map(imp => imp.date.split(' ')[0]))).sort();
                const impContent = segment.map(imp => {
                    const date = imp.date.split(' ')[0];
                    return `• ${imp.domain} - ${imp.count} impressions | ${formatDateToReadable(date)}`;
                }).join('\n');

                const earliestDate = uniqueDates[0];

                sections.push({
                    title: segIdx === 0 ? 'Continued Exposure' : 'Additional Ad Exposure',
                    icon: Eye,
                    colorClass: 'text-purple-600',
                    date: formatDateToReadable(earliestDate),
                    content: `Continued ad exposure across sites:\n${impContent}`
                });
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

    // Sort sections chronologically by date
    // Sections without dates go at the end
    const parseDate = (dateStr?: string): number => {
        if (!dateStr) return Number.MAX_SAFE_INTEGER; // No date = sort to end
        // Parse "Nov 26, 2025" format
        const monthNames: Record<string, number> = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const match = dateStr.match(/^(\w+)\s+(\d+),\s+(\d+)$/);
        if (match) {
            const month = monthNames[match[1]] ?? 0;
            const day = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);
            return new Date(year, month, day).getTime();
        }
        return Number.MAX_SAFE_INTEGER;
    };

    sections.sort((a, b) => parseDate(a.date) - parseDate(b.date));

    return sections;
}
