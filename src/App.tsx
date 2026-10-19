/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PayloadCMSProvider } from './hooks/usePayloadCMS';
import { Storefront } from './components/store/Storefront';
import { AdminLayout } from './components/admin/AdminLayout';
import { Settings, ShoppingBag, ExternalLink } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');

  return (
    <PayloadCMSProvider>
      <div className="relative min-h-screen bg-[#FDFBF7]">
        {/* Floating Mode Switcher Bar */}
        <div className="fixed bottom-6 left-6 z-50 bg-stone-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs font-medium border border-stone-700">
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Payload CMS Studio
          </span>
          <div className="h-4 w-[1px] bg-stone-700"></div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('store')}
              className={`px-3 py-1 rounded-full transition-colors ${viewMode === 'store' ? 'bg-[#B45309] text-white font-semibold' : 'text-stone-300 hover:text-white'}`}
            >
              Storefront
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1 rounded-full transition-colors ${viewMode === 'admin' ? 'bg-[#B45309] text-white font-semibold' : 'text-stone-300 hover:text-white'}`}
            >
              Admin Panel
            </button>
          </div>
        </div>

        {viewMode === 'store' ? (
          <Storefront onSwitchToAdmin={() => setViewMode('admin')} />
        ) : (
          <AdminLayout onSwitchToStore={() => setViewMode('store')} />
        )}
      </div>
    </PayloadCMSProvider>
  );
}
