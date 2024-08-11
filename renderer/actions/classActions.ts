import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getClassData(classId: string) {
  'use server';
  const sessionCookie = cookies().get('__session');
  if (!sessionCookie) {
    redirect('/login');
  }

  const token = sessionCookie?.value;

  const res = await fetch(`${process.env.URL}/api/classes/${classId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    console.error('Unauthorized access');
    redirect('/login');
  }

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();
  return data;
}
