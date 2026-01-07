'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { getAllUsers, UserProfile, formatValue, DailyImpression } from '@/lib/data';
import { generateUserStory } from '@/lib/story-generator';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    ColumnDef,
    Header,
} from '@tanstack/react-table';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Users,
    Search,
    X,
    CheckCircle2,
    XCircle,
    Eye,
    MousePointer2,
    FileCheck,
    Wallet,
    ArrowRight,
    User,
    Info,
    Copy,
    Check,
    Calendar,
    WalletCards,
    Maximize2,
    Minimize2,
} from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { WalletIcon } from '@/components/wallet-icons';

// Country flag component that dynamically renders the flag based on country code
function CountryFlag({ countryCode }: { countryCode: string }) {
    const FlagComponent = (Flags as Record<string, React.ComponentType<{ className?: string }>>)[countryCode];
    if (!FlagComponent) {
        return <span className="w-5 h-4 bg-gray-200 rounded inline-block" />;
    }
    return <FlagComponent className="w-5 h-4 rounded shadow-sm inline-block" />;
}

// Format date string to be more readable
function formatDateString(dateStr: string) {
    if (!dateStr || dateStr === '-') return '-';
    try {
        // Handle format: "YYYY-MM-DD HH:mm:ss UTC"
        // Also handles standard partial dates if needed
        const isoStr = dateStr.includes(' UTC')
            ? dateStr.replace(' UTC', 'Z').replace(' ', 'T')
            : dateStr;

        const date = new Date(isoStr);
        if (isNaN(date.getTime())) return dateStr;

        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    } catch (e) {
        return dateStr;
    }
}

// Copyable ID cell component with hover tooltip and copy button
function CopyableIdCell({ value, className }: { value: string; className?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const displayValue = value.length > 12
        ? `${value.slice(0, 8)}...${value.slice(-4)}`
        : value;

    return (
        <div className={`group/cell relative inline-flex items-center gap-2 ${className || ''}`}>
            <span className="font-mono text-sm text-gray-600 cursor-help whitespace-nowrap">
                {displayValue}
            </span>
            <button
                onClick={handleCopy}
                className="opacity-0 group-hover/cell:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                title="Copy to clipboard"
            >
                {copied ? (
                    <Check size={14} className="text-emerald-500" />
                ) : (
                    <Copy size={14} className="text-gray-400 hover:text-gray-600" />
                )}
            </button>
            <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/cell:opacity-100 transition-opacity z-[9999] pointer-events-none font-mono max-w-none whitespace-nowrap">
                {value}
                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
}

// Column header with tooltip - using fixed positioning to escape overflow containers
function HeaderWithTooltip({ title, tooltip }: { title: string; tooltip: string }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const iconRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setTooltipPosition({
                top: rect.top - 8,
                left: rect.left + rect.width / 2,
            });
        }
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span>{title}</span>
            <div
                ref={iconRef}
                className="relative cursor-help"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Info size={14} className="text-gray-400" />
            </div>
            {showTooltip && (
                <div
                    className="fixed px-3 py-2 bg-gray-900 text-white text-xs rounded-lg pointer-events-none max-w-xs text-center shadow-lg"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 99999,
                    }}
                >
                    <div className="whitespace-normal">{tooltip}</div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );
}

// Draggable Header Component
function DraggableTableHeader({ header }: { header: Header<UserProfile, unknown> }) {
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
        useSortable({ id: header.column.id });

    const style: React.CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'sticky',
        top: 0,
        transform: CSS.Translate.toString(transform),
        transition,
        width: header.getSize(),
        zIndex: isDragging ? 100 : 20,
    };

    return (
        <th
            ref={setNodeRef}
            colSpan={header.colSpan}
            style={style}
            className="sticky top-0 z-20 bg-gray-50 px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider group cursor-move"
        >
            <div className="flex items-center gap-1">
                <div {...attributes} {...listeners} className="outline-none">
                    {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                </div>
            </div>
        </th>
    );
}

const columnHelper = createColumnHelper<UserProfile>();

// Column tooltips definitions
const columnTooltips = {
    sdkStrongId: 'Unique Addressable identifier used to track the same user across ad exposure, site visits, and conversion events, before and after user identification.',
    firstTimeSeen: 'The earliest timestamp when this user was first observed by Addressable, typically via ad exposure or pixel activity.',
    firstTimeFtd: 'The time when the user made their first-ever deposit on the advertiser\'s platform, regardless of attribution.',
    firstTimeAttributedFtd: 'The time when the user\'s first deposit qualified for attribution under Addressable\'s attribution rules and windows.',
    firstTimeAttributed: 'The first moment when this user became attributable to an Addressable campaign based on exposure and attribution logic.',
    daysVisitBeforeBeingAttributed: 'Number of days between the user\'s first observed activity and the moment they became attributable to a campaign.',
    totalAttributedFtd: 'Count of attribution records where this user\'s first deposit was credited to campaigns across reporting contexts.',
    totalAttributedFtdValue: 'Total monetary value of all first-time deposits attributed to Addressable campaigns for this user.',
    totalAttributedPurchase: 'Total number of purchase events attributed to Addressable campaigns for this user.',
    totalAttributedPurchaseValue: 'Total monetary value of all purchase events attributed to Addressable campaigns for this user.',
    dailyImps: 'Daily breakdown of ad impressions served to this user, grouped by publisher or domain.',
    banners: 'List of ad creative formats that were served to this user.',
    dailyClicks: 'Daily breakdown of ad clicks recorded for this user, if any.',
    metawinUserId: 'User identifier as received from the advertiser\'s platform, once available.',
    metawinUserIdFirstTime: 'The first time the advertiser\'s user ID was observed and linked to the Addressable user.',
    metawinUserIdFirstFtd: 'The time when the advertiser\'s platform recorded the user\'s first deposit.',
    allWallets: 'List of blockchain wallets associated with this user, if detected.',
    primaryCountry: 'The primary country associated with this user based on observed activity.',
    balanceGroup: 'User balance classification as provided or inferred from the advertiser\'s data.',
    walletProviders: 'List of wallet providers associated with this user (e.g. MetaMask, WalletConnect, Coinbase Wallet).',
};

// Helper function to get color class for Balance Group
function getBalanceGroupColor(group: string) {
    let colorClass = 'bg-gray-100 text-gray-600'; // Default

    switch (group) {
        case 'No Balance':
            colorClass = 'bg-gray-100 text-gray-600';
            break;
        case '<$1k':
            colorClass = 'bg-blue-50 text-blue-700';
            break;
        case '$1K - $10K':
            colorClass = 'bg-cyan-50 text-cyan-700';
            break;
        case '$10K - $100K':
            colorClass = 'bg-indigo-50 text-indigo-700';
            break;
        case '$100K - $1M':
            colorClass = 'bg-purple-50 text-purple-700';
            break;
        case '>$1M':
            colorClass = 'bg-fuchsia-50 text-fuchsia-700';
            break;
        case 'VIP':
            colorClass = 'bg-rose-50 text-rose-700';
            break;
        case 'High Roller':
            colorClass = 'bg-amber-50 text-amber-700';
            break;
        default:
            if (group.includes('VIP')) colorClass = 'bg-rose-50 text-rose-700';
            else if (group.includes('High')) colorClass = 'bg-amber-50 text-amber-700';
            else if (group === 'Medium') colorClass = 'bg-blue-50 text-blue-700';
    }

    return colorClass;
}

export default function UsersStoryPage() {
    const users = getAllUsers();
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const columns = useMemo<ColumnDef<UserProfile, any>[]>(() => [
        columnHelper.accessor('sdkStrongId', {
            id: 'sdkStrongId',
            header: () => <HeaderWithTooltip title="SDK Strong ID" tooltip={columnTooltips.sdkStrongId} />,
            cell: info => <CopyableIdCell value={info.getValue()} className="font-semibold" />,
            size: 180,
        }),
        columnHelper.accessor('metawinUserId', {
            id: 'metawinUserId',
            header: () => <HeaderWithTooltip title="User ID" tooltip={columnTooltips.metawinUserId} />,
            cell: info => <CopyableIdCell value={info.getValue()} className="font-semibold" />,
            size: 180,
        }),
        columnHelper.accessor('firstTimeSeen', {
            id: 'firstTimeSeen',
            header: () => <HeaderWithTooltip title="First Time Seen" tooltip={columnTooltips.firstTimeSeen} />,
            cell: info => <span className="text-sm text-gray-600 font-mono whitespace-nowrap">{info.getValue()}</span>,
            size: 130,
        }),
        columnHelper.accessor('firstTimeFtd', {
            id: 'firstTimeFtd',
            header: () => <HeaderWithTooltip title="First Time FTD" tooltip={columnTooltips.firstTimeFtd} />,
            cell: info => <span className="text-sm text-gray-600 font-mono whitespace-nowrap">{info.getValue()}</span>,
            size: 130,
        }),
        columnHelper.accessor('firstTimeAttributedFtd', {
            id: 'firstTimeAttributedFtd',
            header: () => <HeaderWithTooltip title="First Time Attributed FTD" tooltip={columnTooltips.firstTimeAttributedFtd} />,
            cell: info => <span className="text-sm text-gray-600 font-mono whitespace-nowrap">{info.getValue() || '-'}</span>,
            size: 180,
        }),
        columnHelper.accessor('firstTimeAttributed', {
            id: 'firstTimeAttributed',
            header: () => <HeaderWithTooltip title="First Time Attributed" tooltip={columnTooltips.firstTimeAttributed} />,
            cell: info => <span className="text-sm text-gray-600 font-mono whitespace-nowrap">{info.getValue() || '-'}</span>,
            size: 160,
        }),
        columnHelper.accessor('daysVisitBeforeBeingAttributed', {
            id: 'daysVisitBeforeBeingAttributed',
            header: () => <HeaderWithTooltip title="Days Visit Before Attributed" tooltip={columnTooltips.daysVisitBeforeBeingAttributed} />,
            cell: info => <span className="text-sm text-gray-900 font-medium whitespace-nowrap">{info.getValue()} days</span>,
            size: 180,
        }),
        columnHelper.accessor('totalAttributedFtd', {
            id: 'totalAttributedFtd',
            header: () => <HeaderWithTooltip title="Total Attributed FTD" tooltip={columnTooltips.totalAttributedFtd} />,
            cell: info => <span className="text-sm text-gray-900 font-semibold whitespace-nowrap">{info.getValue()}</span>,
            size: 160,
        }),
        columnHelper.accessor('totalAttributedFtdValue', {
            id: 'totalAttributedFtdValue',
            header: () => <HeaderWithTooltip title="Total Attributed FTD Value" tooltip={columnTooltips.totalAttributedFtdValue} />,
            cell: info => <span className="text-sm text-gray-900 font-semibold whitespace-nowrap">{formatValue(info.getValue())}</span>,
            size: 180,
        }),
        columnHelper.accessor('totalAttributedPurchase', {
            id: 'totalAttributedPurchase',
            header: () => <HeaderWithTooltip title="Total Attributed Purchase" tooltip={columnTooltips.totalAttributedPurchase} />,
            cell: info => <span className="text-sm text-gray-900 font-semibold whitespace-nowrap">{info.getValue()}</span>,
            size: 180,
        }),
        columnHelper.accessor('totalAttributedPurchaseValue', {
            id: 'totalAttributedPurchaseValue',
            header: () => <HeaderWithTooltip title="Total Attributed Purchase Value" tooltip={columnTooltips.totalAttributedPurchaseValue} />,
            cell: info => <span className="text-sm text-gray-900 font-semibold whitespace-nowrap">{formatValue(info.getValue())}</span>,
            size: 200,
        }),
        columnHelper.accessor('dailyImps', {
            id: 'dailyImps',
            header: () => <HeaderWithTooltip title="Daily Imps" tooltip={columnTooltips.dailyImps} />,
            cell: info => (
                <div className="flex flex-col gap-1.5 py-1">
                    {info.getValue().sort((a: DailyImpression, b: DailyImpression) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((imp: DailyImpression, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md">
                                <Calendar size={10} className="text-slate-500" />
                                <span className="font-mono font-medium text-slate-600">{formatDateString(imp.date.split(' ')[0])}</span>
                            </span>
                            <span className="text-gray-600">-</span>
                            <span className="text-gray-700">{imp.domain}</span>
                            <span className="text-gray-500">({imp.count} impressions)</span>
                        </div>
                    ))}
                </div>
            ),
            size: 380,
        }),
        columnHelper.accessor('banners', {
            id: 'banners',
            header: () => <HeaderWithTooltip title="Banners" tooltip={columnTooltips.banners} />,
            cell: info => <span className="text-sm text-gray-600 whitespace-nowrap">{info.getValue() || '-'}</span>,
            size: 150,
        }),
        columnHelper.accessor('dailyClicks', {
            id: 'dailyClicks',
            header: () => <HeaderWithTooltip title="Daily Clicks" tooltip={columnTooltips.dailyClicks} />,
            cell: info => <span className="text-sm text-gray-600 whitespace-nowrap">{info.getValue()}</span>,
            size: 110,
        }),
        columnHelper.accessor('metawinUserIdFirstTime', {
            id: 'metawinUserIdFirstTime',
            header: () => <HeaderWithTooltip title="User ID First Time" tooltip={columnTooltips.metawinUserIdFirstTime} />,
            cell: info => <span className="text-sm text-gray-600 font-mono whitespace-nowrap">{formatDateString(info.getValue())}</span>,
            size: 180,
        }),
        columnHelper.accessor('metawinUserIdFirstFtd', {
            id: 'metawinUserIdFirstFtd',
            header: () => <HeaderWithTooltip title="User ID First FTD" tooltip={columnTooltips.metawinUserIdFirstFtd} />,
            cell: info => <span className="text-sm text-gray-600 font-mono whitespace-nowrap">{info.getValue()}</span>,
            size: 180,
        }),
        columnHelper.accessor('allWallets', {
            id: 'allWallets',
            header: () => <HeaderWithTooltip title="All Wallets" tooltip={columnTooltips.allWallets} />,
            cell: info => {
                const val = info.getValue();
                if (!val) return <span className="text-gray-400">-</span>;
                return <CopyableIdCell value={val} />;
            },
            size: 180,
        }),
        columnHelper.accessor('primaryCountry', {
            id: 'primaryCountry',
            header: () => <HeaderWithTooltip title="Primary Country" tooltip={columnTooltips.primaryCountry} />,
            cell: info => (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <CountryFlag countryCode={info.getValue()} />
                    <span className="text-sm text-gray-600">{info.getValue()}</span>
                </div>
            ),
            size: 140,
        }),
        columnHelper.accessor('balanceGroup', {
            id: 'balanceGroup',
            header: () => <HeaderWithTooltip title="Balance Group" tooltip={columnTooltips.balanceGroup} />,
            cell: info => {
                const group = info.getValue();
                const colorClass = getBalanceGroupColor(group);

                return (
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colorClass}`}>
                        {group}
                    </span>
                );
            },
            size: 130,
        }),
        columnHelper.accessor('walletProviders', {
            id: 'walletProviders',
            header: () => <HeaderWithTooltip title="Wallet Providers" tooltip={columnTooltips.walletProviders} />,
            cell: info => {
                const val = info.getValue();
                if (!val || val === '[]' || val === '') return <span className="text-gray-400">-</span>;
                const providers = val.split(',').map((p: string) => p.trim()).filter((p: string) => p);
                return (
                    <div className="flex items-center gap-2">
                        {providers.map((provider: string, idx: number) => (
                            <div key={idx} className="relative group/icon">
                                <WalletIcon provider={provider} className="w-6 h-6 shadow-sm rounded-full overflow-hidden" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/icon:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">
                                    {provider}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            },
            size: 150,
        }),
    ], []);

    // Load initial column order
    useEffect(() => {
        if (columnOrder.length === 0) {
            setColumnOrder(columns.map(c => c.id || (c as any).accessorKey as string));
        }
    }, [columns, columnOrder.length]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setColumnOrder((order) => {
                const oldIndex = order.indexOf(active.id as string);
                const newIndex = order.indexOf(over.id as string);
                return arrayMove(order, oldIndex, newIndex);
            });
        }
    }

    const table = useReactTable({
        data: users,
        columns,
        state: {
            globalFilter,
            columnOrder,
        },
        onColumnOrderChange: setColumnOrder,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            const user = row.original;
            return (
                user.metawinUserId.toLowerCase().includes(search) ||
                user.sdkStrongId.toLowerCase().includes(search) ||
                user.allWallets.toLowerCase().includes(search)
            );
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Main Content */}
            <div className={`flex-1 min-w-0 transition-all duration-300`}>
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Attribution User Explorer</h1>
                            <p className="text-sm text-gray-500">Explore detailed attribution paths for Metawin users. Click on any row to open the flyout and view the complete user story.</p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-8">
                    {/* Search Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Search by user ID or wallet address..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Users Table with TanStack */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <DndContext
                            id="users-table-dnd-context"
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <div
                                ref={tableContainerRef}
                                className="overflow-auto"
                                style={{ maxWidth: '100%', height: 'calc(100vh - 280px)' }}
                            >
                                <table className="w-full" style={{ minWidth: '3200px' }}>
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                <SortableContext
                                                    items={columnOrder}
                                                    strategy={horizontalListSortingStrategy}
                                                >
                                                    {headerGroup.headers.map(header => (
                                                        <DraggableTableHeader key={header.id} header={header} />
                                                    ))}
                                                </SortableContext>
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {table.getRowModel().rows.map(row => (
                                            <tr
                                                key={row.id}
                                                onClick={() => setSelectedUser(row.original)}
                                                className={`hover:bg-purple-50 cursor-pointer transition-colors ${selectedUser?.sdkStrongId === row.original.sdkStrongId ? 'bg-purple-50' : ''
                                                    }`}
                                            >
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id} className="px-4 py-4">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </DndContext>

                        {table.getRowModel().rows.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No users found matching &quot;{globalFilter}&quot;</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Flyout Panel */}
            {selectedUser && (
                <UserFlyout user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </div>
    );
}

function UserFlyout({ user, onClose }: { user: UserProfile; onClose: () => void }) {
    const [isFullScreen, setIsFullScreen] = useState(false);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                onClick={onClose}
            />

            <div className={`
                fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto z-50 transition-all duration-300
                ${isFullScreen ? 'w-full' : 'w-[520px]'}
            `}>
                {/* Flyout Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        {/* User Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                            {user.metawinUserId.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CountryFlag countryCode={user.primaryCountry} />
                                <h2 className="text-lg font-bold text-gray-900">
                                    User Details
                                </h2>
                            </div>
                            <p className="text-sm text-gray-500 font-mono truncate max-w-[300px]" title={user.metawinUserId}>
                                {user.metawinUserId.length > 12 ? `${user.metawinUserId.slice(0, 6)}...${user.metawinUserId.slice(-4)}` : user.metawinUserId}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Wallet size={14} className="text-gray-400" />
                                <p className="text-sm text-gray-500 font-mono">
                                    {user.allWallets.slice(0, 6)}...{user.allWallets.slice(-4)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                            title={isFullScreen ? "Exit full screen" : "Full screen"}
                        >
                            {isFullScreen ? (
                                <Minimize2 size={20} className="text-gray-500" />
                            ) : (
                                <Maximize2 size={20} className="text-gray-500" />
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Flyout Content */}
                <div className="p-6 space-y-6">
                    {/* Attribution Status Banner */}
                    <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    ${user.attribution.status === 'attributed'
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-gray-50 border border-gray-200'
                        }
                `}>
                        {user.attribution.status === 'attributed' ? (
                            <CheckCircle2 size={20} className="text-emerald-600" />
                        ) : (
                            <XCircle size={20} className="text-gray-400" />
                        )}
                        <div>
                            <p className={`font-semibold ${user.attribution.status === 'attributed' ? 'text-emerald-700' : 'text-gray-600'}`}>
                                {user.attribution.status === 'attributed' ? 'Attributed' : 'Not Attributed'}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Total Attributed FTD Value" value={`$${user.totalAttributedFtdValue.toLocaleString()}`} />
                        <StatCard label="Total Attributed Purchase Value" value={`$${user.totalAttributedPurchaseValue ? user.totalAttributedPurchaseValue.toLocaleString() : '0'}`} />
                        <StatCard
                            label="Balance Group"
                            value={user.balanceGroup}
                            valueClassName={`inline-block px-2 py-0.5 rounded-full text-xs ${getBalanceGroupColor(user.balanceGroup)}`}
                        />
                        <StatCard label="Number of Wallets" value={user.walletProviders && user.walletProviders !== '[]' && user.walletProviders !== '' ? user.walletProviders.split(',').length.toString() : '0'} />

                        {user.walletProviders && user.walletProviders !== '[]' && user.walletProviders !== '' && (
                            <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                                <p className="text-xs text-gray-500 mb-2">Wallet Providers</p>
                                <div className="flex items-center gap-3">
                                    {user.walletProviders.split(',').map(p => p.trim()).filter(p => p).map((provider, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                                            <WalletIcon provider={provider} className="w-5 h-5" />
                                            <span className="text-sm font-medium text-gray-700">{provider}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dynamic Story Timeline */}
                    <div className="relative pb-4">
                        {generateUserStory(user).map((section, idx) => (
                            <NarrativeSection
                                key={idx}
                                icon={<section.icon size={18} className="text-white relative z-10" />}
                                title={section.title}
                                content={section.content}
                                date={section.date}
                                isLast={idx === generateUserStory(user).length - 1}
                                colorClass={section.colorClass}
                                highlight={section.title === 'First Time Deposit (FTD)' || section.title === 'Summary'}
                            />
                        ))}
                    </div>

                    {/* Narrative Sections */}

                </div>
            </div>
        </>
    );
}

function StatCard({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
    return (
        <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className={`text-sm font-semibold text-gray-900 capitalize ${valueClassName || ''}`}>{value}</p>
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
    // Extract base color from the colorClass prop provided by story-generator (e.g. 'text-amber-500' -> 'bg-amber-500')
    // We'll use a mapping or simple replacement effectively
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
                    <div className="w-0.5 grow bg-gray-200 mt-3 mb-3" />
                )}
            </div>

            {/* Content Column */}
            <div className={`flex-1 pb-3 ${isLast ? '' : ''}`}>
                <div className={`
                    rounded-xl p-5 border transition-shadow duration-200 shadow-sm
                    ${highlight
                        ? 'bg-gradient-to-br from-gray-50 to-white border-purple-200 shadow-md ring-1 ring-purple-50'
                        : 'bg-white border-gray-200 hover:shadow-md'
                    }
                `}>
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{title}</h4>
                            {date && (
                                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md">
                                    <Calendar size={12} className="text-slate-500" />
                                    <span className="text-xs font-medium text-slate-600 font-mono tracking-wide">
                                        {formatDateString(date)}
                                    </span>
                                </div>
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
