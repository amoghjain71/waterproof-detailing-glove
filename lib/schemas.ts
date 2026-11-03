import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email(),
  size: z.enum(["S", "M", "L", "XL"]).optional(),
  source: z.string().max(80).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  topic: z.string().max(60).optional(),
  message: z.string().min(5).max(5000),
});

export const checkoutCustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  phone: z.string().max(40).optional(),
  address: z.object({
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postalCode: z.string().min(3).max(20),
    country: z.string().min(2).max(2),
  }),
});

export const cartItemSchema = z.object({
  sku: z.string(),
  size: z.enum(["S", "M", "L", "XL"]),
  qty: z.number().int().positive().max(20),
  price: z.number().positive(),
});

export const checkoutRequestSchema = z.object({
  customer: checkoutCustomerSchema,
  cart: z.array(cartItemSchema).min(1),
  waitlistEmail: z.string().email().optional(),
});
