
import React from 'react';
import {
    WalletMetamask,
    WalletCoinbase,
    WalletWalletConnect,
    WalletLedger,
    WalletPhantom,
    WalletTrust
} from '@web3icons/react';

type WalletProvider = 'MetaMask' | 'Coinbase Wallet' | 'WalletConnect' | 'Ledger' | 'Phantom' | 'Trust Wallet';

const icons: Record<string, React.ReactNode> = {
    metamask: <WalletMetamask className="w-full h-full" variant="branded" />,
    'coinbase wallet': <WalletCoinbase className="w-full h-full" variant="branded" />,
    walletconnect: <WalletWalletConnect className="w-full h-full" variant="branded" />,
    ledger: <WalletLedger className="w-full h-full" variant="branded" />,
    phantom: <WalletPhantom className="w-full h-full" variant="branded" />,
    trustwallet: <WalletTrust className="w-full h-full" variant="branded" />
};

interface WalletIconProps {
    provider: string;
    className?: string;
}

export function WalletIcon({ provider, className = "w-6 h-6" }: WalletIconProps) {
    const key = provider.toLowerCase().replace(/\s+/g, '');
    let icon = icons[key];

    // Fallback logic for variations
    if (!icon) {
        if (key.includes('trust')) icon = icons['trustwallet'];
        else if (key.includes('coinbase')) icon = icons['coinbase wallet'];
    }

    if (!icon) {
        return null;
    }

    return (
        <div className={className} title={provider}>
            {icon}
        </div>
    );
}

