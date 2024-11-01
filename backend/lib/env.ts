import { z } from 'zod'

const EnvSchema = z.object({
  SITE_NAME: z.string(),
  PORT: z.coerce.number().int().default(3000),
  DB_PROVIDER: z.string(),
  DB_HOST: z.string().optional().optional(),
  DB_FILE: z.string().optional(),
  DB_PORT: z.coerce.number().int().optional(),
  DB_NAME: z.string(),
  DB_USER: z.string().optional(),
  DB_PASS: z.string().optional()
})

export type env = z.infer<typeof EnvSchema>

const { data: env, error } = EnvSchema.safeParse(process.env)

if (error) {
  console.error('Invalid env:')
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

// biome-ignore lint/style/noNonNullAssertion: cannot be null
export default env!
