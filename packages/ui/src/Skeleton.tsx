import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function ProfileSkeleton () {
    return (
        <div className="flex items-center gap-2 mt-3 bg-white p-2 rounded-lg cursor-pointer">
            <div className="w-[40px] h-[40px] rounded-full">
              <Skeleton circle={true} height="100%" width="100%" />
            </div>
            <div className="flex-grow overflow-hidden text-left ">
              <Skeleton count={2} />
            </div>
        </div>
    )   
}

function QuizSkeleton() {
  return (
    <div className="w-full h-full p-2 flex flex-col justify-center items-center sm:w-3/4 sm:p-0 relative">

      {/* Main question and answers section */}
      <div className="w-full flex items-center gap-4 max-h-[60vh] mt-3">
        <div className="flex justify-center">
          <div className="bg-gray-200 rounded-full w-8 h-8 p-1"></div>
        </div>
        <div className="flex-grow h-full overflow-y-auto ring-2 ring-gray-200 rounded-xl p-4">
          {/* Question title */}
          <div className="text-black font-bold text-2xl break-words w-full">
            <Skeleton height={30} />
          </div>
          {/* Answer options */}
          <div className="w-full mt-4 font-medium">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-2 rounded-lg mt-3 w-full break-words">
                <Skeleton height={40} borderRadius={8} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-gray-200 rounded-full w-8 h-8 p-1"></div>
        </div>
      </div>

      {/* Submit button */}
      <div className="w-full flex justify-center items-center gap-4 mt-3">
        <div className="w-32 h-10">
          <Skeleton height="100%" borderRadius={9999} />
        </div>
      </div>
    </div>
  );
}

export { ProfileSkeleton, QuizSkeleton };
