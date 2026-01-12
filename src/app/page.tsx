'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { NewSidebar } from '@/components/new-sidebar';
import {
  Search,
  Filter,
  HelpCircle,
  Plus,
  Clock,
  ChevronDown,
  Columns,
  Download,
  Users,
  Info,
  ArrowUpDown,
  Eye,
  MousePointer2,
  X,
} from 'lucide-react';

// Helper to truncate IDs
const truncateId = (id: string) => {
  if (!id) return '';
  if (id.length <= 16) return id;
  return `${id.slice(0, 8)}...${id.slice(-6)}`;
};

const truncateEventId = (id: string) => {
  if (!id) return '';
  if (id.length <= 8) return id;
  return `${id.slice(0, 8)}...`;
};

// Filter options for Add Filter dropdown
const filterOptions = [
  { id: 'eventName', label: 'Event Name' },
  { id: 'campaignName', label: 'Campaign Name' },
  { id: 'attributionType', label: 'Attribution Type' },
];

// Available filter values for each filter type
const filterValues: Record<string, string[]> = {
  eventName: ['Registration', 'FTD', 'Deposit'],
  campaignName: ['Adventure Awaits', 'Summer Splash', 'Mystic Journeys', 'Epic Quest', 'Casino Q1', 'Winter Wonderland'],
  attributionType: ['Post View', 'Post Click'],
};

// Group By options for the dropdown
const groupByOptions = [
  { id: 'eventName', label: 'Event Name' },
  { id: 'campaignName', label: 'Campaign Name' },
  { id: 'attributionType', label: 'Attribution Type' },
  { id: 'addressableUserId', label: 'Addressable User ID' },
  { id: 'advertiserUserId', label: 'Advertiser User ID' },
];

// Mock data for the conversion events table - expanded for grouping demo
const conversionEvents = [
  {
    eventName: 'Registration',
    eventId: '10c89273-4567-8901-2345-678901234567',
    addressableUserId: 'e745a301-218b-4c20-a63e-3f746b45a301',
    advertiserUserId: '123456454',
    campaignName: 'Adventure Awaits',
    attributionType: 'Post View',
    attributionSource: 'Crypto.com',
    firstTouchTime: 'Jan 01 10:00',
    eventTime: 'Jan 03 14:00',
    timeToConversion: '2 days 4h',
    attributionWindow: '14 days',
    revenue: 0,
  },
  {
    eventName: 'FTD',
    eventId: '8f4d2a91-2345-6789-0123-456789012345',
    addressableUserId: 'b823f412-329c-5d31-b74f-4g857c56b412',
    advertiserUserId: '1234123123',
    campaignName: 'Summer Splash',
    attributionType: 'Post Click',
    attributionSource: 'X (Twitter)',
    firstTouchTime: 'Jan 05 16:30',
    eventTime: 'Jan 06 09:15',
    timeToConversion: '16h 45m',
    attributionWindow: '30 days',
    revenue: 250.00,
  },
  {
    eventName: 'Deposit',
    eventId: '3e7c84b2-5678-9012-3456-789012345678',
    addressableUserId: 'c912d567-430d-6e42-c85f-5h968d67c567',
    advertiserUserId: '123456454',
    campaignName: 'Mystic Journeys',
    attributionType: 'Post View',
    attributionSource: 'Google Ads',
    firstTouchTime: 'Jan 08 22:45',
    eventTime: 'Jan 15 11:30',
    timeToConversion: '6 days 12h',
    attributionWindow: '14 days',
    revenue: 1500.00,
  },
  {
    eventName: 'Registration',
    eventId: '6a1f93c4-7890-1234-5678-901234567890',
    addressableUserId: 'd456e789-541e-7f53-d96g-6i079e78d789',
    advertiserUserId: '1234123123',
    campaignName: 'Epic Quest',
    attributionType: 'Post Click',
    attributionSource: 'Reddit',
    firstTouchTime: 'Jan 12 08:00',
    eventTime: 'Jan 12 08:45',
    timeToConversion: '45 min',
    attributionWindow: '30 days',
    revenue: 0,
  },
  {
    eventName: 'FTD',
    eventId: '2d8e45a7-9012-3456-7890-123456789012',
    addressableUserId: 'f234g567-652f-8g64-e07h-7j180f89e567',
    advertiserUserId: '123456454',
    campaignName: 'Casino Royale',
    attributionType: 'Post View',
    attributionSource: 'Crypto.com',
    firstTouchTime: 'Jan 10 14:20',
    eventTime: 'Jan 18 19:00',
    timeToConversion: '8 days 4h',
    attributionWindow: '14 days',
    revenue: 500.00,
  },
  {
    eventName: 'Deposit',
    eventId: '9bc12d34-1234-5678-9012-345678901234',
    addressableUserId: 'a789b012-763g-9h75-f18i-8k291g90f012',
    advertiserUserId: '1234123123',
    campaignName: 'High Roller',
    attributionType: 'Post Click',
    attributionSource: 'X (Twitter)',
    firstTouchTime: 'Jan 14 11:00',
    eventTime: 'Jan 14 11:25',
    timeToConversion: '25 min',
    attributionWindow: '30 days',
    revenue: 3200.00,
  },
  {
    eventName: 'Registration',
    eventId: '4ef56g78-2345-6789-0123-456789012345',
    addressableUserId: 'h123i456-874h-0i86-g29j-9l302h01g456',
    advertiserUserId: '123456454',
    campaignName: 'Welcome Bonus',
    attributionType: 'Post View',
    attributionSource: 'Google Ads',
    firstTouchTime: 'Jan 16 09:30',
    eventTime: 'Jan 20 15:45',
    timeToConversion: '4 days 6h',
    attributionWindow: '14 days',
    revenue: 0,
  },
  {
    eventName: 'Deposit',
    eventId: '5gh67i89-321j-klmn-opqr-stuvwxyz12',
    addressableUserId: 'e745a301-218b-4c20-a63e-3f746b45a301',
    advertiserUserId: '123456454',
    campaignName: 'Adventure Awaits',
    attributionType: 'Post View',
    attributionSource: 'Crypto.com',
    firstTouchTime: 'Jan 01 10:00',
    eventTime: 'Jan 02 10:00',
    timeToConversion: '1 day',
    attributionWindow: '30 days',
    revenue: 50.00,
  },
  {
    eventName: 'Registration',
    eventId: '6ij78k90-432l-mnop-qrst-uvwxyz3456',
    addressableUserId: 'f856b412-329c-5d31-b74f-4g857c56b412',
    advertiserUserId: '987654321',
    campaignName: 'Summer Splash',
    attributionType: 'Post Click',
    attributionSource: 'Facebook',
    firstTouchTime: 'Jan 05 14:20',
    eventTime: 'Jan 05 14:50',
    timeToConversion: '30 min',
    attributionWindow: '7 days',
    revenue: 0,
  },
  {
    eventName: 'Deposit',
    eventId: '7kl89m01-543n-opqr-stuv-wxyz567890',
    addressableUserId: 'f856b412-329c-5d31-b74f-4g857c56b412',
    advertiserUserId: '987654321',
    campaignName: 'Summer Splash',
    attributionType: 'Post Click',
    attributionSource: 'Facebook',
    firstTouchTime: 'Jan 05 14:20',
    eventTime: 'Jan 06 09:00',
    timeToConversion: '18 hours',
    attributionWindow: '7 days',
    revenue: 120.00,
  },
  {
    eventName: 'FTD',
    eventId: '8mn90n12-654o-pqrs-tuvw-xyz7890123',
    addressableUserId: 'a123b456-789c-0d12-e34f-5g678h90i123',
    advertiserUserId: '456789123',
    campaignName: 'Winter Wonderland',
    attributionType: 'Post View',
    attributionSource: 'Google Ads',
    firstTouchTime: 'Jan 10 11:00',
    eventTime: 'Jan 12 16:30',
    timeToConversion: '2 days 5h',
    attributionWindow: '14 days',
    revenue: 200.00,
  },
];

// Mock data for Converted Users Journey table
const convertedUsersJourney = [
  {
    addressableUserId: 'e745a301-218b-4c20-a63e-3f746b45a301',
    advertiserUserId: '123456454',
    primaryCountry: 'Spain',
    campaigns: ['Casino Q1', 'Casino Q2'],
    ads: ['Jackpot Joy Casino', 'Lucky Star Casino'],
    firstAttributedSource: 'Google',
    otherAttributedSources: [{ name: 'Crypto.com' }, { name: 'Google' }],
    registration: true,
    ftd: false,
    depositCount: 0,
    totalDepositsValue: 0,
    // Timeline events - exposure events can have multiple ads (same day)
    timelineEvents: [
      { type: 'first_seen', date: '2024-12-28 09:34', device: 'iPhone 14 Pro', source: 'Addressable SDK' },
      { type: 'first_exposure', date: '2025-01-02 14:12', device: 'iPhone 14 Pro', source: 'Google', ads: [{ name: 'Jackpot Joy Casino', source: 'Google' }] },
      { type: 'exposure', date: '2025-01-03 11:20', device: 'MacBook Pro', source: 'Crypto.com', ads: [{ name: 'Lucky Star Casino', source: 'Crypto.com' }] },
      { type: 'attributed_site_visit', date: '2025-01-07 10:10', device: 'iPhone 14 Pro', source: 'Google', page: 'Landing Page' },
      { type: 'registration', date: '2025-01-07 10:15', device: 'iPhone 14 Pro' },
      { type: 'deposit', date: '2025-01-15 09:30', device: 'iPhone 14 Pro', amount: '$500' },
    ],
  },
  {
    addressableUserId: 'c912d567-430d-6e42-c85f-5h968d67c567',
    advertiserUserId: '123456454',
    primaryCountry: 'Japan',
    campaigns: ['Casino Q2'],
    ads: ['High Roller Haven', "Fortune's Gate Casino"],
    firstAttributedSource: 'X (Twitter)',
    otherAttributedSources: [{ name: 'Crypto.com' }, { name: 'Google' }],
    registration: true,
    ftd: true,
    depositCount: 9,
    totalDepositsValue: 58414,
    timelineEvents: [
      { type: 'first_seen', date: '2025-01-15 16:22', device: 'Samsung Galaxy S23', source: 'Addressable SDK' },
      { type: 'first_exposure', date: '2025-01-20 11:03', device: 'Samsung Galaxy S23', source: 'Twitter', ads: [{ name: 'High Roller Haven', source: 'Twitter' }] },
      { type: 'exposure', date: '2025-01-20 14:30', device: 'Windows PC', source: 'Google', ads: [{ name: "Fortune's Gate Casino", source: 'Google' }] },
      { type: 'attributed_site_visit', date: '2025-01-20 15:05', device: 'Windows PC', source: 'Google', page: 'Landing Page' },
      { type: 'registration', date: '2025-01-20 15:10', device: 'Windows PC' },
      { type: 'ftd', date: '2025-01-20 15:25', device: 'Windows PC', amount: '$58,414' },
      { type: 'deposit', date: '2025-01-21 10:00', device: 'Multiple', amount: '$100' },
      { type: 'total_deposits', date: '2025-01-25 10:00', device: 'Multiple', depositCount: 9, totalAmount: '$58,414' },
      { type: 'last_seen', date: '2025-02-01 14:30', device: 'iPhone 15 Pro' },
    ],
  },
  {
    addressableUserId: 'e745a301-218b-4c20-a63e-3f746b45a301',
    advertiserUserId: '123456454',
    primaryCountry: 'USA',
    campaigns: ['Casino Q1', 'Casino Q2'],
    ads: ['Casino Q1', 'Casino Q2'],
    firstAttributedSource: 'Reddit',
    otherAttributedSources: [{ name: 'Coinmarketcap.com' }, { name: 'Crypto.com' }, { name: 'Google.com' }],
    registration: true,
    ftd: true,
    depositCount: 24,
    totalDepositsValue: 1044.01,
    timelineEvents: [
      { type: 'first_seen', date: '2025-01-03 18:05', device: 'iPad Pro', source: 'Addressable SDK' },
      { type: 'first_exposure', date: '2025-01-07 22:41', device: 'iPad Pro', source: 'Reddit', ads: [{ name: 'Casino Q1', source: 'Reddit' }] },
      { type: 'registration', date: '2025-01-14 09:30', device: 'iPhone 15' },
      { type: 'ftd', date: '2025-01-15 14:00', device: 'iPhone 15', amount: '$1,044.01' },
    ],
  },
  {
    addressableUserId: 'f234g567-652f-8g64-e07h-7j180f89e567',
    advertiserUserId: '123456454',
    primaryCountry: 'UK',
    campaigns: ['Casino Q1', 'Casino Q2'],
    ads: ['Spin Palace Casino', 'Neon Lights Casino'],
    firstAttributedSource: 'Crypto.com',
    otherAttributedSources: [{ name: 'Crypto.com' }, { name: 'Google' }],
    registration: true,
    ftd: true,
    depositCount: 2,
    totalDepositsValue: 1012.01,
    timelineEvents: [
      { type: 'first_seen', date: '2025-01-03 18:05', device: 'iPad Pro', source: 'Addressable SDK' },
      { type: 'first_exposure', date: '2025-01-07 22:41', device: 'iPad Pro', source: 'Crypto.com', ads: [{ name: 'Spin Palace Casino', source: 'Crypto.com' }] },
      { type: 'registration', date: '2025-01-14 09:30', device: 'iPhone 15' },
      { type: 'ftd', date: '2025-01-15 14:00', device: 'iPhone 15', amount: '$1,012.01' },
    ],
  },
  {
    addressableUserId: 'h123i456-874h-0i86-g29j-9l302h01g456',
    advertiserUserId: '123456454',
    primaryCountry: 'Germany',
    campaigns: ['Casino Q1', 'Casino Q3'],
    ads: ['Royal Flush Casino', 'Golden Nugget Casino'],
    firstAttributedSource: 'Coinmarketcap.com',
    otherAttributedSources: [{ name: 'Crypto.com' }, { name: 'Google' }],
    registration: false,
    ftd: false,
    depositCount: 0,
    totalDepositsValue: 0,
    timelineEvents: [
      { type: 'first_seen', date: '2025-01-03 18:05', device: 'iPad Pro', source: 'Addressable SDK' },
      { type: 'first_exposure', date: '2025-01-07 22:41', device: 'iPad Pro', source: 'Coinmarketcap.com', ads: [{ name: 'Royal Flush Casino', source: 'Coinmarketcap.com' }] },
    ],
  },
];

const tabs = [
  { name: 'Conversion events', href: '#conversion-events', active: true },
  { name: 'Converted Users Journey', href: '#converted-users' },
];

// Timeline event SVG icons and colors - each with unique modern color
const getEventConfig = (type: string) => {
  const configs: Record<string, { svg: string; color: string; bg: string; label: string }> = {
    first_seen: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
      color: '#8B5CF6', bg: '#EDE9FE', label: 'First Seen by Addressable'
    },
    first_exposure: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      color: '#3B82F6', bg: '#DBEAFE', label: 'First Ad Exposure'
    },
    exposure: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
      color: '#06B6D4', bg: '#CFFAFE', label: 'Ad Exposure'
    },
    attributed_site_visit: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      color: '#0EA5E9', bg: '#E0F2FE', label: 'Attributed Site Visit'
    },
    website_visit: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      color: '#10B981', bg: '#D1FAE5', label: 'Website Visit'
    },
    registration: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
      color: '#F59E0B', bg: '#FEF3C7', label: 'Registration'
    },
    ftd: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      color: '#22C55E', bg: '#DCFCE7', label: 'First Time Deposit'
    },
    deposit: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M12 15l2-2h-4z"/></svg>`,
      color: '#059669', bg: '#D1FAE5', label: 'Deposit'
    },
    deposits_summary: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
      color: '#14B8A6', bg: '#CCFBF1', label: 'Total Attributed Deposits'
    },
    total_deposits: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      color: '#F59E0B', bg: '#FEF3C7', label: 'Total Attributed Deposits'
    },
    last_activity: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      color: '#EC4899', bg: '#FCE7F3', label: 'Last Activity'
    },
    last_seen: {
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      color: '#6A7290', bg: '#F2F7FB', label: 'Last Seen'
    },
  };
  return configs[type] || { svg: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>`, color: '#6A7290', bg: '#F2F7FB', label: type };
};

// Platform icons SVG
const getPlatformIcon = (platform: string) => {
  const icons: Record<string, { svg: string; color: string }> = {
    'Twitter': {
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      color: '#000000'
    },
    'Google': {
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`,
      color: '#4285F4'
    },
    'Reddit': {
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" fill="#FF4500"/></svg>`,
      color: '#FF4500'
    },
    'Addressable SDK': {
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#B045E6"/></svg>`,
      color: '#B045E6'
    },
  };
  return icons[platform] || { svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#6A7290"/></svg>`, color: '#6A7290' };
};

// Device icons
const getDeviceIcon = (device: string) => {
  if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('samsung') || device.toLowerCase().includes('galaxy')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" fill="#6A7290"/></svg>`;
  } else if (device.toLowerCase().includes('ipad') || device.toLowerCase().includes('tablet')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z" fill="#6A7290"/></svg>`;
  } else {
    return `<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" fill="#6A7290"/></svg>`;
  }
};

export default function PaidCampaignsPage() {
  const [activeTab, setActiveTab] = useState('Conversion events');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [flyoutUser, setFlyoutUser] = useState<number | null>(null);

  // Tooltip state
  const [tooltipState, setTooltipState] = useState<{ visible: boolean; text: string; x: number; y: number }>({
    visible: false,
    text: '',
    x: 0,
    y: 0
  });



  // Filter State
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filterSearchQuery, setFilterSearchQuery] = useState('');
  const [pendingFilterSelections, setPendingFilterSelections] = useState<Record<string, string[]>>({});
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Group By State
  const [groupByOpen, setGroupByOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const groupByRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (groupByRef.current && !groupByRef.current.contains(event.target as Node)) {
        setGroupByOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
        setHoveredFilter(null);
        setPendingFilterSelections({});
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter available group options based on search
  const filteredGroupOptions = groupByOptions.filter(option =>
    option.label.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  // Filter conversion events based on selected filters
  const filteredConversionEvents = conversionEvents.filter(event => {
    // Check each active filter
    for (const [filterId, values] of Object.entries(selectedFilters)) {
      if (values.length === 0) continue;
      const eventValue = event[filterId as keyof typeof event];
      if (!values.includes(String(eventValue))) {
        return false;
      }
    }
    return true;
  });

  // Grouping Logic - now uses filteredConversionEvents
  const getGroupedData = () => {
    if (!selectedGroup) return { grouped: null, data: filteredConversionEvents };

    const groups: Record<string, typeof conversionEvents> = {};
    filteredConversionEvents.forEach(event => {
      const key = String(event[selectedGroup as keyof typeof event]);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
    });

    return { grouped: groups, data: filteredConversionEvents };
  };

  const { grouped: groupedEvents } = getGroupedData();

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const handleGroupSelect = (id: string) => {
    setSelectedGroup(id);
    // Auto expand all by default for better UX, or start collapsed
    const newExpanded: Record<string, boolean> = {};
    const groups = getGroupedData().grouped;
    if (groups) {
      Object.keys(groups).forEach(key => newExpanded[key] = true);
    }
    setExpandedGroups(newExpanded);
    setGroupByOpen(false);
  };

  const clearGroup = () => {
    setSelectedGroup(null);
    setExpandedGroups({});
    setGroupByOpen(false);
  };

  const expandAllGroups = () => {
    const newExpanded: Record<string, boolean> = {};
    if (groupedEvents) {
      Object.keys(groupedEvents).forEach(key => newExpanded[key] = true);
    }
    setExpandedGroups(newExpanded);
  };

  const collapseAllGroups = () => {
    setExpandedGroups({});
  };

  const handleUserClick = (userId: string) => {
    setActiveTab('Converted Users Journey');
    // Find the index of the user in the journey list
    const userIndex = convertedUsersJourney.findIndex(u => u.advertiserUserId === userId);
    if (userIndex !== -1) {
      setTimeout(() => {
        setExpandedRow(userIndex);
        // Optional: Scroll to the row
        const row = document.getElementById(`user-row-${userIndex}`);
        row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="flex h-screen bg-[#F2F7FB]">
      <NewSidebar />

      <main className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-[#353B4F] text-2xl font-light">Attribution Breakdown</h1>
              <button className="text-[#7E87A8] hover:text-[#6A7290] transition-colors">
                <HelpCircle size={18} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#7E87A8] text-sm">
                <Clock size={14} />
                <span>Updated 2 mins ago</span>
              </div>
              <button className="flex items-center gap-2 bg-[#B045E6] text-white px-4 py-2 rounded-lg hover:bg-[#9B3DD0] transition-colors text-sm font-medium">
                <Plus size={16} />
                Create Campaign
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  pb-2 text-sm font-medium transition-colors border-b-2
                  ${activeTab === tab.name
                    ? 'text-[#B045E6] border-[#B045E6]'
                    : 'text-[#7E87A8] border-transparent hover:text-[#6A7290]'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 mb-6">
            {/* Filter Box with chips and actions */}
            <div className="flex-1 flex items-center justify-between bg-white rounded-lg border border-[#E5E7EE] px-4 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Applied Filter Chips */}
                {Object.entries(selectedFilters).map(([filterId, values]) => {
                  if (values.length === 0) return null;
                  const filterOption = filterOptions.find(o => o.id === filterId);
                  const label = filterOption?.label || filterId;
                  const displayText = values.length === 1
                    ? `${label} is ${values[0]}`
                    : `${label} is any of ${values.length} ${label.toLowerCase()}s`;
                  return (
                    <div
                      key={filterId}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#F2F7FB] border border-[#E5E7EE] rounded-lg text-sm text-[#353B4F]"
                    >
                      <span>{displayText}</span>
                      <button
                        onClick={() => {
                          setSelectedFilters(prev => {
                            const newFilters = { ...prev };
                            delete newFilters[filterId];
                            return newFilters;
                          });
                        }}
                        className="text-[#6A7290] hover:text-[#353B4F] transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}

                {/* Add Filter Dropdown */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="flex items-center gap-2 text-[#B045E6] text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    <Plus size={16} />
                    Add Filter
                  </button>

                  {/* Filter Dropdown */}
                  {filterDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-lg shadow-[-2px_4px_14px_0px_rgba(106,114,144,0.14)] border border-[#CAD3E5] z-50 overflow-visible">
                      {/* Search */}
                      <div className="p-1">
                        <div className="bg-white border border-[#E5E7EE] rounded px-3 py-2 flex items-center justify-between">
                          <input
                            type="text"
                            placeholder="Search"
                            value={filterSearchQuery}
                            onChange={(e) => setFilterSearchQuery(e.target.value)}
                            className="text-sm text-[#353B4F] placeholder-[#A6B5D3] focus:outline-none flex-1 bg-transparent"
                            autoFocus
                          />
                          <Search size={16} className="text-[#A6B5D3]" />
                        </div>
                      </div>

                      {/* Filter Options */}
                      <div className="py-1">
                        {filterOptions
                          .filter(option => option.label.toLowerCase().includes(filterSearchQuery.toLowerCase()))
                          .map((option) => (
                            <div
                              key={option.id}
                              className="relative"
                              onMouseEnter={() => setHoveredFilter(option.id)}
                            >
                              <div
                                className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${hoveredFilter === option.id ? 'bg-[#F2F7FB]' : 'bg-white hover:bg-[#F9FAFB]'
                                  }`}
                              >
                                <span className="text-sm text-[#474E6A]">{option.label}</span>
                                <ChevronDown size={16} className="text-[#6A7290] -rotate-90" />
                              </div>

                              {/* Submenu with checkboxes */}
                              {hoveredFilter === option.id && (
                                <div
                                  className="absolute top-0 left-full ml-1 w-[220px] bg-white rounded-lg shadow-[-2px_4px_14px_0px_rgba(106,114,144,0.14)] border border-[#CAD3E5] z-50"
                                  onMouseEnter={() => setHoveredFilter(option.id)}
                                >
                                  <div className="py-2 max-h-[240px] overflow-y-auto">
                                    {filterValues[option.id]?.map((value) => {
                                      const isChecked = pendingFilterSelections[option.id]?.includes(value) || false;
                                      return (
                                        <label
                                          key={value}
                                          className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                              setPendingFilterSelections(prev => {
                                                const current = prev[option.id] || [];
                                                if (e.target.checked) {
                                                  return { ...prev, [option.id]: [...current, value] };
                                                } else {
                                                  return { ...prev, [option.id]: current.filter(v => v !== value) };
                                                }
                                              });
                                            }}
                                            className="w-4 h-4 rounded border-[#CAD3E5] text-[#B045E6] focus:ring-[#B045E6] accent-[#B045E6]"
                                          />
                                          <span className="text-sm text-[#474E6A]">{value}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                  {/* Apply Button */}
                                  <div className="p-2 border-t border-[#E5E7EE]">
                                    <button
                                      onClick={() => {
                                        setSelectedFilters(prev => ({
                                          ...prev,
                                          ...pendingFilterSelections
                                        }));
                                        setFilterDropdownOpen(false);
                                        setHoveredFilter(null);
                                        setPendingFilterSelections({});
                                      }}
                                      className="w-full py-1.5 bg-[#B045E6] text-white text-sm font-medium rounded hover:bg-[#9B3DD0] transition-colors"
                                    >
                                      Apply
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right actions: Clear/Save + Saved Filters */}
              <div className="flex items-center gap-3">
                {/* Clear and Save buttons - only show when filters are applied */}
                {Object.keys(selectedFilters).some(key => selectedFilters[key].length > 0) && (
                  <>
                    <button
                      onClick={() => setSelectedFilters({})}
                      className="text-sm text-[#6A7290] hover:text-[#353B4F] transition-colors"
                    >
                      Clear
                    </button>
                    <button className="px-4 py-1 border border-[#B045E6] text-[#B045E6] text-sm font-medium rounded hover:bg-[#F7E8FF] transition-colors">
                      Save
                    </button>
                    <div className="h-4 w-px bg-[#E5E7EE]" />
                  </>
                )}

                {/* Saved Filters Dropdown */}
                <button className="flex items-center gap-2 text-[#6A7290] text-sm hover:text-[#353B4F] transition-colors">
                  <Filter size={14} />
                  Saved
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {/* Last 7 days - in its own separate box */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E7EE] rounded-lg text-sm text-[#6A7290] cursor-pointer hover:border-[#B045E6] transition-colors">
              <span>Last 7 days</span>
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Conversion Events Tab Content */}
          {activeTab === 'Conversion events' && (
            <div className="bg-white rounded-xl shadow-[0_0_12px_0_rgba(98,104,143,0.15)] p-6 overflow-visible">
              {/* Table Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#353B4F] text-base font-semibold">Conversion events</h2>
                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search table"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[320px] px-3 py-1.5 pr-10 bg-[#F2F7FB] border border-[#E5E7EE] rounded-lg text-sm text-[#353B4F] placeholder-[#7E87A8] focus:outline-none focus:border-[#B045E6]"
                    />
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E87A8]" />
                  </div>
                  {/* Actions */}
                  <div className="relative" ref={groupByRef}>
                    <button
                      onClick={() => setGroupByOpen(!groupByOpen)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${selectedGroup || groupByOpen ? 'text-[#B045E6]' : 'text-[#6A7290] hover:text-[#353B4F]'}`}
                    >
                      <Users size={14} />
                      {selectedGroup ? `Group by: ${groupByOptions.find(o => o.id === selectedGroup)?.label}` : 'Group by'}
                      <ChevronDown size={12} className={`transition-transform ${groupByOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Group By Dropdown */}
                    {groupByOpen && (
                      <div className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[#E5E7EE] z-50 overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b border-[#E5E7EE]">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search..."
                              value={groupSearchQuery}
                              onChange={(e) => setGroupSearchQuery(e.target.value)}
                              className="w-full px-3 py-2 pl-3 pr-8 bg-white border border-[#E5E7EE] rounded-lg text-xs text-[#353B4F] placeholder-[#7E87A8] focus:outline-none focus:border-[#B045E6]"
                              autoFocus
                            />
                            <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7E87A8]" />
                          </div>
                        </div>

                        {/* List */}
                        <div className="py-1 max-h-[240px] overflow-y-auto">
                          <div className="px-3 py-1.5 text-xs font-medium text-[#7E87A8] bg-[#F9FAFB] border-b border-[#E5E7EE] mb-1">
                            Group by
                          </div>
                          {filteredGroupOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => handleGroupSelect(option.id)}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-[#F2F7FB] ${selectedGroup === option.id ? 'text-[#B045E6] bg-[#F7E8FF]' : 'text-[#353B4F]'}`}
                            >
                              <span>{option.label}</span>
                              <Info size={14} className="text-[#C8CDD8]" />
                            </button>
                          ))}
                          {filteredGroupOptions.length === 0 && (
                            <div className="px-3 py-4 text-center text-xs text-[#7E87A8]">
                              No results found
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-[#E5E7EE] flex items-center justify-between text-xs bg-white">
                          <div className="flex items-center gap-2 text-[#7E87A8]">
                            <button onClick={collapseAllGroups} className="hover:text-[#353B4F] transition-colors">Collapse All</button>
                            <span>|</span>
                            <button onClick={expandAllGroups} className="hover:text-[#353B4F] transition-colors">Expand All</button>
                          </div>
                          <button
                            onClick={clearGroup}
                            className="text-[#B045E6] font-medium hover:text-[#9B3DD0] transition-colors"
                          >
                            Clear Group
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-1.5 text-[#6A7290] text-xs font-medium hover:text-[#353B4F] transition-colors">
                    <Columns size={14} />
                    Columns
                  </button>
                  <button className="flex items-center gap-1.5 text-[#6A7290] text-xs font-medium hover:text-[#353B4F] transition-colors">
                    <Download size={14} />
                    Export
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto" style={{ overflow: 'visible', overflowX: 'auto' }}>
                <table className="w-full min-w-[1400px]" style={{ overflow: 'visible' }}>
                  <thead style={{ overflow: 'visible' }}>
                    <tr className="border-b border-[#E5E7EE]" style={{ overflow: 'visible' }}>
                      {[
                        { name: 'Event Name', align: 'left', tooltip: 'The type of conversion event (e.g. Registration, FTD, Deposit) that was attributed to a campaign based on the user\'s activity.' },
                        { name: 'Event ID', align: 'left', tooltip: 'The unique identifier of the conversion event.' },
                        { name: 'Addressable User ID', align: 'left', tooltip: 'The unique user identifier generated by Addressable for tracking the user across sessions and devices.' },
                        { name: 'Advertiser User ID', align: 'left', tooltip: 'The user identifier provided by the advertiser after registration or login. Used as the primary source of truth for identity.' },
                        { name: 'Campaign Name', align: 'left', tooltip: 'The campaign that received attribution credit for this conversion event.' },
                        { name: 'Attribution Type', align: 'left', tooltip: 'Indicates whether the event was attributed after an ad view (Post View) or after an ad click (Post Click).' },
                        { name: 'Ad Exposure Source', align: 'left', tooltip: 'The source that received attribution credit for this event under the First Touch attribution model.' },
                        { name: 'Ad Exposure Time', align: 'left', tooltip: 'The timestamp of the user\'s first ad exposure that started the attribution window.' },
                        { name: 'Event Time', align: 'left', tooltip: 'The timestamp when the conversion event actually occurred.' },
                        { name: 'Time to Conversion', align: 'left', tooltip: 'The time elapsed between the first ad exposure and the conversion event.' },
                        { name: 'Attribution Window', align: 'left', tooltip: 'The attribution window applied to this event based on the attribution type (e.g. view-based or click-based window).' },
                        { name: 'Transaction Value', align: 'right', tooltip: 'The revenue amount generated by this conversion event.' },
                      ].map((col, idx) => (
                        <th
                          key={idx}
                          className={`group/header py-3 px-4 text-xs font-medium text-[#6A7290] whitespace-nowrap cursor-pointer hover:text-[#353B4F] transition-colors ${col.align === 'right' ? 'text-right' : 'text-left'} ${idx === 0 ? 'sticky left-0 bg-white z-10' : ''}`}
                          style={{ overflow: 'visible', position: idx === 0 ? 'sticky' : 'relative' }}>
                          <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                            <span>{col.name}</span>
                            {/* Info icon with tooltip - controlled by state */}
                            <div
                              className="relative opacity-0 group-hover/header:opacity-100 transition-opacity"
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipState({
                                  visible: true,
                                  text: col.tooltip,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top
                                });
                              }}
                              onMouseLeave={() => setTooltipState(prev => ({ ...prev, visible: false }))}
                            >
                              <div className="cursor-help">
                                <Info size={14} className="text-[#7E87A8] hover:text-[#6A7290]" />
                              </div>
                            </div>
                            {/* Sort icon - visible on hover */}
                            <ArrowUpDown size={14} className="opacity-0 group-hover/header:opacity-100 transition-opacity text-[#7E87A8]" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {/* Table Body - Conditional Rendering based on Grouping */}
                  <tbody>


                    {selectedGroup && groupedEvents ? (
                      // Grouped View
                      Object.entries(groupedEvents).map(([groupKey, events]) => (
                        <Fragment key={groupKey}>
                          {/* Group Header Row */}
                          <tr
                            key={`group-${groupKey}`}
                            className="bg-[#F9FAFB] hover:bg-[#F2F3F6] cursor-pointer border-b border-[#E5E7EE]"
                            onClick={() => toggleGroup(groupKey)}
                          >
                            <td colSpan={12} className="py-2.5 px-4 sticky left-0 z-10 bg-[#F9FAFB] hover:bg-[#F2F3F6] min-w-[200px]">
                              <div className="flex items-center gap-2">
                                <div className={`transition-transform duration-200 ${expandedGroups[groupKey] ? 'rotate-90' : ''}`}>
                                  <ChevronDown size={14} className="text-[#6A7290]" />
                                </div>
                                <span className="font-semibold text-[#353B4F] text-sm">{groupKey}</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#E5E7EE] text-[#6A7290] text-xs font-medium">
                                  {events.length}
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Group Items */}
                          {expandedGroups[groupKey] && events.map((event, index) => (
                            <tr
                              key={`${groupKey}-event-${index}`}
                              className="border-b border-[#E5E7EE] hover:bg-white transition-colors bg-white/50"
                            >
                              <td className="py-3 px-4 text-sm text-[#353B4F] whitespace-nowrap sticky left-0 bg-white z-10 pl-12">{event.eventName}</td>
                              <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{truncateEventId(event.eventId)}</td>
                              <td className="py-3 px-4 text-sm whitespace-nowrap">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleUserClick(event.advertiserUserId); }}
                                  className="text-[#353B4F] hover:text-[#B045E6] hover:underline transition-colors cursor-pointer"
                                >
                                  {truncateId(event.addressableUserId)}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-sm whitespace-nowrap">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleUserClick(event.advertiserUserId); }}
                                  className="text-[#353B4F] hover:text-[#B045E6] hover:underline transition-colors cursor-pointer"
                                >
                                  {event.advertiserUserId}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-sm text-[#353B4F] whitespace-nowrap">{event.campaignName}</td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span
                                  className={`
                                    inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
                                    ${event.attributionType === 'Post View'
                                      ? 'bg-[#F7E8FF] text-[#B045E6]'
                                      : 'bg-[#E6F0FE] text-[#0091EA]'
                                    }
                                  `}
                                >
                                  {event.attributionType === 'Post View' ? (
                                    <Eye size={12} />
                                  ) : (
                                    <MousePointer2 size={12} />
                                  )}
                                  {event.attributionType}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-[#353B4F] whitespace-nowrap">{event.attributionSource}</td>
                              <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{event.firstTouchTime}</td>
                              <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{event.eventTime}</td>
                              <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{event.timeToConversion}</td>
                              <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{event.attributionWindow}</td>
                              <td className="py-3 px-4 text-sm text-[#353B4F] font-semibold text-right whitespace-nowrap">{event.revenue.toFixed(2)}</td>
                            </tr>
                          ))}
                        </Fragment>
                      ))
                    ) : (
                      // Standard View (No Grouping)
                      filteredConversionEvents.map((event, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#E5E7EE] hover:bg-[#F9FAFB] transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-[#353B4F] whitespace-nowrap sticky left-0 bg-white z-10">{event.eventName}</td>
                          <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{truncateEventId(event.eventId)}</td>
                          <td className="py-3 px-4 text-sm whitespace-nowrap">
                            <button
                              onClick={() => handleUserClick(event.advertiserUserId)}
                              className="text-[#353B4F] hover:text-[#B045E6] hover:underline transition-colors cursor-pointer"
                            >
                              {truncateId(event.addressableUserId)}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-sm whitespace-nowrap">
                            <button
                              onClick={() => handleUserClick(event.advertiserUserId)}
                              className="text-[#353B4F] hover:text-[#B045E6] hover:underline transition-colors cursor-pointer"
                            >
                              {event.advertiserUserId}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-sm text-[#353B4F] whitespace-nowrap">{event.campaignName}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`
                                inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
                                ${event.attributionType === 'Post View'
                                  ? 'bg-[#F7E8FF] text-[#B045E6]'
                                  : 'bg-[#E6F0FE] text-[#0091EA]'
                                }
                              `}
                            >
                              {event.attributionType === 'Post View' ? (
                                <Eye size={12} />
                              ) : (
                                <MousePointer2 size={12} />
                              )}
                              {event.attributionType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-[#353B4F] whitespace-nowrap">{event.attributionSource}</td>
                          <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{event.firstTouchTime}</td>
                          <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{event.eventTime}</td>
                          <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{event.timeToConversion}</td>
                          <td className="py-3 px-4 text-sm text-[#7E87A8] whitespace-nowrap">{event.attributionWindow}</td>
                          <td className="py-3 px-4 text-sm text-[#353B4F] font-semibold text-right whitespace-nowrap">{event.revenue.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#E5E7EE] bg-white">
                      <td className="py-4 px-4 sticky left-0 bg-white z-10">
                        <div className="text-xs text-[#7E87A8] mb-1">Total Events</div>
                        <div className="text-base font-semibold text-[#353B4F]">7</div>
                      </td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4">
                        <div className="text-xs text-[#7E87A8] mb-1">Avg Time to Conversion</div>
                        <div className="text-base font-semibold text-[#353B4F]">3.2 days</div>
                      </td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-xs text-[#7E87A8] mb-1">Total Transaction Value</div>
                        <div className="text-base font-semibold text-[#353B4F]">$5,450.00</div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                {/* Tooltip Portal - Moved here to prevent hydration error */}
                {tooltipState.visible && (
                  <div
                    className="fixed pointer-events-none px-3 py-2.5 bg-white text-[#353B4F] text-xs rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[#E5E7EE] max-w-[280px] z-[99999]"
                    style={{
                      left: tooltipState.x,
                      top: tooltipState.y,
                      transform: 'translate(-50%, -100%)',
                      marginTop: '-8px'
                    }}
                  >
                    <p className="leading-relaxed whitespace-normal break-words m-0">
                      {tooltipState.text}
                    </p>
                    {/* Arrow pointing down */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-[8px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-[9px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#E5E7EE] -z-10"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Converted Users Journey Tab Content */}
          {activeTab === 'Converted Users Journey' && (
            <div className="bg-white rounded-xl shadow-[0_0_12px_0_rgba(98,104,143,0.15)] p-6">
              {/* Table Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#353B4F] text-base font-semibold">Converted Users Journey</h2>
                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search table"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[320px] px-3 py-1.5 pr-10 bg-[#F2F7FB] border border-[#E5E7EE] rounded-lg text-sm text-[#353B4F] placeholder-[#7E87A8] focus:outline-none focus:border-[#B045E6]"
                    />
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E87A8]" />
                  </div>
                  {/* Actions */}
                  <button className="flex items-center gap-1.5 text-[#6A7290] text-xs font-medium hover:text-[#353B4F] transition-colors">
                    <Users size={14} />
                    Group by
                    <ChevronDown size={12} />
                  </button>
                  <button className="flex items-center gap-1.5 text-[#6A7290] text-xs font-medium hover:text-[#353B4F] transition-colors">
                    <Columns size={14} />
                    Columns
                  </button>
                  <button className="flex items-center gap-1.5 text-[#6A7290] text-xs font-medium hover:text-[#353B4F] transition-colors">
                    <Download size={14} />
                    Export
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EE]">
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]">Addressable User ID</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]">Advertiser User ID</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]">Primary Country</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290] min-w-[200px]">Campaigns</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290] min-w-[200px]">Ads</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]">First Attributed Source</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]">Other Attributed Sources</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]">Registration</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]">FTD</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]"># Total Deposits</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6A7290]">Total Deposits Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {convertedUsersJourney.map((user, index) => (
                      <Fragment key={index}>
                        <tr
                          id={`user-row-${index}`}
                          onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                          className={`border-b border-[#E5E7EE] hover:bg-[#F9FAFB] transition-colors cursor-pointer ${expandedRow === index ? 'bg-[#F7E8FF]/30' : ''}`}
                        >
                          {/* Addressable User ID */}
                          <td className="py-3 px-4 text-sm text-[#7E87A8]">{truncateId(user.addressableUserId)}</td>

                          {/* Advertiser User ID */}
                          <td className="py-3 px-4 text-sm text-[#353B4F]">{user.advertiserUserId}</td>

                          {/* Primary Country with Flag */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-[#F2F7FB] text-sm">
                                {user.primaryCountry === 'Spain' && '🇪🇸'}
                                {user.primaryCountry === 'Japan' && '🇯🇵'}
                                {user.primaryCountry === 'USA' && '🇺🇸'}
                                {user.primaryCountry === 'UK' && '🇬🇧'}
                                {user.primaryCountry === 'Germany' && '🇩🇪'}
                              </div>
                              <span className="text-sm text-[#353B4F]">{user.primaryCountry}</span>
                            </div>
                          </td>

                          {/* Campaigns - Chips with overflow */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 items-center">
                              {user.campaigns.slice(0, 2).map((campaign: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#E5E7EE] text-[#6A7290]"
                                >
                                  {campaign}
                                </span>
                              ))}
                              {user.campaigns.length > 2 && (
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#E5E7EE] text-[#6A7290]">
                                  +{user.campaigns.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Ads - Chips with overflow */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 items-center">
                              {user.ads.slice(0, 2).map((ad: string, adIdx: number) => (
                                <span
                                  key={adIdx}
                                  className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#F7E8FF] text-[#B045E6]"
                                >
                                  {ad}
                                </span>
                              ))}
                              {user.ads.length > 2 && (
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#F7E8FF] text-[#B045E6]">
                                  +{user.ads.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* First Attributed Source */}
                          <td className="py-3 px-4 text-sm text-[#353B4F]">{user.firstAttributedSource}</td>

                          {/* Other Attributed Sources - Chips */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 items-center">
                              {user.otherAttributedSources.slice(0, 2).map((source: { name: string }, srcIdx: number) => (
                                <span
                                  key={srcIdx}
                                  className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#E5E7EE] text-[#6A7290]"
                                >
                                  {source.name}
                                </span>
                              ))}
                              {user.otherAttributedSources.length > 2 && (
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#E5E7EE] text-[#6A7290]">
                                  +{user.otherAttributedSources.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Registration - 1/0 */}
                          <td className="py-3 px-4">
                            <span className={`text-sm font-medium ${user.registration ? 'text-[#4CAF50]' : 'text-[#7E87A8]'}`}>
                              {user.registration ? '1' : '0'}
                            </span>
                          </td>

                          {/* FTD - 1/0 */}
                          <td className="py-3 px-4">
                            <span className={`text-sm font-medium ${user.ftd ? 'text-[#4CAF50]' : 'text-[#7E87A8]'}`}>
                              {user.ftd ? '1' : '0'}
                            </span>
                          </td>

                          {/* # Total Deposits */}
                          <td className="py-3 px-4 text-sm text-[#353B4F] font-medium">{user.depositCount}</td>

                          {/* Total Deposits Value */}
                          <td className="py-3 px-4 text-sm text-[#353B4F]">
                            {user.totalDepositsValue > 0 ? `$${user.totalDepositsValue.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                        {/* Expanded Timeline Row */}
                        {expandedRow === index && (
                          <tr key={`timeline-${index}`}>
                            <td colSpan={11} className="p-0">
                              <div className="relative border-t border-b border-[#E5E7EE] bg-white">
                                {/* Timeline Header */}
                                <div className="px-6 py-4 border-b border-[#E5E7EE] bg-white/80 backdrop-blur-sm flex items-center justify-between">
                                  <div>
                                    <h3 className="text-[#353B4F] font-semibold text-lg">User Journey Timeline</h3>
                                    <p className="text-[#6A7290] text-sm mt-0.5">
                                      {user.advertiserUserId} • {user.campaigns.join(', ')}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3 text-[#6A7290] text-xs">
                                    <span className="flex items-center gap-1">🖱️ Scroll to zoom</span>
                                    <span className="text-[#E5E7EE]">|</span>
                                    <span className="flex items-center gap-1">✋ Drag to pan</span>
                                    <span className="text-[#E5E7EE]">|</span>
                                    <span className="font-semibold text-[#B045E6] bg-[#F7E8FF] px-2 py-1 rounded">{Math.round(zoomLevel * 100)}%</span>
                                  </div>
                                </div>

                                {/* Timeline Content - Isolated Canvas with Drag & Zoom */}
                                <div
                                  id={`timeline-canvas-${index}`}
                                  className="relative h-[550px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
                                  style={{
                                    backgroundColor: '#FAFBFC',
                                    backgroundImage: `radial-gradient(circle, #D1D5DB 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px',
                                  }}
                                  onWheel={(e) => {
                                    e.stopPropagation();
                                    const delta = e.deltaY > 0 ? -0.1 : 0.1;
                                    setZoomLevel(Math.min(2, Math.max(0.5, zoomLevel + delta)));
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const canvas = e.currentTarget;
                                    const content = canvas.querySelector('.timeline-content') as HTMLElement;
                                    if (!content) return;

                                    canvas.style.cursor = 'grabbing';
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const initialX = parseFloat(content.dataset.translateX || '0');
                                    const initialY = parseFloat(content.dataset.translateY || '0');

                                    const handleMouseMove = (moveEvent: MouseEvent) => {
                                      const dx = moveEvent.clientX - startX;
                                      const dy = moveEvent.clientY - startY;
                                      const newX = initialX + dx;
                                      const newY = initialY + dy;
                                      content.style.transform = `translate(${newX}px, ${newY}px) scale(${zoomLevel})`;
                                      content.dataset.translateX = String(newX);
                                      content.dataset.translateY = String(newY);
                                    };

                                    const handleMouseUp = () => {
                                      canvas.style.cursor = 'grab';
                                      document.removeEventListener('mousemove', handleMouseMove);
                                      document.removeEventListener('mouseup', handleMouseUp);
                                    };

                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                  }}
                                >
                                  <div
                                    className="timeline-content absolute px-16 pt-12"
                                    data-translate-x="0"
                                    data-translate-y="0"
                                    style={{
                                      transform: `translate(0px, 0px) scale(${zoomLevel})`,
                                      transformOrigin: 'left top',
                                      minWidth: 'max-content'
                                    }}
                                  >
                                    {/* Main Timeline Container - Fixed heights for alignment */}
                                    <div className="relative">
                                      {/* Cards Row - All cards align at BOTTOM (items-end) */}
                                      <div className="flex items-end" style={{ minHeight: '220px' }}>
                                        {user.timelineEvents.map((event, eventIndex) => {
                                          const config = getEventConfig(event.type);
                                          const platformIcon = event.source ? getPlatformIcon(event.source) : null;

                                          return (
                                            <div key={`card-${eventIndex}`} className="w-[220px] flex justify-center">
                                              {/* Content Card */}
                                              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#E5E7EE] w-[200px] hover:shadow-lg transition-shadow overflow-hidden">
                                                {/* Header with colored icon */}
                                                <div className="flex items-center gap-2 p-3 border-b border-[#E5E7EE]">

                                                  <div className="font-semibold text-[#353B4F] text-sm leading-tight">{config.label}</div>
                                                </div>

                                                <div className="p-3">
                                                  {/* Device row */}
                                                  <div className="flex items-center gap-2 text-[#6A7290] text-xs mb-2">
                                                    <div
                                                      className="w-4 h-4 flex-shrink-0"
                                                      dangerouslySetInnerHTML={{ __html: getDeviceIcon(event.device) }}
                                                    />
                                                    <span>{event.device}</span>
                                                  </div>

                                                  {/* Platform/Source */}
                                                  {event.source && platformIcon && (
                                                    <div className="flex items-center gap-2 mb-2">
                                                      <div
                                                        className="w-4 h-4 flex-shrink-0"
                                                        dangerouslySetInnerHTML={{ __html: platformIcon.svg }}
                                                      />
                                                      <span className="text-xs font-medium" style={{ color: platformIcon.color }}>
                                                        {event.source}
                                                      </span>
                                                    </div>
                                                  )}

                                                  {/* Ad Display with Carousel for multiple ads */}
                                                  {event.ads && event.ads.length > 0 && (
                                                    <div className="mt-2 border border-[#E5E7EE] rounded-lg overflow-hidden">
                                                      {/* Ad placeholder image area */}
                                                      <div className="bg-gradient-to-br from-[#F2F7FB] to-[#E5E7EE] h-[50px] flex items-center justify-center relative">
                                                        <svg className="w-6 h-6 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                                          <circle cx="8" cy="10" r="2" />
                                                          <path d="M21 15l-5-5L5 21" />
                                                        </svg>
                                                        {/* Counter badge for multiple ads */}
                                                        {event.ads.length > 1 && (
                                                          <div className="absolute top-1 right-1 bg-[#3B82F6] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                                                            {event.ads.length} ads
                                                          </div>
                                                        )}
                                                      </div>
                                                      {/* Ad name and navigation */}
                                                      <div className="p-2 bg-white">
                                                        {event.ads.length === 1 ? (
                                                          <>
                                                            <div className="text-[#353B4F] text-xs font-medium truncate" title={event.ads[0].name}>{event.ads[0].name}</div>
                                                            <div className="text-[#3B82F6] text-xs mt-1 flex items-center gap-1 cursor-pointer hover:underline">
                                                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                                <polyline points="15 3 21 3 21 9" />
                                                                <line x1="10" y1="14" x2="21" y2="3" />
                                                              </svg>
                                                              View Ad
                                                            </div>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <div className="text-[#353B4F] text-xs font-medium truncate" title={event.ads[0].name}>{event.ads[0].name}</div>
                                                            <div className="flex items-center justify-between mt-1.5">
                                                              <div className="text-[#3B82F6] text-xs flex items-center gap-1 cursor-pointer hover:underline">
                                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                                  <polyline points="15 3 21 3 21 9" />
                                                                  <line x1="10" y1="14" x2="21" y2="3" />
                                                                </svg>
                                                                View all
                                                              </div>
                                                              {/* Navigation arrows */}
                                                              <div className="flex items-center gap-1">
                                                                <button className="w-5 h-5 rounded bg-[#F2F7FB] flex items-center justify-center hover:bg-[#E5E7EE] transition-colors">
                                                                  <svg className="w-3 h-3 text-[#6A7290]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <polyline points="15 18 9 12 15 6" />
                                                                  </svg>
                                                                </button>
                                                                <span className="text-[10px] text-[#6A7290]">1/{event.ads.length}</span>
                                                                <button className="w-5 h-5 rounded bg-[#F2F7FB] flex items-center justify-center hover:bg-[#E5E7EE] transition-colors">
                                                                  <svg className="w-3 h-3 text-[#6A7290]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <polyline points="9 18 15 12 9 6" />
                                                                  </svg>
                                                                </button>
                                                              </div>
                                                            </div>
                                                          </>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Page */}
                                                  {(event as any).page && (
                                                    <div className="flex items-center gap-2 text-[#6A7290] text-xs">
                                                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                      </svg>
                                                      <span>{(event as any).page}</span>
                                                    </div>
                                                  )}

                                                  {/* Amount for FTD */}
                                                  {event.amount && (
                                                    <div className="text-[#10B981] font-bold text-lg mt-1">{event.amount}</div>
                                                  )}

                                                  {/* Deposits Summary */}
                                                  {event.type === 'deposits_summary' && (
                                                    <div className="space-y-1">
                                                      <div className="text-[#6A7290] text-xs">{(event as any).depositCount} deposits</div>
                                                      <div className="text-[#10B981] font-bold text-lg">{(event as any).totalAmount}</div>
                                                    </div>
                                                  )}

                                                  {/* Single Deposit */}
                                                  {event.type === 'deposit' && (
                                                    <div className="text-[#10B981] font-bold text-lg mt-1">{(event as any).amount}</div>
                                                  )}


                                                  {/* Total Deposits */}
                                                  {event.type === 'total_deposits' && (
                                                    <div className="space-y-1">
                                                      <div className="text-[#6A7290] text-xs">{(event as any).depositCount} deposits</div>
                                                      <div className="text-[#F59E0B] font-bold text-lg">{(event as any).totalAmount}</div>
                                                    </div>
                                                  )}

                                                  {/* Last Seen */}
                                                  {event.type === 'last_seen' && (
                                                    <div className="flex items-center gap-2 text-[#6A7290] text-xs">
                                                      <span dangerouslySetInnerHTML={{ __html: getDeviceIcon(event.device) }} />
                                                      <span>{event.device}</span>
                                                    </div>
                                                  )}

                                                  {/* Action */}
                                                  {(event as any).action && (
                                                    <div className="flex items-center gap-2 text-[#6A7290] text-xs">
                                                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                                      </svg>
                                                      <span>{(event as any).action}</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>

                                      {/* Vertical Lines Row - All same height, all aligned */}
                                      <div className="flex">
                                        {user.timelineEvents.map((_, eventIndex) => (
                                          <div key={`line-${eventIndex}`} className="w-[220px] flex justify-center">
                                            <div className="w-[2px] h-[30px] bg-[#9CA3AF]" />
                                          </div>
                                        ))}
                                      </div>

                                      {/* Dots Row + Horizontal Line - All dots on same horizontal line */}
                                      <div className="relative h-[40px]">
                                        {/* Horizontal connecting line */}
                                        <div
                                          className="absolute top-1/2 -translate-y-1/2 left-[110px] h-[3px] bg-[#9CA3AF] rounded-full"
                                          style={{ width: `${(user.timelineEvents.length - 1) * 220}px` }}
                                        />
                                        {/* Dots container */}
                                        <div className="flex relative z-10 h-full items-center">
                                          {user.timelineEvents.map((event, eventIndex) => {
                                            const config = getEventConfig(event.type);
                                            return (
                                              <div key={`dot-${eventIndex}`} className="w-[220px] flex justify-center">
                                                <div
                                                  className="w-10 h-10 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center"
                                                  style={{ backgroundColor: config.color }}
                                                >
                                                  <div
                                                    className="w-5 h-5 text-white"
                                                    dangerouslySetInnerHTML={{ __html: config.svg }}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Dates Row - All dates aligned, DARKER color */}
                                      <div className="flex mt-3">
                                        {user.timelineEvents.map((event, eventIndex) => (
                                          <div key={`date-${eventIndex}`} className="w-[220px] text-center">
                                            <div className="font-semibold text-[#4B5563] text-sm">
                                              {event.type === 'deposits_summary'
                                                ? ((event as any).dateRange?.replace(' → ', ' - ').split(' - ').map((d: string) => d.split('-').slice(1).join('/')).join(' → ') || '')
                                                : (event.date?.split(' ')[0].split('-').slice(1).join('/') || '')
                                              }
                                            </div>
                                            <div className="text-[#6B7280] text-xs">
                                              {event.type === 'deposits_summary'
                                                ? ''
                                                : (event.date?.split(' ')[1] || '')
                                              }
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Users */}
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-[#353B4F]">{convertedUsersJourney.length}</div>
                <div className="text-xs text-[#7E87A8]">Total Users</div>
              </div>
            </div>
          )}

          {/* Overview Tab Content */}
          {activeTab === 'Overview' && (
            <div className="bg-white rounded-xl shadow-[0_0_12px_0_rgba(98,104,143,0.15)] p-6">
              <div className="text-center py-12">
                <h2 className="text-[#353B4F] text-lg font-semibold mb-2">Overview</h2>
                <p className="text-[#7E87A8] text-sm">Campaign overview and analytics coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
