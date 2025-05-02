import { useState } from "react"
import { Button } from "../components/ui/button"
import { toast } from "react-hot-toast"  // Importing toast from react-hot-toast
import { FaGoogle, FaFacebook } from "react-icons/fa"

export function SocialLogin() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      window.location.href = "http://localhost:5000/auth/google"
    } catch (error) {
      toast.error("Failed to connect with Google")  // Error toast for Google login
      setIsGoogleLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true)
    try {
      window.location.href = "http://localhost:5000/auth/facebook"
    } catch (error) {
      toast.error("Failed to connect with Facebook")  // Error toast for Facebook login
      setIsFacebookLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="flex items-center justify-center gap-2"
      >
        <FaGoogle className="h-4 w-4" />
        {isGoogleLoading ? "Loading..." : "Google"}
      </Button>
      <Button
        variant="outline"
        onClick={handleFacebookLogin}
        disabled={isFacebookLoading}
        className="flex items-center justify-center gap-2"
      >
        <FaFacebook className="h-4 w-4" />
        {isFacebookLoading ? "Loading..." : "Facebook"}
      </Button>
    </div>
  )
}
