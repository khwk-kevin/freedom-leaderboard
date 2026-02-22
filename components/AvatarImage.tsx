'use client';
import { useState } from 'react';

export default function AvatarImage({ fdvId, name, size = 32 }: { fdvId: number; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const src = failed
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&size=${size}`
    : `https://gateway.freedom.world/api/freedom-wallet/profile/image/${fdvId}`;

  return (
    <img
      src={src}
      alt={name}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}
