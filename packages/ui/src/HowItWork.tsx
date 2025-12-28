'use client';
import { JSX, useEffect, useState, useRef } from "react";

interface SlideData {
  title: string;
  description: string;
  image: string;
}

function HowItWork(): JSX.Element {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [slideShow, setSlideShow] = useState<boolean>(false); // Start with slideshow inactive
    const [progress, setProgress] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false); // Track visibility
    const componentRef = useRef<HTMLDivElement>(null); // Reference to the component
    const slideInterval: number = 5000; // 5 seconds per slide
    
    const data: SlideData[] = [
        {
            title: "Enter Your Topic",
            description: "Simply type in any subject you want to learn more about. Our AI accepts any topic, from broad categories to specific concepts.",
            image: '/TopicEnter.png',
        },
        {
            title: "Take the Quiz",
            description: "Answer the AI-generated questions tailored to your topic.",
            image: '/QuizImage.png',
        },
        {
            title: "Get Personalized Results",
            description: "Receive detailed analytics on your performance.",
            image: '/Analysis.png',
        }
    ];

    // Set up Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // When the component enters the viewport
                if (entries[0]?.isIntersecting) {
                    setIsVisible(true);
                    setSlideShow(true);
                } else {
                    setIsVisible(false);
                    setSlideShow(false);
                }
            },
            { threshold: 0.2 } // Trigger when 20% of the component is visible
        );

        // Start observing the component
        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        // Clean up the observer when component unmounts
        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        let progressInterval: NodeJS.Timeout | null = null;

        if (slideShow && isVisible) {
            // Reset progress when slide changes
            setProgress(0);
            
            // Progress bar animation
            progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 0;
                    return prev + 1;
                });
            }, slideInterval / 100);
            
            // Slide change interval
            interval = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % data.length);
            }, slideInterval);
        }

        return () => {
            if (interval) clearInterval(interval);
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [slideShow, currentIndex, data.length, isVisible]);

    function clickHandler(index: number): void {
        setCurrentIndex(index);
        setProgress(0);
        setSlideShow(false);
        
        // Small delay to reset the slideshow
        setTimeout(() => {
            setSlideShow(true);
        }, 100);
    }

    return (
        <div className="mt-20 pt-3" id="howitworks" ref={componentRef}>
            <div className="flex flex-col items-center gap-4">
                <div className="text-3xl sm:text-4xl text-center font-bold text-purple-600">How It Works</div>
                <div className="w-full sm:w-3/4 md:w-2/3 text-center text-balance sm:text-lg">
                    Go from topic to personalized learning in three simple steps
                </div>
                <div className="w-full flex flex-col items-center">
                    <div className="w-full sm:w-3/4 md:w-2/3 rounded-lg border-4 border-purple-300 overflow-hidden">
                        {/* Image container with transitions */}
                        <div className="relative overflow-hidden rounded-lg rounded-b-none">
                            {data.map((item, index) => (
                                <div
                                    key={index}
                                    className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${
                                        index === currentIndex 
                                            ? "opacity-100 translate-x-0 z-10" 
                                            : index < currentIndex 
                                                ? "opacity-0 -translate-x-full z-0" 
                                                : "opacity-0 translate-x-full z-0"
                                    }`}
                                    style={{ position: index === currentIndex ? 'relative' : 'absolute' }}
                                >
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-auto object-cover rounded-lg rounded-b-none"
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {/* Text content without transitions */}
                        <div className="w-full flex flex-col items-center gap-2 bg-purple-300 rounded p-4 rounded-t-none">
                            <div className="text-xl font-bold mt-2 text-center">
                                {data[currentIndex]?.title}
                            </div>
                            <div className="w-4/5 text-center text-md font-medium">
                                {data[currentIndex]?.description}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 w-full sm:w-3/4 md:w-2/3 justify-center">
                        {data.map((_, index) => (
                            <div 
                                key={index} 
                                className="relative cursor-pointer w-1/3 h-3 rounded-full mx-1 bg-gray-400 overflow-hidden"
                                onClick={() => clickHandler(index)}
                            >
                                {/* Progress indicator inside the bar */}
                                {index === currentIndex && (
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-100 ease-linear"
                                        style={{ width: `${progress}%` }}
                                    />
                                )}

                                {/* Full color for non-active slides */}
                                {index !== currentIndex && (
                                    <div 
                                        className={`absolute top-0 left-0 h-full w-full ${
                                            index === currentIndex ? 'bg-purple-600' : ''
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HowItWork;