import { prisma } from '../prisma';

const fetchRoleIds = async () => {
  try {
    const roles = await prisma.roles.findMany({
      select: {
        roleId: true,
      },
    });

    return roles.map(({ roleId }) => roleId);
  } catch (error) {
    console.error('Error checking permission: ', error);
    return [];
  }
};

const saveRole = async (data: any) => {
  try {
    const role = await prisma.roles.create({
      data,
    });

    return role;
  } catch (error) {
    console.error('Error saving role data: ', error);
    return null;
  }
};

const deleteRole = async (roleId: string) => {
  try {
    await prisma.roles.delete({
      where: {
        roleId,
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting role data: ', error);
    return false;
  }
};

const updateRole = async (roleId: string, data: any) => {
  try {
    const updatedRole = await prisma.roles.update({
      where: {
        roleId,
      },
      data: {
        desc: data.desc,
      },
    });

    return updatedRole;
  } catch (error) {
    console.error('Error updating role data: ', error);
    return false;
  }
};
export { saveRole, deleteRole, updateRole, fetchRoleIds };
