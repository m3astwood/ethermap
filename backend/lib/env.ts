import { z } from 'zod'
import 'dotenv/config'

const EnvSchema = z
  .object({
    NODE_ENV: z.string().optional(),
    SITE_NAME: z.string().optional(),
    PORT: z.coerce.number().int().default(3000).optional(),
    DB_HOST: z.string().optional(),
    DB_PORT: z.coerce.number().int().optional(),
    DB_NAME: z.string().optional(),
    DB_USER: z.string().optional(),
    DB_PASS: z.string().optional(),
    LOG_LEVEL: z.enum(['info', 'warn', 'error', 'fatal', 'silent']).optional(),
    SENTRY_DSN: z.string(),
  })
  .superRefine((data, context) => {
    if (data.NODE_ENV === 'test') {
      return
    } else {
      const requiredFields = ['SITE_NAME', 'PORT', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS']

      requiredFields.forEach((field) => {
        if (data[field] === undefined || data[field] === null) {
          context.addIssue({
            code: 'custom',
            message: `${field} is required when NODE_ENV is not test`,
            path: [field],
          })
        }
      })
    }
  })

export type env = z.infer<typeof EnvSchema>

const { data: env, error } = EnvSchema.safeParse(process.env)

if (error) {
  console.error('Invalid env:')
  console.error(JSON.stringify(z.treeifyError(error).properties, null, 2))
  process.exit(1)
}

// biome-ignore lint/style/noNonNullAssertion: cannot be null
export default env!
