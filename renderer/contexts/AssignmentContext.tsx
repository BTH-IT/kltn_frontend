/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { IAssignment } from '@/types';
import assignmentService from '@/services/assignmentService';

const AssignmentContext = React.createContext({
  assignment: {} as IAssignment | null,
  setAssignment: (_assignment: IAssignment | null) => {},
});

const AssignmentProvider = ({
  children,
  assignment,
}: {
  children: React.ReactNode;
  assignment: IAssignment | null;
}) => {
  const [data, setData] = useState<IAssignment | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await assignmentService.getAssignment(assignment?.assignmentId || '');
        setData(res.data);
      } catch (error) {
        console.log('Failed to fetch assignment:', error);
      }
    };

    if (!assignment) {
      fetchData();
    } else {
      setData(assignment);
    }
  }, [assignment]);

  return (
    <AssignmentContext.Provider
      value={{
        assignment: data,
        setAssignment: setData,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export { AssignmentContext, AssignmentProvider };
