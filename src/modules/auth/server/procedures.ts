import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { cookies as getCookies, headers as getHeaders } from 'next/headers'
import { AUTH_COOKIE } from '../constants'
import { loginSchema, registerSchema } from '../schema'

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

    await ctx.db.create({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password, // This will be hashed - payload handles this
        username: input.username,
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

    const cookies = await getCookies()
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: '/',
      // TODO: Ensure cross-domain cookie sharing
      // funroad.com // initial cookie
      // antonio.funroad.com // subdomain cookie - cookie does not exist here
      // sameSite: 'none',
      // domain: ''
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

    const cookies = await getCookies()
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: '/',
      // TODO: Ensure cross-domain cookie sharing
      // funroad.com // initial cookie
      // antonio.funroad.com // subdomain cookie - cookie does not exist here
      // sameSite: 'none',
      // domain: ''
    })

    return data
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies()
    cookies.delete(AUTH_COOKIE)
  }),
})
