import z from 'zod';

export class IRegisterValidator {
  validate() {
    return z
      .object({
        name: z
          .string({
            required_error: 'Name is required',
            invalid_type_error: 'Name should be of type string',
          })
          .max(50, { message: 'Name should have at maximum 50 characters' }),

        surname: z
          .string({
            required_error: 'Surname is required',
            invalid_type_error: 'Surname should be of type string',
          })
          .max(200, { message: 'Name should have at maximum 200 characters' }),

        email: z
          .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email should be of type string',
          })
          .email({ message: 'This is not a valid email' })
          .includes('@', { message: 'Email must include @' })
          .endsWith('.com', { message: 'Email needs to end with .com' }),

        password: z
          .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password should be of type string',
          })
          .min(8, { message: 'Password should have minimum length of 8' })
          .max(255, 'Password is too long')
          .regex(/^(?=.*[A-Z]).{8,}$/, {
            message:
              'Should Contain at least one uppercase letter and have a minimum length of 8 characters.',
          }),
        confirmPassword: z.string({
          required_error: 'Confirm Password is required',
          invalid_type_error: 'Confirm Password should be of type string',
        }),
      })
      .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
          ctx.addIssue({
            code: 'custom',
            message: 'The passwords did not match',
            path: ['confirmPassword'],
          });
        }
      });
  }
}
