import * as z from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[#!@$%^&*-]/, 'Password must contain at least one special character (#?!@$%^&*-)');

export const signUpSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: passwordSchema,
});

export type SignUpFormInputs = z.infer<typeof signUpSchema>;
