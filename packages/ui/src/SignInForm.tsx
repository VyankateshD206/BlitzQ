'use client'
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

function SignInForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (searchParams.get('error')) {
            const errorMsg = searchParams.get('error')
            toast.error(errorMsg)
        }
    }, [searchParams])
    const loginUsingCredentials = async () => {
        try {

            if (!email || !email.trim().length) {
                throw new Error("Email is required")
            }

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

            if(!emailRegex.test(email)) {
                throw new Error("Email is invalid")
            }

            if (!password || !password.trim().length) {
                throw new Error("Password is required")
            }

            if (password.trim().length < 8) {
                throw new Error("Password must be of atleast 8 characters")
            }

            setLoading(true)

            const resp = await signIn('credentials', { redirect: false, email, password })
            if (!resp || !resp.ok || resp.error) {
                throw new Error(resp?.error || 'Failed to sign in.')
            }

            toast.success('Signed in successfully')
            router.push('/quiz')

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    };

    const loginUsingGoogle = async () => {
        try {
            const resp =  await signIn('google', {redirect: false})
            if (!resp || !resp.ok || resp.error) {
                throw new Error(resp?.error || 'Failed to sign in.')
            }

            router.push('/quiz')

        } catch (error: any) {
            console.log('error', error.message)
        }
    }
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-[var(--blitzq-bg)] via-[#0a1335] to-[var(--blitzq-bg)]">
            <div className="max-sm:w-[90%] max-md:w-3/4 md:w-1/2 ring-4 ring-[color:rgba(47,140,255,0.45)] p-4 rounded-lg shadow shadow-black bg-[var(--blitzq-card)]">
                <div className="text-4xl font-bold text-[var(--blitzq-primary)] text-center">
                    BlitzQ
                </div>
                <div className="text-center font-semibold mt-2">
                    Welcome,
                </div>
                <div className="text-center text-sm text-[var(--blitzq-muted)]">
                    Please enter your details to sign in.
                </div>
                <div className="my-2">
                    <div className="font-bold">E-Mail Address</div>
                    <div className="w-full rounded-xl border border-[color:var(--blitzq-border)] p-1 mt-1">
                        <input type="email" name="email" placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent rounded-xl p-1 outline-none" />
                    </div>
                </div>
                <div className="my-2 mb-4">
                    <div className="font-bold">Password</div>
                    <div className="w-full rounded-xl border border-[color:var(--blitzq-border)] p-1 flex items-center gap-1 mt-1">
                        <div className="w-full">
                            <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent rounded-xl p-1 outline-none" />
                        </div>
                        <div className="cursor-pointer text-[var(--blitzq-muted)]" onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? <EyeClosed /> : <Eye />}
                        </div>
                    </div>
                </div>
                <div className="my-3 w-full text-center flex justify-center">
                    <button className="max-sm:w-full max-md:w-3/4 md:w-1/2 bg-purple-600 p-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading} onClick={loginUsingCredentials}>
                        <div className="flex gap-2 justify-center items-center">
                            {(loading) ? <div className="flex justify-center items-center">
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                            </div> : <></>}
                            <div>
                                Sign In
                            </div>
                        </div>
                    </button>
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="max-sm:w-full max-md:w-3/4 md:w-1/2 flex justify-center items-center gap-1">
                        <div className="flex items-center w-full">
                            <div className="border border-[color:var(--blitzq-border)] w-full"> </div>
                        </div>
                        <div className="text-[var(--blitzq-muted)]">OR</div>
                        <div className="flex items-center w-full">
                            <div className="border border-[color:var(--blitzq-border)] w-full"> </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 w-full flex justify-center">
                    <div className="border border-[color:var(--blitzq-border)] p-2 rounded-lg text-[var(--blitzq-fg)] bg-[var(--blitzq-card)] max-sm:w-full max-md:w-3/4 md:w-1/2 flex items-center justify-center gap-2">
                        <div className="w-[30px] h-[30px]">
                            <img src="/google_icon.png" alt="google icon" className="w-full h-full" />
                        </div>
                        <div>
                            <button onClick={loginUsingGoogle}>
                                Sign In With Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInForm;