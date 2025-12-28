import Footer from "@repo/ui/Footer"
import Landing from "@repo/ui/Landing"

function Page () {
  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-white via-purple-200 to-white">
      <Landing/>
      <Footer/>
    </div>
  )
}

export default Page