'use client';

import React, { ElementType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Loading from '@/components/loading/loading';
import { KEY_LOCALSTORAGE } from '@/utils';

function withPermission(WrappedComponent: ElementType) {
  const PermissionComponent = (props: any) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      const cookies: { [key: string]: string } = document.cookie.split('; ').reduce(
        (prev, current) => {
          const [name, ...value] = current.split('=');
          prev[name as string] = value.join('=');
          return prev;
        },
        {} as { [key: string]: string },
      );

      const token = cookies[KEY_LOCALSTORAGE.ACCESS_TOKEN];
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
