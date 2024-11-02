/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ColumnDef } from '@tanstack/react-table';

import { IReport, IScoreStructure, IUser } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToNumber(value: string) {
  return Number.isInteger(parseInt(value)) ? parseInt(value) : -1;
}

export function sortUsersByName(list: IUser[], ascending = true): IUser[] {
  return list.sort((a, b) => (ascending ? a.fullName.localeCompare(b.fullName) : b.fullName.localeCompare(a.fullName)));
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
};

interface SimpleColumnConfig {
  accessorKey?: string;
  id?: string;
  header: string;
  cell?: ({ row }: { row: any }) => JSX.Element;
  sortable?: boolean;
  hideable?: boolean;
}

export const createColumns = <T>(columnConfigs: SimpleColumnConfig[]): ColumnDef<T>[] => {
  return columnConfigs.map((config) => ({
    ...config,
    enableSorting: config.sortable !== undefined ? config.sortable : true,
    enableHiding: config.hideable !== undefined ? config.hideable : true,
    header: config.header,
    cell: config.cell,
  }));
};

export const getLeafColumns = (node: IScoreStructure): IScoreStructure[] => {
  const leaves: IScoreStructure[] = [];
  const traverse = (node: IScoreStructure) => {
    if (node.children.length === 0) {
      leaves.push(node);
    } else {
      node.children.forEach(traverse);
    }
  };
  traverse(node);
  return leaves;
};

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const options: any = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return date.toLocaleString('vi-VN', options);
};

export const generateParagraphs = (reports: IReport[]) => {
  return reports
    .map((report: IReport) => {
      const { title, content, attachedLinks, attachments, createUser, comments } = report;
      const userName = createUser?.fullName || createUser?.userName || 'Người tạo không rõ';

      const linksInfo = attachedLinks
        .map((link: any) => `- Liên kết: ${link.title} (${link.description}). URL: ${link.url}`)
        .join('\n');

      const attachmentsInfo = attachments
        .map((attachment: any) => `- Tệp tin: ${attachment.title}. URL: ${attachment.url}`)
        .join('\n');

      const commentsInfo = comments
        .map((comment: any) => {
          const commenterName = comment.user?.fullName || comment.user?.userName || 'Người bình luận không rõ';
          return `- ${commenterName}: ${comment.content.replace(/<\/?[^>]+(>|$)/g, ' ') || 'Không có nội dung'} (Ngày bình luận: ${formatDateTime(comment.createdAt)})`;
        })
        .join('\n');

      const plainContent = content.replace(/<\/?[^>]+(>|$)/g, ' ');

      return `
      Báo cáo: ${title || 'Không có tiêu đề'}
      Nội dung: ${plainContent || 'Không có nội dung'}
      Người tạo: ${userName || 'Không rõ'}
      Ngày tạo: ${formatDateTime(report.createdAt)}
      ${linksInfo ? `Liên kết đính kèm: \n${linksInfo}` : 'Không có liên kết đính kèm'}
      ${attachmentsInfo ? `Tệp tin đính kèm: \n${attachmentsInfo}` : 'Không có tệp tin đính kèm'}
      ${commentsInfo ? `Bình luận: \n${commentsInfo}` : 'Không có bình luận'}
      `;
    })
    .join('\n');
};
