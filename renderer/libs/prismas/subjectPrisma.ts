/* eslint-disable no-unused-vars */
import { prisma } from '../prisma';

const fetchSubjectIds = async () => {
  try {
    const subjects = await prisma.subjects.findMany({
      select: {
        subjectId: true,
      },
    });

    return subjects.map(({ subjectId }) => subjectId);
  } catch (error) {
    console.error('Error checking permission: ', error);
    return [];
  }
};

const getSubjects = async () => {
  try {
    const subjects = await prisma.subjects.findMany();
    return subjects;
  } catch (error) {
    console.error('Error getting subject data: ', error);
    return [];
  }
};

const saveSubject = async (data: any) => {
  try {
    const newSubject = await prisma.subjects.create({
      data,
    });
    return newSubject;
  } catch (error) {
    console.error('Error saving subject data: ', error);
    return false;
  }
};

const deleteSubject = async (subjectId: string) => {
  try {
    await prisma.subjects.delete({
      where: {
        subjectId,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting subject data: ', error);
    return false;
  }
};

const updateSubject = async (subjectId: string, data: any) => {
  try {
    const { subjectId: _, ...dataToUpdate } = data;

    const updatedSubject = await prisma.subjects.update({
      where: {
        subjectId,
      },
      data: {
        ...dataToUpdate,
        updatedAt: new Date(),
      },
    });
    return updatedSubject;
  } catch (error) {
    console.error('Error updating subject data: ', error);
    return false;
  }
};

export { getSubjects, saveSubject, deleteSubject, updateSubject, fetchSubjectIds };
