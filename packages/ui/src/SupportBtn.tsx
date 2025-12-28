'use client'
import { MessageSquareText } from "lucide-react";

function SupportBtn() {
  return(
    <div className="fixed bottom-5 right-5 p-3 z-20 bg-purple-600 rounded-full shadow-lg cursor-pointer hover:shadow-xl">
        <a href="https://www.tally.so/r/wvbGv0" target="_blank">
          <MessageSquareText
            stroke="white"
          />
        </a>
    </div>
  )
}

export default SupportBtn