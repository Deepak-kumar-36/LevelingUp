import { z } from 'zod';

export const questSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['binary', 'count', 'time', 'progress']),
  target: z.number().min(1),
  unit: z.string().optional(),
  xpReward: z.number().min(0),
  coinReward: z.number().min(0),
  statGains: z.record(z.string(), z.number()),
  isActive: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'once']),
});

export const foodLogSchema = z.object({
  id: z.string().min(1),
  date: z.string(),
  foodName: z.string().min(1),
  calories: z.number().min(0),
  protein: z.number().min(0),
});

export const expenseSchema = z.object({
  id: z.string().min(1),
  date: z.string(),
  amount: z.number().min(0),
  category: z.string().min(1),
  description: z.string(),
});
