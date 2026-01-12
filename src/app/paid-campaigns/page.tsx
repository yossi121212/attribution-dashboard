'use client';

import { NewSidebar } from '@/components/new-sidebar';
import { Plus, Users } from 'lucide-react';

export default function PaidCampaignsPage() {
    return (
        <div className="flex h-screen bg-[#F2F7FB]">
            <NewSidebar />

            <main className="flex-1 overflow-auto flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                        <Users size={24} className="text-[#B045E6]" />
                    </div>
                    <h2 className="text-[#353B4F] text-lg font-medium mb-1">No Campaigns Found</h2>
                    <p className="text-[#7E87A8] text-sm max-w-[300px] mx-auto">
                        Get started by creating your first campaign to track conversions and attribution.
                    </p>
                    <button className="mt-6 flex items-center gap-2 bg-[#B045E6] text-white px-4 py-2 rounded-lg hover:bg-[#9B3DD0] transition-colors text-sm font-medium mx-auto">
                        <Plus size={16} />
                        Create Campaign
                    </button>
                </div>
            </main>
        </div>
    );
}
