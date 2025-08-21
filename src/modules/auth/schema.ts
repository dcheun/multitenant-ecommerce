import z from 'zod'

export const registerSchema = z.object({
  email: z.email(),
  password: z.string(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(63, 'Username must be at most 63 characters long')
    .regex(
      /^[a-z0-9][a-z0-9]*[a-z0-9]$/,
      'Username must start and end with a letter or number and contain only lowercase letters, numbers, and dashes',
    )
    .refine((val) => !val.includes('--'), 'Username must not contain double dashes')
    .transform((val) => val.toLowerCase()),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
})
