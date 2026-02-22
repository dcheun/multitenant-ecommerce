import { headers as getHeaders } from 'next/headers'

import { stripe } from '@/lib/stripe'
import { loginSchema, registerSchema } from '@/modules/auth/schema'
import { generateAuthCookie } from '@/modules/auth/utils'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()
    const session = await ctx.db.auth({ headers })

    return session
  }),
  register: baseProcedure.input(registerSchema).mutation(async ({ input, ctx }) => {
    // Check for existing user.
    const existingUser = await ctx.db.find({
      collection: 'users',
      limit: 1,
      where: {
        username: {
          equals: input.username,
        },
      },
    })

    if (existingUser.docs.length > 0) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username already exists',
      })
    }

    const account = await stripe.accounts.create({})

    if (!account) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to create Stripe account',
      })
    }

    const tenant = await ctx.db.create({
      collection: 'tenants',
      data: {
        name: input.username,
        slug: input.username,
        stripeAccountId: account.id,
      },
    })

    await ctx.db.create({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password, // This will be hashed - payload handles this
        username: input.username,
        tenants: [
          {
            tenant: tenant.id,
          },
        ],
      },
    })

    const data = await ctx.db.login({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password,
      },
    })

    if (!data.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      })
    }

    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    })
  }),

  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.db.login({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password,
      },
    })

    if (!data.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      })
    }

    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    })

    return data
  }),

  // logout: baseProcedure.mutation(async () => {
  //   const cookies = await getCookies()
  //   cookies.delete(AUTH_COOKIE)
  // }),
})
