"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import HorizontalNav from "./HorizontalNav";
import Features from "./Features";
import HowItWork from "./HowItWork";
import Pricing from "./Pricing";
import Faq from "./Faq";
import GetStartedBtn from "./GetStartedBtn";
import VideoPlayer from "./VideoPlayer";

function Landing() {
    return (
        <div className="w-[90%] sm:w-[80%]">
            <HorizontalNav />
            <div className="mt-[80px]">
                <motion.div
                    className="flex flex-col items-center gap-6 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                >
                    <div
                        className="flex items-center gap-2 rounded-full w-max px-4 py-2 text-white text-sm font-medium glow-accent"
                        style={{
                            backgroundImage:
                                'linear-gradient(90deg,var(--blitzq-primary),var(--blitzq-accent))',
                        }}
                    >
                        <Sparkles className="h-4 w-4" />
                        <div>AI - Powered Learning</div>
                    </div>
                    <div
                        className="text-4xl sm:text-6xl font-extrabold text-white text-balance"
                        style={{ textShadow: "0 0 18px rgba(47,140,255,0.22)" }}
                    >
                        BlitzQ — Master Any Topic at Lightning Speed
                    </div>
                    <div className="w-[90%] sm:w-[70%] sm:text-lg text-balance text-[var(--blitzq-muted)]">
                        Generate smart quizzes instantly, learn faster, and track your progress in minutes.
                    </div>
                    <div>
                              <GetStartedBtn className="btn-gradient glow-accent rounded-full px-5 py-2 hover:shadow-[0_14px_40px_rgba(47,140,255,0.22)] hover:-translate-y-[1px] hover:scale-[1.02]" ariaLabel="Get started"/>
                    </div>
                    <div className="mt-16 w-full flex flex-col items-center">
                        <VideoPlayer/>
                    </div>
                </motion.div>
            </div>
            <Features/>
            <HowItWork/>
            <Pricing/>
            <Faq/>
        </div>
    )
}

export default Landing;