/* eslint-disable no-unused-vars */
'use client';
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';

// Initialize exporting module for Highcharts
if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const Charts = () => {
  const pieOptions = {
    chart: {
      type: 'pie',
      height: 300,
    },
    title: {
      text: 'Progress Stats',
      align: 'left',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    series: [
      {
        name: 'Tasks',
        colorByPoint: true,
        data: [
          {
            name: 'To-do',
            y: 274,
            color: '#E0E0E0',
          },
          {
            name: 'In progress',
            y: 1,
            color: '#A3D16E',
          },
          {
            name: 'Completed',
            y: 3,
            color: '#67C23A',
          },
          {
            name: 'Unscheduled',
            y: 277,
            color: '#F2F2F2',
          },
        ],
      },
    ],
  };

  const areaSplineOptions = {
    chart: {
      type: 'areaspline',
      height: 300,
    },
    title: {
      text: '',
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'top',
      borderWidth: 0,
    },
    xAxis: {
      categories: [
        'Mar 16',
        'Mar 30',
        'Apr 13',
        'Apr 27',
        'May 11',
        'May 25',
        'Jun 8',
        'Jun 22',
        'Jul 6',
        'Jul 20',
        'Aug 3',
        'Aug 17',
        'Aug 31',
      ],
      tickmarkPlacement: 'on',
      title: {
        enabled: false,
      },
    },
    yAxis: {
      title: {
        text: '',
      },
      labels: {
        formatter: function (this: Highcharts.AxisLabelsFormatterContextObject): string {
          return this.value.toString();
        },
      },
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.1,
      },
    },
    series: [
      {
        name: 'To-do',
        data: [310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 274],
        color: '#E0E0E0',
      },
      {
        name: 'In progress',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        color: '#A3D16E',
      },
      {
        name: 'Completed',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
        color: '#67C23A',
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={pieOptions} />
      <HighchartsReact highcharts={Highcharts} options={areaSplineOptions} />
    </div>
  );
};

export default Charts;
