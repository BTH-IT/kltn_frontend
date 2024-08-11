/* eslint-disable no-unused-vars */
import { prisma } from '../prisma';

const saveAttendance = async (data: any) => {
  try {
    const newData = await prisma.attendances.create({
      data: data,
      include: {
        classes: true,
      },
    });

    return newData;
  } catch (error) {
    console.error('Error saving attendance data: ', error);
    return false;
  }
};

const deleteAttendance = async (attendanceId: string, classId: string) => {
  try {
    await prisma.attendances.delete({
      where: {
        attendanceId,
        classId,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting attendance data: ', error);
    return false;
  }
};

const updateAttendance = async (attendanceId: string, classId: string, createdAt: Date, data: any) => {
  try {
    // Destructure the data to remove unwanted fields
    const { attendanceId: _, classes, ...dataToUpdate } = data;

    const updatedData = await prisma.attendances.update({
      where: {
        attendanceId,
        classId,
      },
      data: {
        ...dataToUpdate,
        classes: {
          update: classes,
        },
      },
      include: {
        classes: true,
      },
    });

    return updatedData;
  } catch (error) {
    console.error('Error updating attendance data: ', error);
    return false;
  }
};

const getAttendance = async (attendanceId: string, classId: string): Promise<any | null> => {
  try {
    const data = await prisma.attendances.findUnique({
      where: {
        attendanceId,
        classId,
      },
    });

    if (!data) {
      console.error('attendance data not found.');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error retrieving attendance data: ', error);
    return null;
  }
};

const getAttendanceDetailByAtendanceId = async (attendanceId: string): Promise<any | null> => {
  try {
    const data = await prisma.attendanceDetails.findMany({
      where: {
        attendanceId,
      },
      include: {
        student: true,
      },
    });

    if (!data) {
      console.error('attendance data not found.');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error retrieving attendance data: ', error);
    return null;
  }
};

const getAttendances = async (classId: string): Promise<any[]> => {
  try {
    const attendances = await prisma.attendances.findMany({
      where: {
        classId,
      },
      include: {
        classes: true,
      },
    });

    return attendances;
  } catch (error) {
    console.error('Error retrieving attendances data: ', error);
    return [];
  }
};

export {
  saveAttendance,
  deleteAttendance,
  updateAttendance,
  getAttendance,
  getAttendances,
  getAttendanceDetailByAtendanceId,
};
