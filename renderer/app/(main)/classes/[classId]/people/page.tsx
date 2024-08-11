'use client';

import React, { useContext } from 'react';

import People from '@/components/pages/classes/People';
import { ClassContext } from '@/contexts/ClassContext';

const PeoplePage = () => {
  const { classes } = useContext(ClassContext);

  if (!classes) return <></>;

  return (
    <>
      {classes.teacher && <People isTeacher data={[classes.teacher]} classes={classes} />}
      <People isTeacher={false} data={classes.students} classes={classes} />
    </>
  );
};

export default PeoplePage;
