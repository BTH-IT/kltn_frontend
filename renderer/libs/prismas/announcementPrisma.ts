/* eslint-disable no-unused-vars */
import { prisma } from '../prisma';

const fetchAnnouncementIds = async () => {
  try {
    const announcements = await prisma.announcements.findMany({
      select: {
        announcementId: true,
      },
    });

    return announcements.map(({ announcementId }) => announcementId);
  } catch (error) {
    console.error('Error checking permission: ', error);
    return [];
  }
};

const saveAnnouncement = async (data: any) => {
  try {
    const newData = await prisma.announcements.create({
      data: data,
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    return newData;
  } catch (error) {
    console.error('Error saving Announcement data: ', error);
    return false;
  }
};

const deleteAnnouncement = async (announcementId: string) => {
  try {
    await prisma.announcements.delete({
      where: {
        announcementId,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Announcement data: ', error);
    return false;
  }
};

const updateAnnouncement = async (announcementId: string, data: any) => {
  try {
    // Destructure the data to remove unwanted fields
    const { announcementId: _, userId, user, classId, classes, ...dataToUpdate } = data;

    const updatedData = await prisma.announcements.update({
      where: {
        announcementId,
        updatedAt: new Date().toISOString(),
      },
      data: {
        ...dataToUpdate,
        classes: {
          update: classes,
        },
        user: {
          update: user,
        },
      },
      include: {
        user: true,
        classes: true,
      },
    });

    return updatedData;
  } catch (error) {
    console.error('Error updating Announcement data: ', error);
    return false;
  }
};

const fetchAnnouncementAndClassIds = async (): Promise<any | null> => {
  try {
    const data = await prisma.announcements.findMany({
      select: {
        announcementId: true,
        classId: true,
      },
    });

    if (!data) {
      console.error('Announcement data not found.');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error retrieving Announcement data: ', error);
    return null;
  }
};

const getAnnouncement = async (announcementId: string): Promise<any | null> => {
  try {
    const data = await prisma.announcements.findUnique({
      where: {
        announcementId,
      },
      include: {
        user: true,
      },
    });

    if (!data) {
      console.error('Announcement data not found.');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error retrieving Announcement data: ', error);
    return null;
  }
};

const getAnnouncements = async (classId: string): Promise<any[]> => {
  try {
    const announcements = await prisma.announcements.findMany({
      where: {
        classId,
      },
      include: {
        user: true,
      },
      orderBy: [{ pin: 'desc' }, { createdAt: 'desc' }],
    });

    return announcements;
  } catch (error) {
    console.error('Error retrieving Announcements data: ', error);
    return [];
  }
};

export {
  saveAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  getAnnouncement,
  getAnnouncements,
  fetchAnnouncementIds,
  fetchAnnouncementAndClassIds,
};
