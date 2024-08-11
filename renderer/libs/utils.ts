/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ColumnDef } from '@tanstack/react-table';

import { IUser } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToNumber(value: string) {
  return Number.isInteger(parseInt(value)) ? parseInt(value) : -1;
}

export function sortUsersByName(list: IUser[], ascending = true): IUser[] {
  return list.sort((a, b) => (ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
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
