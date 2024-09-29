/* eslint-disable no-case-declarations */
import moment from 'moment';

import 'moment-duration-format';

export function generateInviteCode(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const getFileType = (mimeType: string): string => {
  switch (mimeType) {
    case 'application/vnd.google-apps.document':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'Word';
    case 'application/vnd.google-apps.spreadsheet':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'Google trang tính';
    case 'application/vnd.google-apps.presentation':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'Thuyết trình';
    case 'application/pdf':
      return 'PDF';
    case 'image/jpeg':
    case 'image/png':
    case 'image/svg+xml':
      return 'Image';
    case 'video/mp4':
    case 'video/quicktime':
      return 'Video';
    case 'text/csv':
      return 'CSV';
    default:
      return 'Tệp không xác định';
  }
};

export function isValidYoutubeUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?(www\.)?youtube\.com\/watch.+$/;
  return pattern.test(url);
}

export function formatViewCount(viewCount: number): string {
  if (viewCount >= 1e9) {
    return (viewCount / 1e9).toFixed(1) + ' Tỷ';
  } else if (viewCount >= 1e6) {
    return (viewCount / 1e6).toFixed(1) + ' Tr';
  } else if (viewCount >= 1000) {
    return (viewCount / 1000).toFixed(1) + ' N';
  } else {
    return viewCount.toString();
  }
}

export function formatDuration(duration: string): string {
  const durationObj = moment.duration(duration);
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();
  const seconds = durationObj.seconds();

  // Pad the minutes and seconds with leading zeros, if required
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Output as "hh:mm:ss"
  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

export function formatVNDate(date: string, useTime = true): string {
  return useTime ? moment(date).format('DD/MM/YYYY HH:mm') : moment(date).format('DD/MM/YYYY');
}

/**
 * regular expression to check for valid hour format (01-23)
 */
export function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
export function isValid12Hour(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
export function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

export function getValidNumber(value: string, { max, min = 0, loop = false }: GetValidNumberConfig) {
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, '0');
  }

  return '00';
}

export function getValidHour(value: string) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

export function getValid12Hour(value: string) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}

export function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

type GetValidArrowNumberConfig = {
  min: number;
  max: number;
  step: number;
};

export function getValidArrowNumber(value: string, { min, max, step }: GetValidArrowNumberConfig) {
  let numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return '00';
}

export function getValidArrowHour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 23, step });
}

export function getValidArrow12Hour(value: string, step: number) {
  return getValidArrowNumber(value, { min: 1, max: 12, step });
}

export function getValidArrowMinuteOrSecond(value: string, step: number) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}

export function setMinutes(date: Date, value: string) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

export function setSeconds(date: Date, value: string) {
  const seconds = getValidMinuteOrSecond(value);
  date.setSeconds(parseInt(seconds, 10));
  return date;
}

export function setHours(date: Date, value: string) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}

export function set12Hours(date: Date, value: string, period: Period) {
  const hours = parseInt(getValid12Hour(value), 10);
  const convertedHours = convert12HourTo24Hour(hours, period);
  date.setHours(convertedHours);
  return date;
}

export type TimePickerType = 'minutes' | 'seconds' | 'hours' | '12hours';
export type Period = 'AM' | 'PM';

export function setDateByType(date: Date, value: string, type: TimePickerType, period?: Period) {
  switch (type) {
    case 'minutes':
      return setMinutes(date, value);
    case 'seconds':
      return setSeconds(date, value);
    case 'hours':
      return setHours(date, value);
    case '12hours': {
      if (!period) return date;
      return set12Hours(date, value, period);
    }
    default:
      return date;
  }
}

export function getDateByType(date: Date, type: TimePickerType) {
  switch (type) {
    case 'minutes':
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case 'seconds':
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case 'hours':
      return getValidHour(String(date.getHours()));
    case '12hours':
      const hours = display12HourValue(date.getHours());
      return getValid12Hour(String(hours));
    default:
      return '00';
  }
}

export function getArrowByType(value: string, step: number, type: TimePickerType) {
  switch (type) {
    case 'minutes':
      return getValidArrowMinuteOrSecond(value, step);
    case 'seconds':
      return getValidArrowMinuteOrSecond(value, step);
    case 'hours':
      return getValidArrowHour(value, step);
    case '12hours':
      return getValidArrow12Hour(value, step);
    default:
      return '00';
  }
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
export function convert12HourTo24Hour(hour: number, period: Period) {
  if (period === 'PM') {
    if (hour <= 11) {
      return hour + 12;
    } else {
      return hour;
    }
  } else if (period === 'AM') {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
export function display12HourValue(hours: number) {
  if (hours === 0 || hours === 12) return '12';
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}

export const getLeafColumns = (node: any) => {
  if (!node.children || node.children.length === 0) {
    return [node];
  }
  return node.children.flatMap(getLeafColumns);
};

export const BE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const KEY_LOCALSTORAGE = {
  ACCESS_TOKEN: 'access_token',
  CURRENT_ACCOUNT: 'current_account',
  CURRENT_USER: 'current_user',
  REFRESH_TOKEN: 'refresh_token',
};

export const CLEAR_LOCALSTORAGE = () => {
  localStorage.removeItem(KEY_LOCALSTORAGE.ACCESS_TOKEN);
  localStorage.removeItem(KEY_LOCALSTORAGE.REFRESH_TOKEN);
  localStorage.removeItem(KEY_LOCALSTORAGE.CURRENT_USER);
};

export const SET_LOCALSTORAGE = (data: any) => {
  if (data.token) {
    localStorage.setItem(KEY_LOCALSTORAGE.ACCESS_TOKEN, data.token);
  }

  if (data.user) {
    localStorage.setItem(KEY_LOCALSTORAGE.CURRENT_USER, JSON.stringify(data.user));
  }

  if (data.refreshToken) {
    localStorage.setItem(KEY_LOCALSTORAGE.REFRESH_TOKEN, data.refreshToken);
  }
};
