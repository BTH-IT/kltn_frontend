import { IBaseModel } from '.';

export interface IUser extends IBaseModel {
  Id: string;
  FullName: string;
  DoB: Date;
  Gender: number;
  CustomId: string;
  Avatar: string;
  UserType: number;
  UserName: string;
  Email: string;
  PhoneNumber: string;
}
