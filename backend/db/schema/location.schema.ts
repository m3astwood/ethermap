import z from 'zod'

export const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})
