import Footer from "@repo/ui/Footer"
import Landing from "@repo/ui/Landing"

function Page () {
  return (
    <div className="flex flex-col items-center">
      <Landing/>
      <Footer/>
    </div>
  )
}

export default Page