'use client';
import { ArrowLeftFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButtonV2({ url }: { url: string }) {
  const router = useRouter();

  return (
    <ArrowLeftFromLine
      className="w-8 h-8 text-white cursor-pointer"
      onClick={() => {
        router.push(url);
      }}
    />
  );
}
