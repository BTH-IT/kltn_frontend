import * as z from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái viết thường')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một số')
  .regex(/[#!@$%^&*-]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (#?!@$%^&*-)');

export const signUpSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: passwordSchema,
});

export type SignUpFormInputs = z.infer<typeof signUpSchema>;
