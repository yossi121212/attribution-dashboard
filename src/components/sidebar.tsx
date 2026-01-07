'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    {
        name: 'Attribution Explainer',
        href: '/',
        icon: Sparkles,
    },
    {
        name: 'Users Story',
        href: '/users-story',
        icon: Users,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`
        ${collapsed ? 'w-20' : 'w-64'}
        h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300
      `}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">Attribution</span>
                    </div>
                )}
                {collapsed && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto">
                        <Sparkles size={18} className="text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <Icon size={20} />
                                    {!collapsed && <span className="text-sm">{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Collapse Button */}
            <div className="p-3 border-t border-gray-100">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight size={18} />
                    ) : (
                        <>
                            <ChevronLeft size={18} />
                            <span className="text-sm">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
