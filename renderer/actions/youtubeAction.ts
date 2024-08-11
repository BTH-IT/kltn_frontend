'use server';

import axios from 'axios';
import { redirect } from 'next/navigation';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

async function fetchFromYoutube(endpoint: string, params: any) {
  const response = await axios.get(`${BASE_URL}/${endpoint}`, {
    params: { ...params, key: API_KEY },
  });

  if (response.status === 401) {
    console.error('Unauthorized access');
    redirect('/login');
  }

  if (!response.data) {
    throw new Error('Network response was not ok');
  }

  return response.data;
}

export async function getYoutubeDatabySearch(query: string, pageToken?: string) {
  const searchParams = {
    part: 'snippet',
    maxResults: 48,
    order: 'relevance',
    q: query,
    type: 'video',
    eventType: 'completed',
    pageToken,
  };

  const searchRes = await fetchFromYoutube('search', searchParams);

  const channelIds = searchRes.items.map((item: any) => item.snippet.channelId);
  const channelRes = await fetchFromYoutube('channels', {
    part: 'snippet',
    id: channelIds.join(','),
  });

  const channelAvatars = channelRes.items.reduce((acc: any, item: any) => {
    acc[item.id] = item.snippet.thumbnails.default.url;
    return acc;
  }, {});

  const videoIds = searchRes.items.map((item: any) => item.id.videoId);
  const videoRes = await fetchFromYoutube('videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoIds.join(','),
  });

  const videoDetails = videoRes.items.reduce((acc: any, item: any) => {
    acc[item.id] = {
      viewCount: item.statistics.viewCount,
      duration: item.contentDetails.duration,
      desc: item.snippet.description,
    };
    return acc;
  }, {});

  const data = searchRes.items.map((item: any) => {
    return {
      nextPageToken: searchRes.nextPageToken,
      videoId: item.id.videoId,
      channelAvatar: channelAvatars[item.snippet.channelId],
      channelTitle: item.snippet.channelTitle,
      title: item.snippet.title,
      desc: videoDetails[item.id.videoId]?.desc,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.medium.url,
      viewCount: videoDetails[item.id.videoId]?.viewCount,
      duration: videoDetails[item.id.videoId]?.duration,
    };
  });

  return data;
}

export async function getYoutubeDataById(videoId: string) {
  const videoParams = {
    part: 'snippet,contentDetails,statistics',
    id: videoId,
  };

  const videoRes = await fetchFromYoutube('videos', videoParams);

  const video = videoRes.items[0];

  const channelId = video.snippet.channelId;
  const channelRes = await fetchFromYoutube('channels', {
    part: 'snippet',
    id: channelId,
  });

  const channel = channelRes.items[0];

  const data = {
    videoId: video.id,
    channelAvatar: channel.snippet.thumbnails.default.url,
    channelTitle: channel.snippet.title,
    title: video.snippet.title,
    desc: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
    thumbnail: video.snippet.thumbnails.medium.url,
    viewCount: video.statistics.viewCount,
    duration: video.contentDetails.duration,
  };

  return data;
}
