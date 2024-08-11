import React, { useMemo, useState } from 'react';
import { useTable, Column, CellProps } from 'react-table';

import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Data {
  name: string;
  [key: string]: any;
}

const AttendanceTable = () => {
  const initialData: Data[] = [{ name: 'Student 1' }, { name: 'Student 2' }, { name: 'Student 3' }];

  const initialColumns: Column<Data>[] = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      {
        Header: 'Session 1',
        accessor: 'session1',
        Cell: ({ row }: CellProps<Data>) => (
          <input
            type="checkbox"
            checked={row.original['session1'] || false}
            onChange={(e) => handleCheckboxChange(row.index, 'session1', e.target.checked)}
          />
        ),
      },
    ],
    [],
  );

  const [columns, setColumns] = useState(initialColumns);
  const [data, setData] = useState(initialData);

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const addColumn = () => {
    const newSessionNumber = columns.length;
    const newColumn: Column<Data> = {
      Header: `Session ${newSessionNumber}`,
      accessor: `session${newSessionNumber}`,
      Cell: ({ row }: CellProps<Data>) => (
        <input
          type="checkbox"
          checked={row.original[`session${newSessionNumber}`] || false}
          onChange={(e) => handleCheckboxChange(row.index, `session${newSessionNumber}`, e.target.checked)}
        />
      ),
    };
    setColumns([...columns, newColumn]);
  };

  const removeColumn = () => {
    if (columns.length > 2) {
      setColumns(columns.slice(0, -1));
    }
  };

  const handleCheckboxChange = (rowIndex: number, columnId: string, checked: boolean) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnId] = checked;
    setData(updatedData);
  };

  return (
    <div>
      <Button onClick={addColumn} className="mb-4">
        Add Session
      </Button>
      <Button onClick={removeColumn} className="mb-4 ml-2">
        Remove Session
      </Button>
      <Table {...getTableProps()} className="w-full">
        <TableHeader>
          {headerGroups.map((headerGroup, idx) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={idx}>
              {headerGroup.headers.map((column, i) => (
                <TableHead {...column.getHeaderProps()} key={i}>
                  {column.render('Header')}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} key={idx}>
                {row.cells.map((cell, i) => (
                  <TableCell {...cell.getCellProps()} key={i}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
