import {z} from 'zod'

export const categorySchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  products: z.array(z.string({
    required_error: "Products is required",
  }).optional()),
})
