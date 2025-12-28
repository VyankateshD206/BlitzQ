import { JwtPayload } from "jsonwebtoken"
import {z} from "zod"
import { type DrizzleClient } from "@repo/db/src/index"
import { type client } from "@repo/ai/src/index"
import { type KVNamespace } from "@cloudflare/workers-types"

export const signInSchema = z.object({
    email: z.string(),
    provider: z.enum(['credential', 'google']),
    password: z.string().min(8).optional(),
    profileImg: z.string().optional()
})

export const userProfileSchema = z.object({
    id: z.string(),
    email: z.string(),
    quota: z.number(),
    tier: z.enum(['free', 'pro']),
    profileImg: z.string().optional(),
})

export const questionSchema = z.object({
    question:  z.string(),
    options: z.array(z.string()),
    correct_answer: z.string(),
    explanation: z.string(),
    sub_topic: z.string()
})

export const quizSchema = z.object({
    questions: z.array(questionSchema),
    topic: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'mix'])
})
export const quizResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    submitted: z.boolean(),
    userId: z.string(),
    answer: z.string().optional(),
    quiz: quizSchema
})
export const newQuizRequestSchema = z.object({
    topic: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'mix'])
})
export const quizListSchema = z.object({
    id: z.string(),
    title: z.string()
})
export const answerRequestSchema = z.array(z.object({
    answer: z.string(),
    isCorrect: z.boolean(),
    timeTaken: z.number()
}))
export const answerSchema = z.object({
    answer: answerRequestSchema,
    totalTime: z.number(),
    avgTime: z.number(),
    correctAnswers: z.number(),
    wrongAnswers: z.number(),
    weakTopics: z.array(z.string()),
    strongTopics: z.array(z.string())
})
export const analysisSchema = z.object({
    totalTime: z.number(),
    avgTime: z.number(),
    correctAnswers: z.number(),
    wrongAnswers: z.number(),
    weakTopics: z.array(z.string()),
    strongTopics: z.array(z.string())
})

export type analysis = z.infer<typeof analysisSchema>
export type answer = z.infer<typeof answerSchema>
export type answerRequest = z.infer<typeof answerRequestSchema>
export type quizList = z.infer<typeof quizListSchema>
export type difficulty = 'easy' | 'medium' | 'hard' | 'mix'
export type newQuizRequest = z.infer<typeof newQuizRequestSchema>
export type question = z.infer<typeof questionSchema>
export type quiz = z.infer<typeof quizSchema>
export type quizResponse = z.infer<typeof quizResponseSchema>
export type signIn = z.infer<typeof signInSchema>
export type userProfile = z.infer<typeof userProfileSchema>
export type DbEnv = {
    DATABASE_URL: string;
};

export type Bindings = {
    JWT_SECRET: string;
    LEMON_SQUEEZY_API_KEY: string;
    LEMON_SQUEEZY_API_URL: string;
    LEMON_SQUEEZY_WEBHOOK_SIGNATURE: string;
    PRO_VARIANT_ID: string;
    STORE_ID: string;
    DATABASE_URL: string;
    OPENAI_API_KEY: string;
    GEMINI_API_KEY: string;
    blitzq_kv: KVNamespace;
    BASE_URL: string;
}

export type Variables = {
    user: JwtPayload
    db: DrizzleClient
    ai: client
}