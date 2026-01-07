'use client';

import { useState } from 'react';
import { getAllUsers, UserProfile } from '@/lib/data';
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

// Sample tenants and campaigns
const tenants = [
  { id: 'shuffle', name: 'Shuffle' },
  { id: '50k_trade', name: '50K Trade' },
];

const campaigns = [
  { id: 'q4_crypto_gamblers', name: 'Q4 Crypto Gamblers' },
  { id: 'holiday_promo_2025', name: 'Holiday Promo 2025' },
  { id: 'vip_reactivation', name: 'VIP Reactivation' },
  { id: 'new_year_rush', name: 'New Year Rush' },
  { id: 'affiliate_push', name: 'Affiliate Q4 Push' },
];

export default function ExplainableDashboard() {
  const users = getAllUsers();
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState(tenants[0]);
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

    // Find matching user (fuzzy match on ID or wallet)
    const found = users.find(u =>
      u.id.toLowerCase().includes(inputValue.toLowerCase()) ||
      u.walletAddress.toLowerCase().includes(inputValue.toLowerCase()) ||
      inputValue.toLowerCase().includes(u.id.split('_')[1])
    );

    if (found) {
      setSelectedUser(found);
    } else {
      setError(`No user found matching "${inputValue}". Try: user_a, user_b, or a wallet address fragment.`);
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

            {/* Tenant & Campaign Dropdowns */}
            <div className="flex items-center gap-3">
              {/* Tenant Dropdown */}
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">Tenant</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedTenant.id}
                    onChange={(e) => setSelectedTenant(tenants.find(t => t.id === e.target.value) || tenants[0])}
                    className="appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {tenants.map(tenant => (
                      <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                    User {selectedUser.id.replace('user_', '').toUpperCase()} – {selectedUser.walletAddress.slice(0, 8)}…
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
                <StatCard label="Total Deposits" value={`$${selectedUser.totalDeposits.toLocaleString()}`} />
                <StatCard label="First Deposit" value={`$${selectedUser.firstDepositAmount.toLocaleString()}`} />
                <StatCard label="FTD Date" value={selectedUser.firstDepositDate} />
                <StatCard label="User Type" value={selectedUser.userType.replace('_', ' ')} />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Journey Timeline
                </h3>
                {selectedUser.attribution.status === 'attributed' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <Eye size={14} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Measurement: Post-View
                    </span>
                  </div>
                )}
              </div>
              <Timeline
                events={selectedUser.timeline}
                isAttributed={selectedUser.attribution.status === 'attributed'}
                attributionWindow={selectedUser.attribution.window || '7d'}
              />
            </div>

            {/* Narrative Story */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <NarrativeSection
                icon={<User size={20} className="text-blue-500" />}
                title="Who this user looks like to us"
                content={selectedUser.narrative.whoThisUserIs}
              />

              <NarrativeSection
                icon={<Eye size={20} className="text-purple-500" />}
                title="What they did before ads"
                content={selectedUser.narrative.beforeAds}
              />

              <NarrativeSection
                icon={<MousePointer2 size={20} className="text-amber-500" />}
                title="When ads start"
                content={selectedUser.narrative.adExposure}
              />

              <NarrativeSection
                icon={<ArrowRight size={20} className="text-cyan-500" />}
                title="What happens after"
                content={selectedUser.narrative.afterAds}
              />

              <NarrativeSection
                icon={selectedUser.attribution.status === 'attributed'
                  ? <CheckCircle2 size={20} className="text-emerald-500" />
                  : <XCircle size={20} className="text-gray-400" />
                }
                title="How it's attributed"
                content={selectedUser.narrative.howAttributed}
                isLast={true}
                highlight={true}
                isAttributed={selectedUser.attribution.status === 'attributed'}
              />
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
  isAttributed = true
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  isLast?: boolean;
  highlight?: boolean;
  isAttributed?: boolean;
}) {
  return (
    <section className={`${!isLast ? 'mb-8 pb-8 border-b border-gray-100' : ''}`}>
      <div className={`
        rounded-xl p-6
        ${highlight
          ? isAttributed
            ? 'bg-emerald-50 border border-emerald-100'
            : 'bg-gray-50 border border-gray-200'
          : ''
        }
      `}>
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h4 className="font-semibold text-gray-900">{title}</h4>
        </div>
        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </section>
  );
}

function Timeline({ events, isAttributed, attributionWindow }: {
  events: UserProfile['timeline'];
  isAttributed: boolean;
  attributionWindow: string;
}) {
  const typeIcons: Record<string, React.ReactNode> = {
    visit: <Eye size={14} className="text-gray-400" />,
    impression: <Eye size={14} className="text-purple-500" />,
    click: <MousePointer2 size={14} className="text-blue-500" />,
    registration: <FileCheck size={14} className="text-cyan-500" />,
    deposit: <Wallet size={14} className="text-emerald-500" />,
    return: <ArrowRight size={14} className="text-amber-500" />,
  };

  const typeColors: Record<string, string> = {
    visit: 'border-gray-200 bg-gray-50',
    impression: 'border-purple-200 bg-purple-50',
    click: 'border-blue-200 bg-blue-50',
    registration: 'border-cyan-200 bg-cyan-50',
    deposit: 'border-emerald-200 bg-emerald-50',
    return: 'border-amber-200 bg-amber-50',
  };

  // Events that count as attributed (deposit, registration after ads)
  const attributedEventTypes = ['deposit', 'registration'];
  const windowDays = attributionWindow === '30d' ? 30 : 7;

  return (
    <div className="relative">
      {events.map((event, idx) => {
        const isAttributedEvent = isAttributed && attributedEventTypes.includes(event.type);

        return (
          <div key={idx} className="flex items-start gap-4 relative">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 ${typeColors[event.type]} flex items-center justify-center z-10`}>
                {typeIcons[event.type]}
              </div>
              {idx < events.length - 1 && (
                <div className="w-0.5 h-10 bg-gray-200" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-baseline gap-3 mb-0.5">
                <span className="text-sm font-mono text-gray-400">{event.date}</span>
                <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded">
                  {event.type}
                </span>
              </div>
              <p className="text-gray-700">{event.description}</p>
              {event.source && (
                <p className="text-xs text-gray-400 mt-0.5">via {event.source}</p>
              )}

              {/* Attribution Label */}
              {isAttributedEvent && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">
                    Event attributed to us — was within {windowDays} days window
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
