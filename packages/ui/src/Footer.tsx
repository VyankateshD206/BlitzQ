import Link from "next/link"
import GetStartedBtn from "./GetStartedBtn";
function Footer() {
    return(
        <div className="w-full mt-[20px]">
            <div className="p-3 rounded-tl-lg rounded-tr-lg text-center py-5">
                <div className="text-2xl sm:text-3xl font-bold">Ready to Boost Your Learning Journey ?</div>
                <div className="my-2">
                    <GetStartedBtn/>
                </div>
                <div className="mt-10">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-center w-full">
                        <div className="font-bold text-xl">BlitzQ</div>
                        <div className="text-sm my-1 text-gray-600">Copyright © 2025 - All rights reserved</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-gray-600">
                        <div className="text-sm hover:underline">
                           <Link href="/signin">Login</Link> 
                        </div>
                        <div className="text-sm hover:underline">
                            <Link href="#features">Features</Link> 
                        </div>
                        
                        <div className="text-sm hover:underline">
                            <Link href="#howitworks">How It Works</Link> 
                        </div>
                        <div className="text-sm hover:underline">
                        <Link href="#pricing">Pricing</Link> 
                        </div>
                        <div className="text-sm hover:underline">
                        <Link href="/terms-of-services">Terms of services</Link></div>
                        <div className="text-sm hover:underline">
                        <Link href="/privacy-policy">Privacy policy</Link> 
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;