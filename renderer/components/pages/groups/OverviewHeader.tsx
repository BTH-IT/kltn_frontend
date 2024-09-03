/* eslint-disable react/no-unescaped-entities */
'use client';
import React from 'react';

const OverviewHeader = () => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow">
      {/* Project Icon */}
      <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-teal-700 rounded-md">
        HP
      </div>

      {/* Project Details */}
      <div className="flex-1 ml-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Hector Biện's Project</h1>
          <span className="px-2 py-1 ml-2 text-xs font-medium text-gray-700 bg-gray-100 rounded">Free</span>
        </div>
        <p className="text-sm text-gray-600">Hector Biện's Organization &bull; Created Aug 29, 2024</p>
      </div>

      {/* Project Stats and Actions */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405C18.21 14.79 17 13.28 17 12V7a5 5 0 10-4 0v5c0 1.28-1.21 2.79-2.595 3.595L9 17h6v5a1 1 0 001 1h4a1 1 0 001-1v-5z"
            />
          </svg>
          0
        </div>
        <div className="relative">
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 13.793A4.968 4.968 0 016 12V6.707l7-7 7 7V12a5 5 0 01-1 2.793l-6 6A5 5 0 0110 20H5v-2h5v-5l6-6-7-7-7 7v5c0 1.386.564 2.64 1.587 3.707z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewHeader;
