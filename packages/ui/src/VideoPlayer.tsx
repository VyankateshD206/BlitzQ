'use client'
import { Play } from "lucide-react";
import { useRef, useState } from "react";

function VideoPlayer() {
    const [videoPlay, setVideoPlay] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    function playVideo() {
        setVideoPlay(true);
        if (videoRef?.current) {
            videoRef.current.play();
        }
    }
    return(
        <div className="h-[400px] flex justify-center items-center w-[90%] sm:w-[60%] relative overflow-hidden rounded-xl">
                        <div>
                            <video src="/demo.mp4" muted className="rounded-xl w-full h-full object-cover" ref={videoRef} autoPlay={videoPlay} loop={videoPlay}/>
                        </div>
                        {(!videoPlay) ? <div className="w-full h-full absolute p-4 top-0 left-0 right-0 bottom-0 cursor-pointer flex justify-center items-center group hover:bg-black/20 transition-all duration-300">
                            <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-900 to-purple-500 w-max p-3 text-white shadow shadow-black group-hover:scale-125 transition-all duration-300" onClick={playVideo}>
                                <Play
                                  fill="white"
                                  size={30}
                                />
                            </div>
                        </div> : null}
                    </div>
    )
}

export default VideoPlayer;