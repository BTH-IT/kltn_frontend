/* eslint-disable quotes */
'use client';
import React from 'react';

const WeeklySummary = () => {
  const summaryData = {
    todos: 0,
    completed: {
      unassigned: 3,
    },
    created: {
      hectorBien: 278,
      quire: 2,
    },
  };

  const activities = [
    {
      user: 'Hector Biện',
      action: 'set the status of ewq to',
      status: 'abc',
      time: '1 hour ago',
    },
    {
      user: 'Hector Biện',
      action: 'set the status of Let’s get started by going through th... to',
      status: 'abca',
      time: '1 hour ago',
    },
    {
      user: 'Hector Biện',
      action: 'set the status of Welcome to Quire! Your productivity i... to',
      status: 'In progress',
      time: '1 hour ago',
    },
    {
      user: 'Hector Biện',
      action: "added a status to Hector Biện's Project,",
      status: 'abca',
      time: '1 hour ago',
    },
    {
      user: 'Hector Biện',
      action: 'set the status of du to',
      status: 'Completed',
      time: '4 days ago',
    },
    {
      user: 'Hector Biện',
      action: 'set the status of ádàwdwa to',
      status: 'Completed',
      time: '4 days ago',
    },
    {
      user: 'Hector Biện',
      action: 'set the status of dwadawadwdawadwd to',
      status: 'Completed',
      time: '4 days ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">Weekly Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium">To-dos</h4>
            <p className="text-gray-600">{summaryData.todos > 0 ? summaryData.todos : 'No results found.'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Completed</h4>
            <p className="text-gray-600">Unassigned: {summaryData.completed.unassigned}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Created</h4>
            <p className="text-gray-600">Hector Biện: {summaryData.created.hectorBien}</p>
            <p className="text-gray-600">Quire: {summaryData.created.quire}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h4 className="mb-4 text-lg font-semibold">Recent Activities</h4>
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li key={index} className="text-gray-800">
              <strong>{activity.user}</strong> {activity.action}
              <span
                className={`inline-block ml-2 mr-2 px-2 py-1 rounded-full text-xs text-white ${
                  activity.status === 'Completed'
                    ? 'bg-green-500'
                    : activity.status === 'In progress'
                      ? 'bg-yellow-500'
                      : 'bg-orange-500'
                }`}
              >
                {activity.status}
              </span>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeeklySummary;
