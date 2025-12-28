import { Sparkles } from "lucide-react";
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
                <div className="flex flex-col items-center gap-6 text-center motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
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
                    <div className="text-4xl sm:text-6xl font-extrabold text-slate-900 text-balance">
                        BlitzQ — Master Any Topic at Lightning Speed
                    </div>
                    <div className="w-[90%] sm:w-[70%] sm:text-lg text-balance text-slate-700">
                        Generate smart quizzes instantly, learn faster, and track your progress in minutes.
                    </div>
                    <div>
                       <GetStartedBtn className="btn-gradient rounded-full px-5 py-2" ariaLabel="Get started"/>
                    </div>
                    <div className="w-full flex justify-center">
                        <div className="w-full max-w-4xl relative">
                            <VideoPlayer/>
                        </div>
                    </div>
                </div>
            </div>
            <Features/>
            <HowItWork/>
            <Pricing/>
            <Faq/>
        </div>
    )
}

export default Landing;