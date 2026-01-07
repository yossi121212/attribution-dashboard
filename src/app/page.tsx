'use client';

import { useState } from 'react';
import { getAllUsers, UserProfile } from '@/lib/data';
import { generateUserStory } from '@/lib/story-generator';
import {
  Search,
  Sparkles,
  Loader2,
  Eye,
  MousePointer2,
  FileCheck,
  Wallet,
  ArrowRight,
  CheckCircle2,
  XCircle,
  User,
  ChevronDown,
  Building2,
  Megaphone
} from 'lucide-react';

// Client name
const clientName = 'MetaWin';

// Campaigns grouped by channel
const campaigns = [
  // Display campaigns (4)
  { id: 'ftds_high_net_worth', name: 'FTDs - High Net Worth Gamblers - Various Geos - Display', channel: 'Display' },
  { id: 'registrations_high_net_worth', name: 'Registrations - High Net Worth Gamblers - Various Geos - Display', channel: 'Display' },
  { id: 'high_net_worth_display', name: 'High Net Worth Gamblers - Various Geos - Display', channel: 'Display' },
  { id: 'deposits_canada', name: 'Deposits - Purchase (Canada) - Display', channel: 'Display' },
  // X (Twitter) campaigns (1)
  { id: 'addr1_casino', name: 'Addr1 - Casino Gamblers', channel: 'X (Twitter)' },
];

export default function ExplainableDashboard() {
  const users = getAllUsers();
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]);

  const handleGenerate = async () => {
    setError(null);
    setSelectedUser(null);

    if (!inputValue.trim()) {
      setError('Please enter an Event ID or User ID');
      return;
    }

    setIsGenerating(true);

    // Simulate LLM generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find matching user (fuzzy match on ID, userId or wallet)
    const found = users.find(u =>
      u.metawinUserId.toLowerCase().includes(inputValue.toLowerCase()) ||
      u.sdkStrongId.toLowerCase().includes(inputValue.toLowerCase()) ||
      u.allWallets.toLowerCase().includes(inputValue.toLowerCase())
    );

    if (found) {
      setSelectedUser(found);
    } else {
      setError(`No user found matching "${inputValue}". Try a User ID, Addressable ID, or wallet address.`);
    }

    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Dropdowns */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Attribution Explainer
                </h1>
                <p className="text-sm text-gray-500">
                  Generate natural-language explanations
                </p>
              </div>
            </div>

            {/* Client & Campaign */}
            <div className="flex items-center gap-3">
              {/* Client Name (static display) */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Client</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <Building2 size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{clientName}</span>
                </div>
              </div>

              {/* Campaign Dropdown */}
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">Campaign</label>
                <div className="relative">
                  <Megaphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCampaign.id}
                    onChange={(e) => setSelectedCampaign(campaigns.find(c => c.id === e.target.value) || campaigns[0])}
                    className="appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[180px]"
                  >
                    {campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter Event ID or User ID
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., user_a, 2a39e252, E001..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Explanation
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          <p className="mt-3 text-xs text-gray-400">
            Try: user_a, user_b, user_c, user_d, user_e, or any wallet fragment
          </p>
        </div>

        {/* Results */}
        {selectedUser && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    User {selectedUser.metawinUserId.slice(0, 8).toUpperCase()} – {selectedUser.allWallets.slice(0, 8)}…
                  </h2>
                  <p className="text-gray-500">
                    {selectedUser.attribution.status === 'attributed'
                      ? `Attributed via ${selectedUser.attribution.signal === 'post_click' ? 'post-click' : 'post-view'}`
                      : 'Not attributed'}
                  </p>
                </div>
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  ${selectedUser.attribution.status === 'attributed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }
                `}>
                  {selectedUser.attribution.status === 'attributed' ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                  <span className="font-medium">
                    {selectedUser.attribution.status === 'attributed' ? 'Attributed' : 'Not Attributed'}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Deposits" value={`$${selectedUser.totalAttributedFtdValue.toLocaleString()}`} />
                <StatCard label="First Deposit" value={`$${selectedUser.totalAttributedFtdValue.toLocaleString()}`} />
                <StatCard label="FTD Date" value={selectedUser.firstTimeFtd} />
                <StatCard label="User Type" value={selectedUser.balanceGroup} />
              </div>
            </div>



            {/* Narrative Story - Dynamic */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Journey Story</h3>
              <div className="relative pb-4">
                {generateUserStory(selectedUser).map((section, idx, arr) => (
                  <NarrativeSection
                    key={idx}
                    icon={<section.icon size={18} className="text-white relative z-10" />}
                    title={section.title}
                    content={section.content}
                    date={section.date}
                    isLast={idx === arr.length - 1}
                    highlight={section.title === 'Summary' || section.title === 'First Time Deposit (FTD)'}
                    colorClass={section.colorClass}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedUser && !isGenerating && (
          <div className="text-center py-16 text-gray-400">
            <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Enter a User ID or Event ID and click Generate</p>
            <p className="text-sm mt-1">to see their attribution story</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900 capitalize">{value}</p>
    </div>
  );
}

function NarrativeSection({
  icon,
  title,
  content,
  isLast = false,
  highlight = false,
  date,
  colorClass
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  isLast?: boolean;
  highlight?: boolean;
  date?: string;
  colorClass?: string;
}) {
  const getColorBg = (cls?: string) => {
    if (!cls) return 'bg-gray-100 text-gray-500';
    if (cls.includes('amber')) return 'bg-amber-500 text-white';
    if (cls.includes('purple')) return 'bg-purple-500 text-white';
    if (cls.includes('emerald')) return 'bg-emerald-500 text-white';
    if (cls.includes('blue')) return 'bg-blue-500 text-white';
    if (cls.includes('yellow')) return 'bg-yellow-500 text-white';
    if (cls.includes('indigo')) return 'bg-indigo-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const iconBgStyle = getColorBg(colorClass);

  return (
    <div className="flex gap-4 relative">
      {/* Timeline Column */}
      <div className="flex flex-col items-center">
        {/* Icon Circle */}
        <div className={`
                  relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md
                  ${iconBgStyle}
              `}>
          <div className="scale-75">
            {icon}
          </div>
        </div>
        {/* Connecting Line */}
        {!isLast && (
          <div className="w-0.5 grow bg-gray-200 mt-1 mb-1" />
        )}
      </div>

      {/* Content Column */}
      <div className="flex-1 pb-8">
        <div className={`
                  rounded-xl p-5 border transition-all duration-200 shadow-sm
                  ${highlight
            ? 'bg-gradient-to-br from-gray-50 to-white border-purple-200 shadow-md ring-1 ring-purple-50'
            : 'bg-white border-gray-200 hover:shadow-md'
          }
              `}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-gray-900 text-base leading-tight">{title}</h4>
              {date && (
                <p className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  {date}
                </p>
              )}
            </div>
          </div>

          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}


