'use client';

import React, { ElementType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

import Loading from '@/components/loading/loading';

function withPermission(WrappedComponent: ElementType) {
  const PermissionComponent = (props: any) => {
    const { isLoaded, userId } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoaded && !userId) {
        router.replace('/login');
      }
    }, [isLoaded, userId, router]);

    if (!isLoaded) {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };

  return PermissionComponent;
}

export default withPermission;
