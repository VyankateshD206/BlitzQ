'use client';

import { difficulty, newQuizRequest } from "@repo/types/index";
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { getSession } from "next-auth/react"
import { useAtom, useSetAtom } from "jotai";
import { profileState, quizListState } from "./store/atom";
import LoadingMessage from "./LoadingMessage";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

function Chat() {
    const setQuizList = useSetAtom(quizListState)
    const [profile, setProfile] = useAtom(profileState)
    const [topic, setTopic] = useState("")
    const [difficulty, setDifficulty] = useState<difficulty>("easy")
    const difficulties : difficulty[] = ["easy", "medium", "hard", "mix"]
    const [loading, setLoading] = useState(false)
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const router = useRouter()
    
    const generateQuiz = async () => {
        try {
            setLoading(true)
            const session = await getSession()
            if (!session || !session.user) {
                throw new Error("Unauthorized access")
            }

            if (!topic || !topic.trim().length) {
                throw new Error("Topic is required")
            }

            const requestBody : newQuizRequest = {
                topic,
                difficulty
            }

            const jsonBody = JSON.stringify(requestBody)

            const resp = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/createQuiz`,
                jsonBody,
                {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.user}`
                }
              }
            )

            if (resp && resp.data && resp.data.success) {
                const quizData = {
                    id: resp.data.quiz.id,
                    title: resp.data.quiz.title
                }
                setQuizList( (prev) => [quizData, ...prev])
                setProfile((prev) => (prev && {...prev, quota: resp.data.quiz.quota}))
                toast.success("Quiz generated successfully")
                router.push(`/quiz/${resp.data.quiz.id}`)

            } else if (resp && resp.data && !resp.data.success) {
                throw new Error(resp.data.message)
            } else {
                throw new Error("Failed to generate quiz")
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(error.response.data?.message || error.response.data?.error || `Failed to generate quiz (${error.response.status})`)
                } else {
                    toast.error("Failed to generate quiz")
                }
            }  else {
              toast.error(error.message || "Some error occured")
            }
        } finally {
            setLoading(false)
        }
    }

    async function getCheckoutLink() {
        try {
            setCheckoutLoading(true)
            const session = await getSession()
            if (!session || !session.user) {
                throw new Error("Unauthorized access")
            }

            const resp = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getCheckoutLink`, {
                headers: {
                    'Authorization': `Bearer ${session.user}`
                }
            })

            if (resp?.data?.success && resp.data?.checkoutLink) {
                window.open(resp.data.checkoutLink, "_self")
            } else if (resp?.data && !resp.data.success) {
                throw new Error(resp.data.message)
            } else {
                throw new Error("Failed to generate checkout link")
            }
        } catch (error: any) {
            toast.error(error.message || "Some error occured")
        } finally {
            setCheckoutLoading(false)
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center p-1">
            <div className="mb-4 font-bold text-2xl sm:text-3xl text-purple-600 text-center p-2">
                What topic would you like to be quizzed on?
            </div>
            <div className="w-max max-w-[600px] mb-4">
                {
                   loading ? <LoadingMessage/> : <></>
                }
            </div>
            <div className="w-[90%] sm:w-3/4 max-w-[600px] shadow shadow-gray-200 border border-gray-300 rounded-xl p-2 relative">
                <div>
                    <textarea className="w-full outline-none resize-none p-2 rounded-xl" rows={2} placeholder="Enter the topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                    </textarea>
                </div>
                <div className="flex gap-2 sm:justify-center">
                    {
                        difficulties.map((e, index) => <div className={`text-sm sm:text-md rounded-full px-1 sm:p-1 sm:px-3 cursor-pointer border border-gray-300 ${difficulty === e ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-black hover:bg-white hover:border-purple-400 hover:text-purple-600 '}`} key={index} onClick={() => setDifficulty(e)}>
                            {e.charAt(0).toUpperCase() + e.slice(1)}
                        </div>)
                    }
                </div>
                <div className="absolute right-2 bottom-2">
                   <button className="bg-purple-600 rounded-full w-max p-1 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={generateQuiz} disabled={loading || profile?.quota === 0}>
                        <ArrowRight/>
                    </button>
                </div>
            </div>
            {(profile?.tier === 'free') ? <button className="w-max bg-slate-200 max-w-[600px] mt-4 text-sm sm:text-md text-gray-700 p-2 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-50" disabled={checkoutLoading} onClick={getCheckoutLink}>
                <div className="flex gap-2 items-center justify-center ">
                <div className="flex gap-1 items-center">
                  <div>
                      Upgrade to
                  </div>
                  <div className="bg-purple-600 text-white rounded px-1">
                      Pro
                  </div>
                </div>
                {(!checkoutLoading) ? <div className="bg-white text-purple-600 rounded-full w-[25px] h-[25px] flex items-center justify-center p-1" onClick={() => router.push("/pro")}>
                  <ArrowRight/> 
                </div> : 
                <div className="p-1">
                    <Loading color="purple-600" />
                </div>
                }
            </div></button> : <></>}
        </div>
    )
}

export default Chat