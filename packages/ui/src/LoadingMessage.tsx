import { useEffect, useState } from "react";
import Loading from "./Loading";

function LoadingMessage() {
  const messages = [
    "Booting up the brain cells...",
    "Searching for quiz magic...",
    "Packing questions into boxes...",
    "Calibrating answer accuracy...",
    "Adding witty comments...",
    "Encrypting quiz secrets...",
    "Finalizing quiz structure...",
    "Ready to roll!"
  ];

  const [messageIndex, setMessageIndex] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => {
        if (prevIndex < messages.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(interval); // Stop the interval when the last message is reached
          return prevIndex;
        }
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center rounded-full border border-purple-400 p-1 px-2">
      <div>
        <Loading color="purple-600" />
      </div>
      <div>
        <div className="text-purple-600 font-bold text-sm">
          {messages[messageIndex]}
        </div>
      </div>
    </div>
  );
}

export default LoadingMessage;