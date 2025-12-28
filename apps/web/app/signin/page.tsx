import Loading from "@repo/ui/Loading";
import SignInForm from "@repo/ui/SignInForm";
import { Suspense } from "react";

function SignIn() {
    return (
        <div>
            <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                    <Loading color="purple-600"/>
                </div>
            }>
                 <SignInForm/>
            </Suspense>
        </div>
    )
}

export default SignIn;