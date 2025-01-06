'use client';
import { BarChart } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ITranscriptStatistic } from '@/types';

export default function ScoreStructureStatistic({ data }: { data: ITranscriptStatistic[] }) {
  return (
    <div className="pb-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Thống kê điểm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại điểm</TableHead>
                <TableHead>Điểm trung bình</TableHead>
                <TableHead>Điểm thấp nhất</TableHead>
                <TableHead>Điểm cao nhất</TableHead>
                <TableHead>Phân phối điểm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((stat) => (
                <TableRow key={stat.columnName}>
                  <TableCell className="font-medium">{stat.columnName}</TableCell>
                  <TableCell>{stat.average}</TableCell>
                  <TableCell>{stat.min}</TableCell>
                  <TableCell>{stat.max}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      {Object.entries(stat.distribution).map(([grade, count]) => (
                        <div key={grade} className="text-sm">
                          <span className="font-medium">{grade}: </span>
                          {count}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
