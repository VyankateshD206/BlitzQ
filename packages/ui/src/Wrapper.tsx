'use client'


import { ReactNode } from "react"
import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"
import { Provider } from "jotai"

function Wrapper({ children }: { children: ReactNode }) {
    return (

        <Provider>
            <SessionProvider>
                <Toaster
                    position="top-right"
                />
                {
                    children
                }


            </SessionProvider>
        </Provider>

    )
}

export default Wrapper