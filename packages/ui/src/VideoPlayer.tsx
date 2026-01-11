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
        <div
            className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-2xl border border-[color:var(--blitzq-border)] shadow-2xl bg-[var(--blitzq-card)]"
            style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 20px 70px rgba(47,140,255,0.18)' }}
        >
            <video
                src="/Demo.mp4"
                muted
                className="absolute inset-0 w-full h-full object-cover"
                ref={videoRef}
                autoPlay={videoPlay}
                loop={videoPlay}
            />

            {(!videoPlay) ? (
                <div className="absolute inset-0 cursor-pointer flex justify-center items-center group bg-black/10 backdrop-blur-sm hover:bg-black/20 transition-colors duration-300">
                    <div
                        className="flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--blitzq-primary)] to-[var(--blitzq-accent)] w-max p-4 text-white shadow-lg ring-1 ring-white/25 group-hover:-translate-y-0.5 transition-transform duration-300 motion-safe:animate-pulse motion-reduce:animate-none"
                        onClick={playVideo}
                    >
                        <Play fill="white" size={32} />
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default VideoPlayer;