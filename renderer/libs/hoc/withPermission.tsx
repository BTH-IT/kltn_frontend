import React, { ElementType, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Loading from '@/components/loading/loading';
import { KEY_LOCALSTORAGE, SET_LOCALSTORAGE } from '@/utils';

import { convertKeysToCamelCase } from '../utils';

function withPermission(WrappedComponent: ElementType) {
  const PermissionComponent = (props: any) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();

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

      if (!token && !mounted) {
        const handleLoginWithGg = async () => {
          const token = searchParams.get('token');
          const refreshToken = searchParams.get('refreshToken');
          const user = searchParams.get('user');
          const role = searchParams.get('role');

          if (token && refreshToken && user && role) {
            try {
              SET_LOCALSTORAGE({
                token,
                refreshToken,
                user: convertKeysToCamelCase(JSON.parse(user)),
                role: role,
              });

              await fetch('/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  token,
                  refreshToken,
                  user: convertKeysToCamelCase(JSON.parse(user)),
                  role,
                }),
              });

              router.replace('/');
            } catch (error) {
              router.replace('/login');
            } finally {
              setMounted(true);
            }
          } else {
            router.replace('/login');
            setMounted(true);
          }
        };

        handleLoginWithGg();
      } else if (token) {
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
