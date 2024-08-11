/* eslint-disable no-unused-vars */
'use client';

import { Controller, useForm } from 'react-hook-form';
import { useMemo } from 'react';

import { DataTable } from '@/components/ui/data-table';
import { IUser } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export const AttendanceClient = ({ data }: { data: IUser[] }) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      selectedRows: data.reduce((acc: { [key: string]: boolean }, item) => {
        acc[item.userId] = false;
        return acc;
      }, {}),
    },
  });

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: 'Select',
        cell: ({ row }: any) => (
          <Controller
            name={`selectedRows.${row.original.userId}`}
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => setValue(`selectedRows.${row.original.userId}`, Boolean(checked))}
                ref={field.ref}
              />
            )}
          />
        ),
        sortable: false,
        hideable: false,
      },
      {
        accessorKey: 'userId',
        header: 'ID',
      },
      {
        accessorKey: 'email',
        header: 'EMAIL',
      },
      {
        accessorKey: 'name',
        header: 'NAME',
      },
    ],
    [control, setValue],
  );

  const onSubmit = (data: any) => {
    const selectedRows = Object.keys(data.selectedRows).filter((key) => data.selectedRows[key]);
    console.log('Selected Rows:', selectedRows);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DataTable columns={columns} data={data} isSearchable={false} />
      <Button type="submit">Submit</Button>
    </form>
  );
};
