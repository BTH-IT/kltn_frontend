/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Book, Users, Layers } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const initialData = [
  { month: '2024-01-01', courses: 4, users: 100, subjects: 3 },
  { month: '2024-02-01', courses: 6, users: 120, subjects: 4 },
  { month: '2024-03-01', courses: 8, users: 150, subjects: 5 },
  { month: '2024-04-01', courses: 10, users: 180, subjects: 6 },
  { month: '2024-05-01', courses: 12, users: 220, subjects: 7 },
];

export default function DashboardPage() {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: 'basic-area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      type: 'datetime',
      categories: initialData.map((item) => item.month),
    },
    yaxis: [
      {
        title: {
          text: 'Courses & Subjects',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Users',
        },
      },
    ],
    stroke: {
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    colors: ['#2563eb', '#16a34a', '#d97706'],
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
  });

  const [chartSeries, setChartSeries] = useState([
    {
      name: 'Courses',
      data: initialData.map((item) => item.courses),
    },
    {
      name: 'Subjects',
      data: initialData.map((item) => item.subjects),
    },
    {
      name: 'Users',
      data: initialData.map((item) => item.users),
    },
  ]);

  return (
    <div className="flex-1 p-8 pt-6 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <Book className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length > 0 ? data[data.length - 1]?.courses || 'N/A' : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.length > 1 ? `+${data[data.length - 1].courses - data[0].courses} from start` : 'No data available'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length > 0 ? data[data.length - 1]?.users || 'N/A' : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {data.length > 1 ? `+${data[data.length - 1].users - data[0].users} from start` : 'No data available'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <Layers className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length > 0 ? data[data.length - 1]?.subjects || 'N/A' : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.length > 1
                ? `+${data[data.length - 1].subjects - data[0].subjects} from start`
                : 'No data available'}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Đang tải...</p>
            ) : (
              <div className="h-[400px]">
                <ReactApexChart options={chartOptions as any} series={chartSeries} type="area" height="100%" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
