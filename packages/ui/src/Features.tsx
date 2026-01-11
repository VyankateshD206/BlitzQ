import { ChartPie, GraduationCap, Notebook, SlidersVertical, Zap } from "lucide-react";

function Features() {
    return (
        <div className="mt-[50px] pt-[10px]" id="features">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-3xl sm:text-4xl text-center font-bold text-[var(--blitzq-primary)]">Features</div>
                    <div className="w-[90%] sm:w-[70%] text-center sm:text-lg text-balance">
                        Our AI-powered quiz platform enhances your learning experience with personalized assessments and insightful analytics.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div aria-label="AI - Generated Quizzes" className="w-full rounded-lg p-6 bg-[rgba(255,255,255,0.05)] border border-[color:rgba(47,140,255,0.28)] hover:shadow-[0_0_0_1px_rgba(47,140,255,0.18),0_18px_50px_rgba(47,140,255,0.12)] transition-shadow duration-200">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[color:rgba(47,140,255,0.22)] text-[var(--blitzq-primary)]">
                                <GraduationCap />
                            </div>
                            <div className="text-lg font-bold mt-3 text-[var(--blitzq-fg)]">
                                AI - Generated Quizzes
                            </div>
                            <div className="text-[var(--blitzq-muted)] line-clamp-1">
                                    Get instant, personalized quizzes on any topic—perfect for practice.
                            </div>
                        </div>

                        <div aria-label="Detailed Analytics" className="w-full rounded-lg p-6 bg-[rgba(255,255,255,0.05)] border border-[color:rgba(47,140,255,0.28)] hover:shadow-[0_0_0_1px_rgba(47,140,255,0.18),0_18px_50px_rgba(47,140,255,0.12)] transition-shadow duration-200">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[color:rgba(47,140,255,0.22)] text-[var(--blitzq-primary)]">
                                <ChartPie />
                            </div>
                            <div className="text-lg font-bold mt-3 text-[var(--blitzq-fg)]">
                                Detailed Analytics
                            </div>
                            <div className="text-[var(--blitzq-muted)] line-clamp-1">
                                    See clear stats, spot weak areas fast, and improve with every session.
                            </div>
                        </div>

                        <div aria-label="Instant Feedback" className="w-full rounded-lg p-6 bg-[rgba(255,255,255,0.05)] border border-[color:rgba(47,140,255,0.28)] hover:shadow-[0_0_0_1px_rgba(47,140,255,0.18),0_18px_50px_rgba(47,140,255,0.12)] transition-shadow duration-200">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[color:rgba(47,140,255,0.22)] text-[var(--blitzq-primary)]">
                                <Zap />
                            </div>
                            <div className="text-lg font-bold mt-3 text-[var(--blitzq-fg)]">
                                Instant Feedback
                            </div>
                            <div className="text-[var(--blitzq-muted)] line-clamp-1">
                                    Get answers and explanations immediately so you learn as you go.
                            </div>
                        </div>

                        <div aria-label="Customizable Difficulty" className="w-full rounded-lg p-6 bg-[rgba(255,255,255,0.05)] border border-[color:rgba(47,140,255,0.28)] hover:shadow-[0_0_0_1px_rgba(47,140,255,0.18),0_18px_50px_rgba(47,140,255,0.12)] transition-shadow duration-200">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[color:rgba(47,140,255,0.22)] text-[var(--blitzq-primary)]">
                                <SlidersVertical />
                            </div>
                            <div className="text-lg font-bold mt-3 text-[var(--blitzq-fg)]">
                                Customizable Difficulty
                            </div>
                            <div className="text-[var(--blitzq-muted)] line-clamp-1">
                                    Pick easy, hard, or mixed difficulty and level up at your pace.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Features;