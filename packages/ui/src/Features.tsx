import { ChartPie, GraduationCap, Notebook, SlidersVertical, Zap } from "lucide-react";

function Features() {
    return (
        <div className="mt-[50px] pt-[10px]" id="features">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-3xl sm:text-4xl text-center font-bold text-purple-600">Features</div>
                    <div className="w-[90%] sm:w-[70%] text-center sm:text-lg text-balance">
                        Our AI-powered quiz platform enhances your learning experience with personalized assessments and insightful analytics.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="w-full bg-purple-300 rounded-lg p-4">
                            <div className="bg-purple-200 rounded-xl p-2 w-max">
                                <GraduationCap />
                            </div>
                            <div className="text-lg font-bold mt-2">
                                AI - Generated Quizzes
                            </div>
                            <div>
                                Our advanced AI creates personalized quizzes on any topic you choose. Perfect for testing knowledge or preparing for exams.
                            </div>
                        </div>
                        <div className="w-full bg-purple-300 rounded-lg p-4">
                            <div className="bg-purple-200 rounded-xl p-2 w-max">
                                <ChartPie />
                            </div>
                            <div className="text-lg font-bold mt-2">
                                Detailed Analytics
                            </div>
                            <div>
                                Track your performance with comprehensive statistics. Identify strengths and areas for improvement at a glance.
                            </div>
                        </div>
                        <div className="w-full bg-purple-300 rounded-lg p-4">
                            <div className="bg-purple-200 rounded-xl p-2 w-max">
                                <Zap />
                            </div>
                            <div className="text-lg font-bold mt-2">
                                Instant Feedback
                            </div>
                            <div>
                                Receive immediate answers and explanations after each question. Understand why your answers were right or wrong.
                            </div>
                        </div>
                        <div className="w-full bg-purple-300 rounded-lg p-4">
                                <div className="bg-purple-200 rounded-xl p-2 w-max">
                                    <SlidersVertical />
                                </div>
                                <div className="text-lg font-bold mt-2">
                                    Customizable Difficulty
                                </div>
                                <div>
                                    Set your preferred difficulty level from easy to hard or mix of all. Gradually increase challenge as your knowledge improves.
                                </div>
                            </div>
                    </div>
                </div>
            </div>
    )
}

export default Features;