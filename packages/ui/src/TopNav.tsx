import { Menu } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

function TopNav({ setShowSideBar } : {setShowSideBar : Dispatch<SetStateAction<boolean>>}) {
    return (
        <div className="flex gap-2 items-center p-2 px-4 h-max">
            <div className="flex items-center justify-center">
                <div className="cursor-pointer w-max h-max" onClick={() => setShowSideBar(true)}>
                    <Menu/>
                </div>
            </div>
        </div>
    )
}

export default TopNav;