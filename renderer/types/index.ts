export * from './session';
export * from './sidebar';
export * from './dropdown';
export * from './schema';
export * from './user';
export * from './course';
export * from './subject';
export * from './project';
export * from './role';
export * from './comment';
export * from './announcement';
export * from './attachment';
export * from './group';
export * from './group-member';
export * from './score-structure';
export * from './assignment';
export * from './report';
export * from './submission';
export * from './score';
export * from './brief';
export * from './transcript';

export interface ApiResponse<T> {
  message?: string;
  data: T;
  statusCode: number;
}

export interface MetaLinkData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface IBaseModel {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
