import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  role: z.enum(['Admin', 'Editor', 'Viewer']),
})

export type UserFormValues = z.infer<typeof userSchema>
