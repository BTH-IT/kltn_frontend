/* eslint-disable no-unused-vars */
import { prisma } from '../prisma';

const fetchCommentIds = async () => {
  try {
    const comments = await prisma.comments.findMany({
      select: {
        commentId: true,
        announcementId: true,
      },
    });

    return comments.map(({ commentId, announcementId }) => {
      return {
        commentId,
        announcementId,
      };
    });
  } catch (error) {
    console.error('Error checking permission: ', error);
    return [];
  }
};

const saveComment = async (data: any) => {
  try {
    const newData = await prisma.comments.create({
      data,
      include: {
        announcement: true,
        classes: true,
        user: true,
      },
    });

    return newData;
  } catch (error) {
    console.error('Error saving Comment data: ', error);
    return null;
  }
};

const deleteComment = async (commentId: string) => {
  try {
    await prisma.comments.delete({
      where: {
        commentId,
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting Comment data: ', error);
    return false;
  }
};

const updateComment = async (commentId: string, data: any) => {
  try {
    const { commentId: _, ...dataToUpdate } = data;

    const updatedComment = await prisma.comments.update({
      where: {
        commentId,
      },
      data: {
        ...dataToUpdate,
        updatedAt: new Date(),
      },
      include: {
        announcement: true,
        classes: true,
        user: true,
      },
    });

    return updatedComment;
  } catch (error) {
    console.error('Error updating Comment data: ', error);
    return false;
  }
};

const getComment = async (commentId: string): Promise<any | null> => {
  try {
    const comment = await prisma.comments.findUnique({
      where: {
        commentId,
      },
      include: {
        announcement: true,
        classes: true,
        user: true,
      },
    });

    if (!comment) {
      console.error('Comment data not found.');
      return null;
    }

    return comment;
  } catch (error) {
    console.error('Error retrieving Comment data: ', error);
    return null;
  }
};

const getComments = async (announcementId: string): Promise<any[] | []> => {
  try {
    const comments = await prisma.comments.findMany({
      where: {
        announcementId: announcementId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        announcement: true,
        classes: true,
        user: true,
      },
    });

    return comments;
  } catch (error) {
    console.error('Error retrieving Comments data: ', error);
    return [];
  }
};

export { saveComment, deleteComment, updateComment, getComment, getComments, fetchCommentIds };
