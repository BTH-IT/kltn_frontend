export * from './session';
export * from './sidebar';
export * from './dropdown';
export * from './schema';
export * from './user';
export * from './classes';
export * from './subject';
export * from './role';
export * from './comment';
export * from './announcement';
export * from './assignment';
export * from './attachment';
export * from './score-structure';

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface MetaLinkData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface IBaseModel {
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
}
