/* eslint-disable no-unused-vars */
import { currentUser } from '@clerk/nextjs/server';

import { prisma } from '../prisma';

const fetchClassIds = async () => {
  try {
    const classes = await prisma.classes.findMany({
      select: {
        classId: true,
      },
    });
    return classes.map((cls) => cls.classId);
  } catch (error) {
    console.error('Error fetching class IDs: ', error);
    return [];
  }
};

const fetchInviteCodes = async () => {
  try {
    const classes = await prisma.classes.findMany({
      select: {
        inviteCode: true,
      },
    });
    return classes.map((cls) => cls.inviteCode);
  } catch (error) {
    console.error('Error fetching class IDs: ', error);
    return [];
  }
};

const fetchEnrolledClassIds = async () => {
  try {
    const classes = await prisma.enrolledClasses.findMany();
    return classes;
  } catch (error) {
    console.error('Error fetching class IDs: ', error);
    return [];
  }
};

const getInviteCodes = async () => {
  try {
    const classes = await prisma.classes.findMany({
      select: {
        inviteCode: true,
      },
    });

    return classes.map((cls) => cls.inviteCode);
  } catch (error) {
    console.error('Error getting invite codes: ', error);
    return [];
  }
};

const getClassWithInviteCode = async (inviteCode: string) => {
  try {
    const cls = await prisma.classes.findFirst({
      where: {
        inviteCode,
      },
      include: {
        students: { include: { student: true } },
        teacher: true,
        subject: true,
      },
    });

    const students = cls?.students.map((s) => s.student);

    return (
      {
        ...cls,
        students,
      } || null
    );
  } catch (error) {
    console.error('Error getting class data: ', error);
    return null;
  }
};

const getTeacherId = async (classId: string) => {
  try {
    const cls = await prisma.classes.findUnique({
      where: {
        classId,
      },
    });

    if (!cls) {
      console.error('Class data not found.');
      return '';
    }

    return cls.teacherId;
  } catch (error) {
    console.error('Error getting teacherId: ', error);
    return '';
  }
};

const saveClass = async (data: any) => {
  try {
    const newClass = await prisma.classes.create({
      data: data,
      include: {
        students: true,
        teacher: true,
        subject: true,
      },
    });

    return newClass;
  } catch (error) {
    console.error('Error saving class data: ', error);
    return false;
  }
};

const deleteClass = async (classId: string) => {
  try {
    await prisma.classes.delete({
      where: {
        classId,
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting class data: ', error);
    return false;
  }
};

const updateClass = async (classId: string, data: any) => {
  try {
    const { classId: _, students, announcements, teacher, subject, ...dataToUpdate } = data;
    const user = await currentUser();

    const updatedClass = await prisma.classes.update({
      where: {
        classId,
      },
      data: {
        ...dataToUpdate,
        updatedAt: new Date(),
      },
      include: {
        students: { include: { student: true } },
        teacher: true,
        announcements: {
          include: {
            user: true,
            comments: {
              include: {
                user: true,
              },
            },
          },
        },
        subject: true,
      },
    });

    const newStudents = updatedClass?.students.map((s) => s.student);
    if (updatedClass?.teacherId === user?.id) {
      return (
        {
          ...updatedClass,
          students,
        } || null
      );
    }

    const newAnnouncements = updatedClass?.announcements.filter((a) =>
      JSON.parse(a?.mentions?.toString() || '[]').some((id: string) => id === user?.id || id === 'all'),
    );

    return {
      ...updatedClass,
      students: newStudents,
      announcements: newAnnouncements,
    };
  } catch (error) {
    console.error('Error updating class data: ', error);
    return false;
  }
};

const getClass = async (classId: string): Promise<any | null> => {
  try {
    const user = await currentUser();

    const cls = await prisma.classes.findUnique({
      where: {
        classId,
      },
      include: {
        students: { include: { student: true } },
        teacher: true,
        announcements: {
          include: {
            user: true,
            comments: {
              include: {
                user: true,
              },
            },
          },
        },
        subject: true,
        assignments: { include: { studentAssigned: true } },
      },
    });

    const students = cls?.students.map((s) => s.student);
    if (cls?.teacherId === user?.id) {
      return (
        {
          ...cls,
          students,
        } || null
      );
    }

    console.log(cls?.announcements);

    const announcements = cls?.announcements.filter((a) =>
      JSON.parse(a?.mentions?.toString() || '[]').some((id: string) => id === user?.id || id === 'all'),
    );

    return (
      {
        ...cls,
        announcements,
        students,
      } || null
    );
  } catch (error) {
    console.error('Error retrieving class data: ', error);
    return null;
  }
};

const getClasses = async (): Promise<any[]> => {
  try {
    const classes = await prisma.classes.findMany({
      include: {
        students: true,
        teacher: true,
        announcements: true,
        comments: true,
        subject: true,
        assignments: true,
      },
    });

    return classes;
  } catch (error) {
    console.error('Error retrieving classes data: ', error);
    return [];
  }
};

const checkExistUserInClass = async (userId: string): Promise<any> => {
  try {
    let classes: any = await prisma.enrolledClasses.findFirst({
      where: {
        userId,
      },
    });

    if (!classes) {
      classes = await prisma.classes.findFirst({
        where: {
          teacherId: userId,
        },
      });
    }

    return classes ? true : false;
  } catch (error) {
    console.error('Error retrieving classes data: ', error);
    return false;
  }
};

const getClassesByUser = async (userId: string): Promise<any> => {
  try {
    const classesCreated = await prisma.classes.findMany({
      where: {
        teacherId: userId,
      },
      include: {
        teacher: true,
        subject: true,
      },
    });

    const enrolledData = await prisma.enrolledClasses.findMany({
      where: {
        userId,
      },
      include: {
        classes: { include: { teacher: true, subject: true } },
      },
    });

    const classesEnrolled = enrolledData.map((data) => data.classes);

    return {
      classesCreated,
      classesEnrolled,
    };
  } catch (error) {
    console.error('Error retrieving classes data: ', error);
    return [];
  }
};

const addStudentToClass = async (classId: string, userId: string) => {
  try {
    // Ensure both class and user exist
    const classExists = await prisma.classes.findUnique({
      where: { classId },
    });

    const userExists = await prisma.users.findUnique({
      where: { userId },
    });

    if (!classExists || !userExists) {
      console.error('Class or User not found.');
      return false;
    }

    // Create or update entry in EnrolledClasses table
    await prisma.enrolledClasses.upsert({
      where: {
        classId_userId: {
          classId,
          userId,
        },
      },
      update: {}, // No need to update anything if it already exists
      create: {
        classId,
        userId,
      },
    });

    // Update the class' updatedAt timestamp
    await prisma.classes.update({
      where: {
        classId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error('Error adding student to class: ', error);
    return false;
  }
};

const deleteStudentOfClass = async (classId: string, userId: string) => {
  try {
    await prisma.enrolledClasses.delete({
      where: {
        classId_userId: {
          classId: classId,
          userId: userId,
        },
      },
    });

    return true;
  } catch (error) {
    console.error(`Error deleting student with ID ${userId} from class with ID ${classId}: `, error);
    return false;
  }
};

export {
  getInviteCodes,
  getClassWithInviteCode,
  getTeacherId,
  saveClass,
  deleteClass,
  updateClass,
  addStudentToClass,
  getClass,
  getClasses,
  getClassesByUser,
  checkExistUserInClass,
  deleteStudentOfClass,
  fetchClassIds,
  fetchEnrolledClassIds,
  fetchInviteCodes,
};
