/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Book, Users, Layers } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dashboardService from '@/services/dashboardService';

// Lazy load ApexCharts
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const formatToDate = (month: string) => {
  const year = new Date().getFullYear(); // Lấy năm hiện tại
  return `${year}-${month.padStart(2, '0')}-01`; // Chuyển thành định dạng YYYY-MM-DD
};

// Hook to fetch and process dashboard data
function useDashboardData() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await dashboardService.static();
        const processedData = res.data.map((item: any) => ({
          ...item,
          month: formatToDate(item.month),
        }));
        console.log(processedData);

        // Update state
        setData(processedData);
        setChartSeries(createChartSeries(processedData));
        setChartOptions(createChartOptions(processedData));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const createChartOptions = (data: any[]) => ({
    chart: {
      id: 'basic-area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      type: 'datetime',
      categories: data.map((item) => item.month),
    },
    yaxis: [{ title: { text: 'Lớp học & Môn học' } }, { opposite: true, title: { text: 'Người dùng' } }],
    stroke: { curve: 'smooth' },
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
    tooltip: { x: { format: 'dd MMM yyyy' } },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
    },
    dataLabels: { enabled: false },
    grid: { show: false },
  });

  const createChartSeries = (data: any[]) => [
    { name: 'Lớp học', data: data.map((item) => item.courses) },
    { name: 'Môn học', data: data.map((item) => item.subjects) },
    { name: 'Người dùng', data: data.map((item) => item.users) },
  ];

  return { data, isLoading, chartOptions, chartSeries };
}

// Component for individual stats card
function StatsCard({ title, icon: Icon, value, difference }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value !== null ? value : 'N/A'}</div>
        <p className="text-xs text-muted-foreground">
          {difference !== null ? `${difference >= 0 ? '+' : ''}${difference} từ tháng trước` : 'No data available'}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading, chartOptions, chartSeries } = useDashboardData();

  const getLastValue = (key: string) => (data.length > 0 ? data[data.length - 1][key] : 'N/A');

  const calculateDifference = (key: string) => {
    if (data.length > 1) {
      const currentMonthValue = data[data.length - 1][key];
      const previousMonthValue = data[data.length - 2][key];
      const diff = currentMonthValue - previousMonthValue;

      return diff >= 0 ? diff : 0;
    }
    return null;
  };

  return (
    <div className="flex-1 p-8 pt-6 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Lớp học"
          icon={Book}
          value={getLastValue('courses')}
          difference={calculateDifference('courses')}
        />
        <StatsCard
          title="Người dùng"
          icon={Users}
          value={getLastValue('users')}
          difference={calculateDifference('users')}
        />
        <StatsCard
          title="Môn học"
          icon={Layers}
          value={getLastValue('subjects')}
          difference={calculateDifference('subjects')}
        />
      </div>

      {/* Overview Chart */}
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
