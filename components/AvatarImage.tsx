'use client';
import { useState } from 'react';

export default function AvatarImage({ fdvId, name, size = 32, className = '' }: { fdvId: number; name: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = failed
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&size=${size}`
    : `/api/avatar/${fdvId}`;

  return (
    <img
      src={src}
      alt={name}
      className={`object-cover ${className}`}
      style={{ width: size, height: size }}
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}
