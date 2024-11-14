/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { CheckSquare2, FileSpreadsheet, Upload, X, AlertCircle, LayoutGrid, Columns, Search } from 'lucide-react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ICourse } from '@/types';
import courseService from '@/services/courseService';

export default function ImportStudentModal({
  isOpen,
  setIsOpen,
  course,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  course: ICourse;
}) {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const mandatoryColumns = ['customId', 'name', 'email'];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(jsonData);

      const header = jsonData[0] as string[];
      const mandatoryColumnIndices = header.reduce((acc: string[], col: string, index: number) => {
        if (mandatoryColumns.includes(col)) {
          acc.push(index.toString());
        }
        return acc;
      }, []);
      setSelectedColumns(mandatoryColumnIndices);
    }
  };

  const toggleColumnSelection = (columnIndex: number) => {
    setSelectedColumns((prev) =>
      prev.includes(columnIndex.toString())
        ? prev.filter((col) => col !== columnIndex.toString())
        : [...prev, columnIndex.toString()],
    );
  };

  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows((prev) => (prev.includes(rowIndex) ? prev.filter((row) => row !== rowIndex) : [...prev, rowIndex]));
  };

  const selectAllColumns = () => {
    const allColumns = data[0].map((_: any, index: number) => index.toString());
    setSelectedColumns(allColumns);
  };

  const deselectAllColumns = () => {
    setSelectedColumns(
      mandatoryColumns.map((col) => data[0].findIndex((header: string) => header.toLowerCase() === col).toString()),
    );
  };

  const selectAllRows = () => {
    const allRows = data.slice(1).map((_: any, index: number) => index);
    setSelectedRows(allRows);
  };

  const deselectAllRows = () => {
    setSelectedRows([]);
  };

  const handleImport = async () => {
    try {
      setLoading(true); // Bắt đầu loading khi gọi API
      console.log(selectedColumns);
      const selectedData = data
        .filter((_, rowIndex) => selectedRows.includes(rowIndex - 1))
        .map((row) => {
          const headers = data[0]; // Assuming the first row is the header

          const customId = selectedColumns.includes(headers.findIndex((i: string) => i === 'customId').toString())
            ? row[headers.findIndex((i: string) => i === 'customId')]
            : null;

          const name = selectedColumns.includes(headers.findIndex((i: string) => i === 'name').toString())
            ? row[headers.findIndex((i: string) => i === 'name')]
            : null;

          const birthDay = selectedColumns.includes(headers.findIndex((i: string) => i === 'birthDay').toString())
            ? row[headers.findIndex((i: string) => i === 'birthDay')]
            : null;

          const phoneNumber = selectedColumns.includes(headers.findIndex((i: string) => i === 'phoneNumber').toString())
            ? row[headers.findIndex((i: string) => i === 'phoneNumber')]
            : null;

          const email = selectedColumns.includes(headers.findIndex((i: string) => i === 'email').toString())
            ? row[headers.findIndex((i: string) => i === 'email')]
            : null;

          return {
            customId,
            name,
            birthDay,
            phoneNumber,
            email,
          };
        });

      const formattedData = {
        students: selectedData,
      };

      await courseService.importStudents(course.courseId, formattedData);
      toast.success('Import successful');
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Import failed');
    } finally {
      setLoading(false); // Dừng loading sau khi API phản hồi
    }
  };

  const filteredData = data
    .slice(1)
    .filter((row) => row.some((cell: any) => cell.toString().toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
            <FileSpreadsheet className="w-6 h-6" />
            Mời sinh viên thông qua excel
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-grow gap-6 overflow-hidden">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="flex-1"
              id="file-upload"
              disabled={loading} // Disable khi loading
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload
            </label>
          </div>

          {fileName && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                File uploaded: <span className="font-semibold">{fileName}</span>
              </AlertDescription>
            </Alert>
          )}

          {data.length > 0 && (
            <>
              <div className="flex flex-col items-start gap-4 mb-4 sm:flex-row sm:items-center">
                <div className="flex items-center flex-1 gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                    disabled={loading} // Disable khi loading
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={selectAllColumns} title="Chọn tất cả cột">
                    <CheckSquare2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={deselectAllColumns}
                    title="Bỏ chọn tất cả cột (trừ mặc định)"
                  >
                    <Columns className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={selectAllRows} title="Chọn tất cả hàng">
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={deselectAllRows} title="Bỏ chọn tất cả hàng">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-2 text-sm text-muted-foreground">{selectedRows.length} hàng được chọn</div>
              <ScrollArea className="h-[400px] w-full border rounded-lg shadow-sm">
                <div className="relative">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="sticky top-0 border-b bg-background">
                        {data[0].map((col: string, colIndex: number) => (
                          <th key={colIndex} className="p-3 font-medium text-left">
                            <label className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedColumns.includes(colIndex.toString())}
                                onCheckedChange={() =>
                                  !mandatoryColumns.includes(col) && toggleColumnSelection(colIndex)
                                }
                                disabled={loading || mandatoryColumns.includes(col)} // Disable khi loading hoặc là cột bắt buộc
                              />
                              <span className="truncate max-w-[150px]">{col}</span>
                            </label>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row: any[], rowIndex: number) => (
                        <tr
                          key={rowIndex}
                          className={`border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${
                            selectedRows.includes(rowIndex) ? 'bg-muted' : ''
                          }`}
                          onClick={() => toggleRowSelection(rowIndex)}
                        >
                          {row.map((cell, colIndex) => (
                            <td key={colIndex} className="p-3">
                              {colIndex === 0 ? (
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={selectedRows.includes(rowIndex)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedRows((prev) => [...prev, rowIndex]);
                                      } else {
                                        setSelectedRows((prev) => prev.filter((row) => row !== rowIndex));
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={loading} // Disable khi loading
                                  />
                                  <span className="truncate max-w-[150px]">{cell}</span>
                                </div>
                              ) : (
                                <span className="truncate max-w-[150px] block">{cell}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleImport} disabled={!data.length || !selectedRows.length || loading}>
            {loading ? 'Đang xử lý...' : 'Nhập dữ liệu đã chọn'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
