'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3,
  Users,
  Radar,
  Database,
  Settings,
  ChevronDown,
  ChevronLeft,
  Headphones,
  Rocket,
  LayoutDashboard,
} from 'lucide-react';

import Image from 'next/image';

// Logo component
const Logo = () => (
  <div className="relative w-8 h-8">
    <Image
      src="/logoa.svg"
      alt="Addressable Logo"
      fill
      className="object-contain"
    />
  </div>
);

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: { name: string; href: string }[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    items: [
      {
        name: 'Paid Campaigns',
        icon: Rocket,
        href: '/paid-campaigns',
        children: [
          { name: 'Overview', href: '/paid-campaigns' },
          { name: 'Attribution Breakdown', href: '/' },
        ],
      },
      {
        name: 'Reports',
        icon: BarChart3,
        children: [
          { name: 'Marketing Overview', href: '/reports/marketing' },
          { name: 'Funnel Analysis', href: '/reports/funnel' },
          { name: 'Marketing Breakdown', href: '/reports/breakdown' },
        ],
      },
      {
        name: 'Audience',
        icon: Users,
        children: [],
      },
      {
        name: 'User Radar',
        icon: Radar,
        children: [
          { name: 'Overview', href: '/user-radar/overview' },
          { name: 'Profiles', href: '/user-radar/profiles' },
        ],
      },
      {
        name: 'Data Sources',
        icon: Database,
        children: [
          { name: 'Event Manager', href: '/event-manager' },
          { name: 'Integrations', href: '/integrations' },
        ],
      },
      {
        name: 'Admin',
        icon: Settings,
        children: [
          { name: 'General', href: '/settings/general' },
          { name: 'Team', href: '/settings/team' },
        ],
      },
    ],
  },
];

export function NewSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Paid Campaigns', 'User Radar', 'Data Sources']);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <aside
      className={`
        ${collapsed ? 'w-[60px]' : 'w-[212px]'}
        h-screen bg-white flex flex-col transition-all duration-300
        shadow-[4px_0_40px_0_rgba(166,181,211,0.25)]
        shrink-0 relative z-20
      `}
    >
      {/* Header */}
      <div className="h-[56px] flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Logo />
          {!collapsed && (
            <span className="font-medium text-gray-700 text-sm">Addressable</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft size={16} className={collapsed ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {navigation.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-1">
            {section.title && !collapsed && (
              <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <ul className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.name);
                const activeItem = isActive(item.href);
                const activeChild = item.children?.some(child => isActive(child.href));
                const isItemOrChildActive = activeItem || activeChild;

                return (
                  <li key={item.name}>
                    {/* Parent Item */}
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpanded(item.name);
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-[4px] transition-all
                        ${isItemOrChildActive && !hasChildren
                          ? 'bg-[#FBF6FE] text-[#B045E6]'
                          : 'text-[#6A7290] hover:bg-gray-50'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon size={18} className={isItemOrChildActive ? 'text-[#B045E6]' : ''} />
                      {!collapsed && (
                        <>
                          <span className={`text-xs font-medium flex-1 text-left ${isItemOrChildActive ? 'text-[#B045E6]' : ''}`}>
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] bg-[#B045E6] text-white px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                          {hasChildren && (
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          )}
                        </>
                      )}
                    </button>

                    {/* Submenu */}
                    {hasChildren && isExpanded && !collapsed && (
                      <ul className="mt-1 ml-6 space-y-0.5 border-l border-gray-100 pl-2">
                        {item.children!.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`
                                block px-3 py-1.5 rounded-[4px] text-xs transition-colors
                                ${isActive(child.href)
                                  ? 'text-[#B045E6] font-medium bg-[#FBF6FE]'
                                  : 'text-[#6A7290] hover:text-gray-900 hover:bg-gray-50'
                                }
                              `}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            {sectionIndex < navigation.length - 1 && (
              <div className="mx-4 my-2 border-t border-gray-100" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-100 bg-white">
          {/* User */}
          <div className="flex items-center gap-3 px-2 py-2 mb-1 hover:bg-gray-50 rounded-[4px] cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-medium shadow-sm">
              TS
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-700 font-medium leading-none mb-1">Tomer Shlomo</span>
              <span className="text-[10px] text-gray-400 leading-none">Admin</span>
            </div>
          </div>
          {/* Support */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[#6A7290] hover:bg-gray-50 rounded-[4px] transition-colors">
            <Headphones size={18} />
            <span className="text-xs font-medium">Support</span>
          </button>
        </div>
      )}
    </aside>
  );
}
