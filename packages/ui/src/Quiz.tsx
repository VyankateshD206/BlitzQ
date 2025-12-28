'use client';

import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { getSession } from "next-auth/react"
import { useAtom } from "jotai";
import { quizState } from "./store/atom";
import { useRouter } from "next/navigation";
import { QuizSkeleton } from "./Skeleton";
import { analysis, answerRequest } from "@repo/types/index";
import Loading from "./Loading";
import DrawTimeChart from "./DrawTimeChart";
import { formatTime } from "./utils/formatTime";

function Quiz({quizId} : {quizId: string}) {
    const [quiz, setQuiz] = useAtom(quizState)
    const [expand, setExpand] = useState<boolean[]>([])
    const [loading, setLoading] = useState(true)
    const [quizIndex, setQuizIndex] = useState<number>(-1)
    const [answers, setAnswers] = useState<answerRequest>([])
    const [analytics, setAnalytics] = useState<analysis | null>(null)
    const [questionStartTimes, setQuestionStartTimes] = useState<number[]>([])
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const router = useRouter()

    const fetchQuiz = async () => {
        try {
            const id = quizId
            setLoading(true)
            const session = await getSession()
            if (!session) {
                toast.error("Please log in to access the quiz.")
                router.push("/signin")
                return
            }

            const resp = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/quizzes/${id}`, {
                headers: {
                    Authorization: `Bearer ${session.user}`,
                }
            })

            if (resp && resp.data && resp.data.success) {
                setQuiz(resp.data.quiz)
                if (resp.data.quiz?.quiz?.questions?.length > 0) {
                    const questionCount = resp.data.quiz.quiz.questions.length;
                    setExpand(new Array(questionCount).fill(false))
                    if (resp.data.quiz.submitted) {
                        setAnswers(resp.data.quiz.answer.answer)
                        setAnalytics(resp.data.quiz.answer)
                    } else {
                    setAnswers(new Array(questionCount).fill({ answer: null, isCorrect: false, timeTaken: 0 }))
                    
                    // Initialize start times for all questions
                    const startTimes = new Array(questionCount).fill(0);
                    startTimes[0] = Date.now(); // Set start time for first question
                    setQuestionStartTimes(startTimes);
                    }
                    
                    setQuizIndex(0)
                } else {
                    throw new Error("No questions found in the quiz")
                }
            } else if (resp && resp.data && !resp.data.success) {
              throw new Error(resp.data.message)
            } else {
              throw new Error('Failed to fetch the quiz')
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(error.response.data?.message || error.response.data?.error || `Failed to fetch the quiz`)
                } else {
                    toast.error("Failed to fetch the quiz")
                }
            } else {
                toast.error(error.message || "Some error occured")
            }
            router.push("/quiz")
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (answer: string) => {
        if (!quiz || !quiz.quiz || !quiz.quiz.questions || quiz.quiz.questions.length === 0) return
        if (quizIndex < 0 || quizIndex >= quiz.quiz.questions.length) return
        if (!quiz.quiz.questions[quizIndex]?.correct_answer) return
        
        const correctAnswer = quiz.quiz.questions[quizIndex].correct_answer
        const isCorrect = answer === correctAnswer
        
        if (!isCorrect) {
            setExpand((prev) => prev.map((e, i) => (i === quizIndex ? true : e)))
        }
        
        // Calculate time taken for this question
        const currentTime = Date.now();
        const startTime = questionStartTimes[quizIndex] || 0;
        const timeTaken = Math.floor((currentTime - startTime) / 1000);
        
        const newAnswers = [...answers];
        newAnswers[quizIndex] = { answer, isCorrect, timeTaken };
        setAnswers(newAnswers);
    }

    const handleNavigation = (newIndex: number) => {
        // Set the start time for the new question if it hasn't been set
        setQuestionStartTimes(prev => {
            const newStartTimes = [...prev];
            // Only set the start time if this question hasn't been started yet
            if (newStartTimes[newIndex] === 0) {
                newStartTimes[newIndex] = Date.now();
            }
            return newStartTimes;
        });
        
        setQuizIndex(newIndex);
    }

    useEffect(() => {
        setQuiz(null);
        fetchQuiz()
    }, [quizId])

    const unansweredQuestions = useMemo(() => {
        return answers.filter((e) => e.answer === null).length
    }, [answers])

    const answeredQuestions = useMemo(() => {
        return answers.filter((e) => e.answer !== null).length
    }, [answers])

    const handleSubmitQuiz =  async() => {
        try {
            setSubmitLoading(true)
            const session = await getSession()
            if (!session) {
                toast.error("Please log in to access the quiz.")
                router.push("/signin")
                return
            }

            const id = quizId
            const resp = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/quizzes/${id}`, {
                answer: answers
            }, {
                headers: {
                    Authorization: `Bearer ${session.user}`,
                }
            })

            if (resp && resp.data && resp.data.success) {
                setQuiz(resp.data.quiz)
                setAnswers(resp.data.quiz.answer.answer)
                setAnalytics(resp.data.quiz.answer)
                setQuizIndex(0)
                setExpand(new Array(resp.data.quiz.quiz.questions.length).fill(false))
                toast.success("Quiz submitted successfully")
            } else if (resp && resp.data && !resp.data.success) {
              throw new Error(resp.data.message)
            } else {
              throw new Error('Failed to submit the quiz')
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(error.response.data?.message || error.response.data?.error || `Failed to submit the quiz`)
                } else {
                    toast.error("Failed to submit the quiz")
                }
            } else {
                toast.error(error.message || "Some error occured")
            }
        } finally {
            setSubmitLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center overflow-y-auto p-1">
            {loading ? <QuizSkeleton/> :
            quiz && quiz.quiz && quiz.quiz?.questions?.length > 0  && quiz.quiz.questions[quizIndex] ?

              <div className="w-full h-full p-2 flex flex-col justify-center items-center sm:w-3/4 sm:p-0 relative" key={`quiz-${quizId || ''}-question-` + quizIndex}>
                { (!quiz.submitted) ? <div className="w-full flex items-center gap-4">
                    <div className="flex justify-center">
                        <button className="bg-purple-600 rounded-full w-max p-1 text-white invisible">
                            <ArrowLeft />
                        </button>
                    </div>
                    <div className="flex-grow h-full">
                        <div className="flex items-center gap-3 w-full">
                            <div className="h-[7px] rounded-full flex-grow bg-gray-200">
                                <div className={`h-full rounded-full bg-purple-600`} style={{ width: `${(answeredQuestions / quiz.quiz.questions.length) * 100}%` }}>
                                </div>
                            </div>
                            <div className="text-slate-700 font-medium">
                                {unansweredQuestions} left
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-purple-600 rounded-full w-max p-1 text-white invisible">
                            <ArrowRight />
                        </button>
                    </div>
                </div> : <></>}
                <div className="w-full flex items-center gap-4 max-h-[60vh] mt-3">
                    <div className="flex justify-center">
                        <button className="bg-purple-600 rounded-full w-max p-1 text-white disabled:opacity-50 disabled:cursor-not-allowed " disabled={quizIndex === 0} onClick={() => handleNavigation(quizIndex - 1)}>
                            <ArrowLeft />
                        </button>
                    </div>
                    <div className="flex-grow h-full overflow-y-auto ring-2 ring-purple-500/50 rounded-xl p-4 ">
                        <div className="text-black font-bold text-2xl break-words w-full">
                            {quiz.quiz.questions[quizIndex].question}
                        </div>
                        <div className="w-full mt-4 font-medium">
                            { quiz.quiz.questions[quizIndex]?.options.map((o, index) => <button className={` p-2 text-left rounded-lg mt-3 w-full break-words shadow-sm hover:shadow-inner transition-all disabled:cursor-not-allowed ${answers[quizIndex]?.answer ? answers[quizIndex].answer === o && answers[quizIndex].isCorrect ? "bg-green-600 text-white" : answers[quizIndex].answer === o && !answers[quizIndex].isCorrect ? "bg-red-600 text-white" : o === quiz?.quiz?.questions[quizIndex]?.correct_answer ? "bg-green-600 text-white" : "bg-purple-200 hover:bg-purple-300" : "bg-purple-200 hover:bg-purple-300"}`} key={`quiz-${quizId || ''}-question-${quizIndex}-option-` + index} onClick={() => handleAnswer(o)} disabled={(answers[quizIndex]?.answer !== null)}>
                                {o}
                            </button> )}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-purple-600 rounded-full w-max p-1 text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled={quizIndex === quiz.quiz.questions.length - 1} onClick={() => handleNavigation(quizIndex + 1)}>  
                            <ArrowRight />
                        </button>
                    </div>
                </div>
                <div className="w-full flex items-center gap-4">
                    <div className="flex justify-center">
                        <button className="bg-purple-600 rounded-full w-max p-1 text-white invisible">
                            <ArrowLeft />
                        </button>
                    </div>
                    <div className="flex-grow bg-slate-200 cursor-pointer p-2 rounded-lg mt-3 h-auto max-h-[20vh] overflow-y-auto">
                    <div className="flex justify-between items-center font-medium"  onClick={() => setExpand((prev) => prev.map((e, i) => (i === quizIndex ? !e : e)))}>
                        <div>Detailed Explanation</div>
                        <div className="flex items-center">
                            <button>
                                {
                                    (expand[quizIndex]) ? <ChevronUp /> : <ChevronDown />
                                }
                            </button>
                        </div>
                    </div>
                    <div
                        className={`w-full text-sm overflow-hidden transition-all duration-300 ease-in-out 
            ${expand[quizIndex] ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}
                    >
                        {quiz.quiz.questions[quizIndex].explanation}
                    </div>
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-purple-600 rounded-full w-max p-1 text-white invisible">
                            <ArrowRight />
                        </button>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center gap-4 mt-3">
                    { (!quiz.submitted) ? <button className="bg-purple-600 rounded-full font-medium w-max p-2 px-3 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmitQuiz} disabled={answeredQuestions !== quiz.quiz.questions.length}>
                        <div className="w-full flex items-center justify-center">
                            {(submitLoading) ? 
                                <div className="flex justify-center items-center"><Loading color="white"/></div> : <></>}
                            <div>
                                Submit Quiz
                            </div>
                        </div>
                    </button>
                    : 
                    <></>
                            
                }
                </div>

            { analytics ? <div className="w-full mt-4 mb-4">
            <div className="text-2xl font-bold text-center">Analytics</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="bg-white p-4 rounded-lg shadow shadow-purple-100 ring-1 ring-purple-500/50">
                <div className="text-gray-500">Total Time Taken</div>
                <div className="font-bold">{formatTime(analytics?.totalTime || 0)}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow shadow-purple-100 ring-1 ring-purple-500/50">
                <div className="text-gray-500">Average Time Spent per question</div>
                <div className="font-bold">{formatTime(analytics?.avgTime || 0)}</div>
              </div>
              <div className="col-span-1 md:col-span-2 h-[300px] bg-white p-4 rounded-lg shadow shadow-purple-100 ring-1 ring-purple-500/50">
                <div className="text-gray-500">Time Spent on each question</div>
                <div className="py-4 h-full">
                    <DrawTimeChart chartData={answers}/>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow shadow-purple-100 ring-1 ring-purple-500/50">
                <div className="text-gray-500">Correct Answers</div>
                <div className="font-bold">
                  {analytics?.correctAnswers || 0} / {quiz.quiz.questions.length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow shadow-purple-100 ring-1 ring-purple-500/50">
                <div className="text-gray-500">Incorrect Answers</div>
                <div className="font-bold">
                  {analytics?.wrongAnswers || 0} / {quiz.quiz.questions.length}
                </div>
              </div>
            </div>
            {analytics && analytics.strongTopics && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow shadow-purple-100 ring-1 ring-purple-500/50">
                <div className="font-medium">Strong Topics</div>
                { (analytics.strongTopics.length) ? <div className="flex flex-wrap gap-2 mt-2">
                  {analytics.strongTopics.map((e, index) => (
                    <div
                      key={index}
                      className="text-sm bg-green-100 text-green-800 rounded-full p-1 px-3"
                    >
                      {e}
                    </div>
                  ))}
                </div>
                : <div className="text-sm text-gray-500">No strong topics</div>}
              </div>
            )}
            {analytics && analytics.weakTopics && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow shadow-purple-100 ring-1 ring-purple-500/50">
                <div className="font-medium">Weak Topics</div>
                { (analytics.weakTopics.length) ? <div className="flex flex-wrap gap-2 mt-2">
                  {analytics.weakTopics.map((e, index) => (
                    <div
                      key={index}
                      className="text-sm bg-red-100 text-red-800 rounded-full p-1 px-3"
                    >
                      {e}
                    </div>
                  ))}
                </div>
                : <div className="text-sm text-gray-500">No weak topics</div>}    
              </div>
            )}
          </div> : <></>}
        </div>
             : <div className="w-full h-full flex justify-center items-center">No quiz found</div>}
        </div>
    )
}

export default Quiz