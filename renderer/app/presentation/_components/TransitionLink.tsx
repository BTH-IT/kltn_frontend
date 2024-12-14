'use client';

import { useRouter } from 'next/navigation';

import { animatePageOut } from './animations';

export default function TransitionLink({ children, ...props }: any) {
  const router = useRouter();

  const handleClick = () => {
    animatePageOut(props.href, router);
  };

  return <span onClick={handleClick}>{children}</span>;
}
