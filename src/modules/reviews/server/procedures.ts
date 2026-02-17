import { TRPCError } from '@trpc/server'
import z from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: 'products',
        id: input.productId,
      })

      if (!product) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      }

      const reviewData = await ctx.db.find({
        collection: 'reviews',
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      })

      const review = reviewData.docs[0]

      if (!review) {
        return null
      }

      return review
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1, { message: 'Rating is required' }).max(5),
        description: z.string().min(1, { message: 'Description is required' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: 'products',
        id: input.productId,
      })

      if (!product) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      }

      const existingReview = await ctx.db.find({
        collection: 'reviews',
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      })

      if (existingReview.totalDocs > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already reviewed this product',
        })
      }

      const review = await ctx.db.create({
        collection: 'reviews',
        data: {
          user: ctx.session.user.id,
          product: product.id,
          description: input.description,
          rating: input.rating,
        },
      })

      return review
    }),

  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, { message: 'Rating is required' }).max(5),
        description: z.string().min(1, { message: 'Description is required' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.db.findByID({
        depth: 0, // existingReview.user will be the user ID
        collection: 'reviews',
        id: input.reviewId,
      })

      if (!existingReview) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Review not found' })
      }

      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to update this review',
        })
      }

      const updatedReview = await ctx.db.update({
        collection: 'reviews',
        id: input.reviewId,
        data: {
          description: input.description,
          rating: input.rating,
        },
      })

      return updatedReview
    }),
})
