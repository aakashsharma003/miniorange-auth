import { useEffect } from "react";
import { toast } from "react-hot-toast";  // Importing toast from react-hot-toast
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      toast.error(error);  // Using react-hot-toast for error notification
      navigate("/");
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
     else console.log("token nhi milla")
      toast.success("You have successfully logged in");  // Using react-hot-toast for success notification
      navigate("/profile");
    } else {
      toast.error("No authentication token received");  // Using react-hot-toast for error notification
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Authentication</h1>
        <p className="text-muted-foreground">Please wait while we complete your login...</p>
      </div>
    </main>
  );
}
