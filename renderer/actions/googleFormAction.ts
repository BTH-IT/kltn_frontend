'use server';

import axios from 'axios';
import { redirect } from 'next/navigation';
import { getAuth } from '@clerk/nextjs/server';
import { RequestLike } from '@clerk/nextjs/dist/types/server/types';

const BASE_URL = 'https://forms.googleapis.com/v1/forms';

async function createForm(params: any, token: string) {
  const response = await axios.post(`${BASE_URL}`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('response', response.data);

  if (response.status === 401) {
    console.error('Unauthorized access');
    redirect('/login');
  }

  if (!response.data) {
    throw new Error('Network response was not ok');
  }

  return response.data;
}

async function updateForm(formId: string, token: string, params: any) {
  console.log(`${BASE_URL}/${formId}:batchUpdate`);

  const response = await axios.post(`${BASE_URL}/${formId}:batchUpdate`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('response', response.data);

  if (response.status === 401) {
    console.error('Unauthorized access');
    redirect('/login');
  }

  if (!response.data) {
    throw new Error('Network response was not ok');
  }

  return response.data;
}

export async function createBlankForm(req: RequestLike, title: string) {
  const { userId } = getAuth(req);

  if (!userId) {
    redirect('/login');
  }

  const data = await fetch(`https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_google`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  const res = await data.json();

  const token = res[0].token;

  const form = {
    info: { title },
  };

  return createForm(form, token);
}

export async function updateFormWithId(req: RequestLike, formId: string, isQuiz: boolean) {
  const { userId } = getAuth(req);

  if (!userId) {
    redirect('/login');
  }

  const clerkData = await fetch(`https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_google`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  const res = await clerkData.json();

  const token = res[0].token;

  const data = {
    includeFormInResponse: true,
    requests: [
      {
        updateSettings: {
          settings: {
            quizSettings: {
              isQuiz: isQuiz,
            },
          },
          updateMask: '*',
        },
      },
    ],
  };

  return updateForm(formId, token, data);
}
