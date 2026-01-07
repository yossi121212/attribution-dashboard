'use client';

import { useState } from 'react';
import { getAllUsers, UserProfile } from '@/lib/data';
import { WalletIcon } from '@/components/wallet-icons';
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
  Building2,
  Calendar
} from 'lucide-react';

// Client name
const clientName = 'MetaWin';

// Convert country code to flag emoji
function countryToFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Get color classes for balance group
function getBalanceGroupColor(balanceGroup: string): string {
  const colors: Record<string, string> = {
    'No Balance': 'bg-gray-100 text-gray-700',
    '<$1k': 'bg-blue-100 text-blue-700',
    '$1K - $10K': 'bg-emerald-100 text-emerald-700',
    '$10K - $100K': 'bg-purple-100 text-purple-700',
    '$100K+': 'bg-amber-100 text-amber-700',
  };
  return colors[balanceGroup] || 'bg-gray-100 text-gray-700';
}

export default function ExplainableDashboard() {
  const users = getAllUsers();
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

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

            {/* Client */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Client</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <Building2 size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{clientName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter User ID
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


        </div>

        {/* Results */}
        {selectedUser && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start gap-6 mb-6">
                {/* Profile Picture */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <User size={36} className="text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          User {selectedUser.metawinUserId.slice(0, 8).toUpperCase()}
                        </h2>
                        {/* Country Flag */}
                        {selectedUser.primaryCountry && (
                          <span
                            className="text-2xl leading-none"
                            title={selectedUser.primaryCountry}
                          >
                            {countryToFlag(selectedUser.primaryCountry)}
                          </span>
                        )}
                      </div>

                      {/* Wallet Address */}
                      {selectedUser.allWallets && (
                        <div className="flex items-center gap-2 mt-1 group">
                          <Wallet size={14} className="text-gray-400" />
                          <code className="text-sm text-gray-500 font-mono">
                            {selectedUser.allWallets}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedUser.allWallets);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                            title="Copy wallet address"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Wallet Providers */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          {selectedUser.walletProviders.split(',').map((provider, idx) => (
                            <WalletIcon key={idx} provider={provider.trim()} className="w-5 h-5" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {selectedUser.walletProviders}
                        </span>
                      </div>
                    </div>

                    {/* Attribution Badge + Balance Group */}
                    <div className="flex flex-col items-end gap-2">
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

                      {/* Balance Group Badge */}
                      <div className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${getBalanceGroupColor(selectedUser.balanceGroup)}
                      `}>
                        {selectedUser.balanceGroup}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard
                  label="Total FTD Value"
                  value={`$${selectedUser.totalAttributedFtdValue.toLocaleString()}`}
                  highlight={true}
                />
                <StatCard
                  label="Total Deposits"
                  value={`${selectedUser.totalAttributedFtd} deposits`}
                />
                <DateStatCard
                  label="First FTD Date"
                  date={selectedUser.firstTimeFtd}
                />
                <StatCard
                  label="Total Deposit Value"
                  value={`$${selectedUser.totalAttributedPurchaseValue.toLocaleString()}`}
                />
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
            <p className="text-lg">Enter a User ID and click Generate</p>
            <p className="text-sm mt-1">to see their attribution story</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-100' : 'bg-gray-50'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold capitalize ${highlight ? 'text-purple-700' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function DateStatCard({ label, date }: { label: string; date: string }) {
  // Parse and format the date more prominently
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(month, 10) - 1] || month;
      return { day, monthName, year };
    }
    return null;
  };

  const parsed = formatDate(date);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      {parsed ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
          <Calendar size={14} className="text-gray-500" />
          {parsed.monthName} {parsed.day}, {parsed.year}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
          <Calendar size={14} className="text-gray-500" />
          {date}
        </span>
      )}
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

  // Parse content to render special formatting for impressions
  const renderContent = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      // Check if line is an impression line
      // Format 1: • domain.com - 50 impressions
      // Format 2: • domain.com - 50 impressions | Oct 22, 2025
      const match = line.match(/^• (.+?) - (\d+) impressions(?: \| (.+))?$/);

      if (match) {
        const [, domain, count, dateStr] = match;
        return (
          <div key={idx} className="flex items-center gap-2 py-1.5 group/line">
            <span className="w-5 h-5 flex items-center justify-center bg-blue-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
              </svg>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 tracking-tight">{domain}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-gray-500">{count} impressions</span>
              {dateStr && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md">
                    <Calendar size={10} className="text-slate-400" />
                    <span className="font-mono font-bold text-slate-500 text-[10px] uppercase tracking-wider">{dateStr}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        );
      }

      // Regular text line
      return <div key={idx} className="py-0.5">{line}</div>;
    });
  };

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
            <h4 className="font-bold text-gray-900 text-base leading-tight">{title}</h4>
            {date && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-md text-sm font-medium">
                <Calendar size={14} className="text-slate-500" />
                {date}
              </span>
            )}
          </div>

          <div className="text-gray-600 text-sm leading-relaxed">
            {renderContent(content)}
          </div>
        </div>
      </div>
    </div>
  );
}


