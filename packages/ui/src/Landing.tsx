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
                <div className="flex flex-col items-center gap-6">
                    <div className="flex text-white items-center gap-2 rounded-full bg-gradient-to-r from-purple-900 to-purple-500 w-max p-2 px-3">
                        <div>
                            <Sparkles />
                        </div>
                        <div className="font-medium">
                            AI - Powered Learning
                        </div>
                    </div>
                    <div className="text-4xl sm:text-5xl font-bold text-purple-600 text-center">
                        BlitzQ Your Learning
                    </div>
                    <div className="w-[90%] sm:w-[70%] text-center sm:text-lg text-balance">
                        Enter any topic and get instant, personalized quizzes and receive detailed analytics to enhance your learning.
                    </div>
                    <div>
                       <GetStartedBtn/>
                    </div>
                    <VideoPlayer/>
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