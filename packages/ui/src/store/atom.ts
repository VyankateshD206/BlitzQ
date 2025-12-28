import { atom } from "jotai";
import { quizResponse, quizList, userProfile } from "@repo/types/index"

export const profileState = atom<userProfile | null>(null)
export const quizListState = atom<quizList[]>([])
export const quizState = atom<quizResponse | null>(null)