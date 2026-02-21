'use client';
import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors flex items-center gap-2"
    >
      {copied ? '✅ Copied!' : '🔗 Share'}
    </button>
  );
}
