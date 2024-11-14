'use client';

import React, { ElementType, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

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

      if (!token) {
        const handleLoginWithGg = async () => {
          const token = searchParams.get('token');
          const refreshToken = searchParams.get('refreshToken');
          const user = searchParams.get('user');

          if (token && refreshToken && user) {
            try {
              SET_LOCALSTORAGE({
                token,
                refreshToken,
                user: convertKeysToCamelCase(JSON.parse(user)),
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
                }),
              });

              toast.success('Đăng nhập thành công!!');

              router.replace('/');
            } catch (error) {
              router.replace('/login');
              toast.error('Đăng nhập không thành công');
            } finally {
              setMounted(true);
            }
          } else {
            router.replace('/login');
            setMounted(true);
          }
        };

        handleLoginWithGg();
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
