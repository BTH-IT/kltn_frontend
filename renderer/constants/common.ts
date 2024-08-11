import { BookOpen, FolderOpen, LayoutDashboard, Settings, UsersRound, Calendar } from 'lucide-react';
import React from 'react';

export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const TIME_FORMAT = {
  SHORT_TIME: 'HH:mm',
  LONG_TIME: 'HH:mm:ss',
  LONG_DATE: 'DD/MM/YYYY',
  YEAR_DATE_HOUR: 'YYYY-MM-DD HH:mm',
  DATE_MONTH_YEAR_HOUR: 'DD/MM/YYYY HH:mm',
  YEAR_MONTH: 'YYYY/MM',
  YEAR_MONTH_DAY: 'YYYY/MM/DD',
  DAYS: 'dddd',
  MONTH_YEAR: 'MM/YYYY',
  YEAR_MONTH_DATE: 'YYYY-MM-DD',
};

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Nữ' },
  { value: 'male', label: 'Nam' },
  { value: 'other', label: 'Khác' },
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const SUCCESS_STATUS_CODE = 200;

export const navigationItemList: { [key: string]: string } = {
  '': 'Màn hình chính',
  calendar: 'Lịch',
  'not-reviewed': 'Cần xem xét',
  todo: 'Việc cần làm',
  archived: 'Lớp học đã lưu trữ',
  settings: 'Cài đặt',
};

export const USER_SETTINGS = [
  {
    name: 'isNoticeEmail',
    title: 'Cho phép thông báo qua email',
  },
  {
    name: 'isCommentOnPost',
    title: 'Các nhận xét về bài đăng của bạn',
  },
  {
    name: 'isNoticeMention',
    title: 'Các nhận xét đề cập đến bạn',
  },
  {
    name: 'isPrivateComment',
    title: 'Nhận xét riêng tư về bài tập',
  },
  {
    name: 'isNoticeAssignment',
    title: 'Bài tập và các bài đăng khác của giáo viên',
  },
  {
    name: 'isReturnedAssignment',
    title: 'Giáo viên của bạn đã trả lại bài và điểm',
  },
  {
    name: 'iscClassInvite',
    title: 'Lời mời tham gia lớp học với tư cách là học viên',
  },
  {
    name: 'isReminder',
    title: 'Nhắc nhở ngày đến hạn dành cho bài tập của bạn',
  },
];

export const CLASS_ACTIONS = [
  {
    icon: React.createElement(FolderOpen),
    tooltip: 'Thư mục của lớp học',
  },
  {
    icon: React.createElement(Settings),
    tooltip: 'Cài đặt lớp học',
  },
];

export const ADMIN_NAVIGATION = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: React.createElement(LayoutDashboard, {
      className: 'flex-shrink-0 ml-3',
    }),
    label: 'Dashboard',
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: React.createElement(UsersRound, { className: 'flex-shrink-0 ml-3' }),

    label: 'Users',
  },
  {
    title: 'Subjects',
    href: '/dashboard/subjects',
    icon: React.createElement(BookOpen, { className: 'flex-shrink-0 ml-3' }),

    label: 'Subjects',
  },
  {
    title: 'Semesters',
    href: '/dashboard/semesters',
    icon: React.createElement(Calendar, { className: 'flex-shrink-0 ml-3' }),

    label: 'Semesters',
  },
];

export const GOOGLE_FORM_TITLE = 'Blank Quiz';
