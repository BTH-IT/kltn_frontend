/* eslint-disable no-unused-vars */
import { prisma } from '../prisma';

const fetchUserIds = async () => {
  try {
    const users = await prisma.users.findMany({
      select: {
        userId: true,
      },
    });

    return users.map(({ userId }) => userId);
  } catch (error) {
    console.error('Error checking permission: ', error);
    return [];
  }
};

const checkRole = async (id: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: { userId: id },
    });

    if (!user) {
      console.error('User data not found.');
      return false;
    }

    return user.roleId;
  } catch (error) {
    console.error('Error checking permission: ', error);
    return false;
  }
};

const saveUser = async (data: any) => {
  try {
    const { userId, name, email, avatarUrl } = data; // Remove 'id' from 'data'

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (user) {
      return user;
    }

    const newUser = await prisma.users.create({
      data: {
        avatarUrl,
        studentId: '',
        name,
        userId,
        roleId: 3,
        email,
      },
    });

    return newUser;
  } catch (error) {
    console.error('Error saving user data: ', (error as any).message);
    return false;
  }
};

const deleteUser = async (userId: string) => {
  try {
    await prisma.users.delete({
      where: { userId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting user data: ', error);
    return false;
  }
};

const updateUser = async (userId: string, data: any) => {
  try {
    const { userId: _, roleId, roleName, ...dataToUpdate } = data;

    const user = await prisma.users.update({
      where: { userId },
      data: {
        ...dataToUpdate,
        updatedAt: new Date().toISOString(),
        roles: {
          connect: {
            roleId,
          },
        },
      },
      include: {
        announcements: true,
        comments: true,
        enrolledClasses: true,
        classes: true,
        assignments: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error updating user data: ', error);
    return false;
  }
};

const getUser = async (userId: string): Promise<any | false> => {
  try {
    const user = await prisma.users.findUnique({
      where: { userId },
      include: {
        roles: true,
      },
    });

    if (!user) {
      console.error('User data not found.');
      return null;
    }

    return {
      ...user,
      roleName: user.roles.name,
    };
  } catch (error) {
    console.error('Error retrieving user data: ', error);
    return null;
  }
};

const getUsers = async (): Promise<any | false> => {
  try {
    const users = await prisma.users.findMany({
      include: {
        roles: true,
      },
    });
    const usersWithRoles = users.map((user) => ({
      ...user,
      roleName: user.roles.name, // Add the role name to each user
    }));

    return usersWithRoles;
  } catch (error) {
    console.error('Error retrieving user data: ', error);
    return null;
  }
};

export { checkRole, saveUser, deleteUser, updateUser, getUser, getUsers, fetchUserIds };
