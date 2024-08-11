/* eslint-disable no-unused-vars */
import { prisma } from '../prisma';

const fetchAssignmentIds = async () => {
  try {
    const assignments = await prisma.assignments.findMany({
      select: {
        assignmentId: true,
      },
    });

    return assignments.map(({ assignmentId }) => assignmentId);
  } catch (error) {
    console.error('Error checking permission: ', error);
    return [];
  }
};

const saveUserAssignment = async (userId: string, assignmentId: string) => {
  await prisma.userAssignments.upsert({
    where: {
      userId_assignmentId: {
        userId,
        assignmentId: assignmentId,
      },
    },
    update: {}, // No need to update anything if it already exists
    create: {
      userId,
      assignmentId: assignmentId,
    },
  });
};

const saveAssignment = async (data: any) => {
  try {
    const { studentAssigned, classId, ...restOfData } = data;
    const newData = await prisma.assignments.create({
      data: {
        classId,
        ...restOfData,
      },
      include: {
        classes: true,
        studentAssigned: true,
      },
    });

    if (!newData) {
      throw new Error('Failed to create assignment');
    }

    const students =
      studentAssigned[0] === 'all'
        ? await prisma.enrolledClasses
            .findMany({
              select: { userId: true },
              where: { classId },
            })
            .then((users) => users.map(({ userId }) => userId))
        : studentAssigned;

    await Promise.all(students.map((userId: string) => saveUserAssignment(userId, newData.assignmentId)));

    return newData;
  } catch (error) {
    console.error('Error saving assignment: ', error);
  }
};

const deleteAssignment = async (assignmentId: string) => {
  try {
    await prisma.assignments.delete({
      where: {
        assignmentId,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Assignment data: ', error);
    return false;
  }
};

const updateAssignment = async (assignmentId: string, data: any) => {
  try {
    // Destructure the data to remove unwanted fields
    const { assignmentId: _, classId, ...dataToUpdate } = data;

    const updatedData = await prisma.assignments.update({
      where: {
        assignmentId,
      },
      data: {
        ...dataToUpdate,
        updatedAt: new Date().toISOString(),
      },
      include: {
        classes: true,
        studentAssigned: true,
      },
    });

    return updatedData;
  } catch (error) {
    console.error('Error updating Assignment data: ', error);
    return false;
  }
};

const getAssignment = async (assignmentId: string): Promise<any | null> => {
  try {
    const data = await prisma.assignments.findUnique({
      where: {
        assignmentId,
      },
      include: {
        classes: true,
        studentAssigned: true,
      },
    });

    if (!data) {
      console.error('Assignment data not found.');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error retrieving Assignment data: ', error);
    return null;
  }
};

const getAssignments = async (classId: string): Promise<any[]> => {
  try {
    const assignments = await prisma.assignments.findMany({
      where: {
        classId,
      },
      include: {
        classes: true,
        studentAssigned: true,
      },
    });

    return assignments;
  } catch (error) {
    console.error('Error retrieving Assignments data: ', error);
    return [];
  }
};

const getAssignmentsByUser = async (classId: string, userId: string): Promise<any[]> => {
  try {
    const assignments = await prisma.assignments.findMany({
      where: {
        classId: classId,
        studentAssigned: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        classes: true,
        studentAssigned: true,
      },
    });
    return assignments;
  } catch (error) {
    console.error('Error retrieving Assignments data: ', error);
    return [];
  }
};

export {
  saveAssignment,
  deleteAssignment,
  updateAssignment,
  getAssignment,
  getAssignments,
  fetchAssignmentIds,
  getAssignmentsByUser,
};
