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
      const { title, content, attachedLinks, attachments, createUser, comments, createdAt } = report;

      const userName = createUser?.fullName || createUser?.userName || 'Người tạo không rõ';

      const linksInfo = (attachedLinks ?? [])
        .map(
          (link: any) =>
            `- Liên kết: ${link.title || 'Không có tiêu đề'} (${link.description || 'Không có mô tả'}). URL: ${link.url || 'Không có URL'}`,
        )
        .join('\n');

      const attachmentsInfo = (attachments ?? [])
        .map(
          (attachment: any) =>
            `- Tệp tin: ${attachment.title || 'Không có tiêu đề'}. URL: ${attachment.url || 'Không có URL'}`,
        )
        .join('\n');

      const commentsInfo = (comments ?? [])
        .map((comment: any) => {
          const commenterName = comment?.user?.fullName || comment?.user?.userName || 'Người bình luận không rõ';
          return `- ${commenterName}: ${comment?.content?.replace(/<\/?[^>]+(>|$)/g, ' ') || 'Không có nội dung'} (Ngày bình luận: ${formatDateTime(comment?.createdAt) || 'Không rõ'})`;
        })
        .join('\n');

      const plainContent = content?.replace(/<\/?[^>]+(>|$)/g, ' ') || 'Không có nội dung';

      return `
      Báo cáo: ${title || 'Không có tiêu đề'}
      Nội dung: ${plainContent}
      Người tạo: ${userName}
      Ngày tạo: ${formatDateTime(createdAt) || 'Không rõ'}
      ${linksInfo ? `Liên kết đính kèm: \n${linksInfo}` : 'Không có liên kết đính kèm'}
      ${attachmentsInfo ? `Tệp tin đính kèm: \n${attachmentsInfo}` : 'Không có tệp tin đính kèm'}
      ${commentsInfo ? `Bình luận: \n${commentsInfo}` : 'Không có bình luận'}
      `;
    })
    .join('\n');
};

const toCamelCase = (str: string) => {
  return str.replace(/(?:^[A-Z])/g, (match) => match.toLowerCase());
};

export const convertKeysToCamelCase = (obj: { [key: string]: any }): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const camelKey = toCamelCase(key);
        acc[camelKey] = convertKeysToCamelCase(obj[key]);
        return acc;
      },
      {} as { [key: string]: any },
    );
  }
  return obj;
};
