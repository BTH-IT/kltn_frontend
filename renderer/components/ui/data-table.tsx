'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ReactNode, useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Input } from './input';
import { Button } from './button';
import { ScrollArea, ScrollBar } from './scroll-area';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isSearchable?: boolean;
  isProject?: boolean;
  button?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isSearchable = true,
  isProject = false,
  button = null,
}: DataTableProps<TData, TValue>) {
  const [filtering, setFiltering] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      {isSearchable ? (
        <div className="flex justify-between">
          <Input
            placeholder={'Search ...'}
            value={filtering}
            onChange={(event) => setFiltering(event.target.value)}
            className="w-full md:max-w-sm"
          />
          {isProject && button}
        </div>
      ) : (
        <div className="flex justify-end">{isProject && button}</div>
      )}
      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    const accessorKey = (cell.column.columnDef as any).accessorKey;

                    const cellValue = (cell.row.original as any)[accessorKey];

                    return (
                      <TableCell key={cell.id}>
                        {cellValue !== undefined
                          ? cellValue
                          : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {table.getCanNextPage() && (
        <div className="flex items-center justify-end py-4 space-x-2">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Trước
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
