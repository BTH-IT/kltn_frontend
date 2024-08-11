import { ZodTypeAny } from 'zod';

export type SettingsSchema = {
  [key: string]: ZodTypeAny;
};
