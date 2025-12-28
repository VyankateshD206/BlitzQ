  import { userProfile } from "@repo/types/index"
import { CreditCard, LogOut } from "lucide-react"
import { getSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import Loading from "./Loading"
import toast from "react-hot-toast"

function Profile( {profile} : {profile: userProfile}) {
    const router = useRouter()
    const [billingLoading, setBillingLoading] = useState(false)
    async function signOutHandler() {
      try {
        await signOut({redirect:false})
        router.push('/')
      }
      catch (error) {
        console.log('Failed to sign out')
      }
    } 

    async function getBillingLink() {
      try {
        setBillingLoading(true)
        const session = await getSession()
        if (!session || !session.user) {
            throw new Error("Unauthorized access")
        }

        const resp = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/customerPortal`, {
          headers: {
            Authorization: `Bearer ${session.user}`
          }
        })

        if (resp && resp.data && resp.data.success && resp.data.customerPortal) {
          window.open(resp.data.customerPortal, "_blank")
        } else if (resp && resp.data && !resp.data.success) {
          throw new Error(resp.data.message)
        } else {
          throw new Error('Failed to generate billing link')
        }

      } catch (error) {
        console.log('Failed to get billing link')
        toast.error('Failed to get billing link')
      } finally {
        setBillingLoading(false)
      }
    }
    
    return(
        <div>
            <div>
                <button onClick={getBillingLink} className="disabled:cursor-not-allowed disabled:opacity-500" disabled={billingLoading}>
                  <div className="flex gap-2 my-2 items-center">
                      <div className="text-gray-500"><CreditCard/></div>
                      <div>Billing</div>
                      { billingLoading ?  <div>
                        <Loading color="gray-600"/>
                      </div> : <></>}
                  </div>
                </button>
                <div className="flex gap-2 my-2 items-center">
                  <button onClick={signOutHandler}>
                    <div className="flex gap-2 my-2 items-center">
                      <div className="text-gray-500"><LogOut/></div>
                      <div>Logout</div>
                    </div>
                  </button>
                </div>
            </div>
        </div>
    )
}

export default Profile