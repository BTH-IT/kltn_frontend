'use client';

import { useContext } from 'react';

import { AssignmentContext } from '@/contexts/AssignmentContext';

const AssignmentDetailPage = ({ params }: { params: { classId: string; assignmentId: string } }) => {
  const { assignment } = useContext(AssignmentContext);
  return (
    <>
      <div>Assignment Detail Page {JSON.stringify(params)}</div>
      <div>{JSON.stringify(assignment)}</div>
    </>
  );
};

export default AssignmentDetailPage;
