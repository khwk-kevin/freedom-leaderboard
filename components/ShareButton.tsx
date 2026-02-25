'use client';
import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
      style={{
        background: 'transparent',
        border: '1.5px solid #2A2A2A',
        color: '#FFFFFF',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00FF88')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2A2A2A')}
    >
      {copied ? '✅ Copied!' : '🔗 Share'}
    </button>
  );
}
