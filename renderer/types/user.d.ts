import { IBaseModel } from '.';

export interface IUser extends IBaseModel {
  id: string;
  fullName: string;
  doB: Date;
  gender: number;
  customId: string;
  avatar: string;
  userType: number;
  userName: string;
  email: string;
  phoneNumber: string;
}
