'use client';

import React, { ElementType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Loading from '@/components/loading/loading';

function withPermission(WrappedComponent: ElementType) {
  const PermissionComponent = (props: any) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('access_token');
      setMounted(true);
      if (!token) {
        router.replace('/login');
      } else {
        router.replace('/');
      }
    }, []);

    if (!mounted) {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };

  return PermissionComponent;
}

export default withPermission;
