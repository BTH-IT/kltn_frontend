import { IBaseModel } from '.';

export interface IUser extends IBaseModel {
  id: string;
  avatar: string | null;
  userName: string;
  fullName: string;
  doB: Date;
  gender: string;
  customId: string;
  avatar: string;
  userType: number;
  userName: string;
  email: string;
  phoneNumber: string;
}
