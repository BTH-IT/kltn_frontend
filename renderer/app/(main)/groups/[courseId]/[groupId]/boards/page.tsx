/* eslint-disable react/no-unescaped-entities */
'use client';
import React from 'react';

const BoardsPage = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex space-x-4">
        {/* To-do Column */}
        <div className="w-1/3 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              To-do <span className="text-sm text-gray-500">274</span>
            </h3>
            <button className="text-gray-500 hover:text-gray-700">...</button>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center p-2 border rounded-lg">dăd</li>
            <li className="flex items-center p-2 border rounded-lg">ădadawdwa</li>
            <li className="flex items-center p-2 border rounded-lg">ădawd</li>
            <li className="flex items-center p-2 border rounded-lg">ădawda</li>
            <li className="flex items-center p-2 border rounded-lg">ădaw</li>
          </ul>
          <button className="mt-4 text-blue-500 hover:text-blue-700">+ Add tasks</button>
        </div>

        {/* In Progress Column */}
        <div className="w-1/3 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-500">
              In progress <span className="text-sm text-gray-500">2</span>
            </h3>
            <button className="text-gray-500 hover:text-gray-700">...</button>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center p-2 border rounded-lg">
              Welcome to Quire! Your productivity is about to get skyrocketed 🚀
            </li>
            <li className="flex items-center p-2 border rounded-lg">dăd</li>
          </ul>
          <div className="p-2 mt-2 border border-green-500 rounded-lg">
            <input type="text" placeholder="Add a task" className="w-full p-2 focus:outline-none" />
          </div>
        </div>

        {/* Abca Column */}
        <div className="w-1/3 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-teal-500">
              abca <span className="text-sm text-gray-500">1</span>
            </h3>
            <button className="text-gray-500 hover:text-gray-700">...</button>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center p-2 border rounded-lg">
              Let's get started by going through the step-by-step guide now!
            </li>
          </ul>
          <button className="mt-4 text-blue-500 hover:text-blue-700">+ Add tasks</button>
        </div>
      </div>
    </div>
  );
};

export default BoardsPage;
