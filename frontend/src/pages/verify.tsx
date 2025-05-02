import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import OTPInput from "@/components/otp-input";
import OTPTimer from "@/components/otp-timer";
import { sendOTP, verifyOTP } from "@/lib/auth-actions";
import { useSearchParams } from "react-router-dom";

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [verified, setVerified] = useState(false);
 
  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => {
        window.location.href = "/profile";
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [verified]);
  
  const handleSendOTP = async () => {
    if (!email) return setError("Please enter your email address");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError("Please enter a valid email address");
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendOTP(email);
      setOtpSent(true);
      setSuccess("OTP sent to your email");
      setCanResend(false);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return setError("Please enter a valid 6-digit OTP");

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await verifyOTP(email, otp);

      if (result.success) {
        setSuccess("Email verified successfully!");
        setVerified(true);
        localStorage.setItem('token', result.token);
        localStorage.setItem('refreshtoken', result.refreshtoken);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendOTP(email);
      setSuccess("New OTP sent to your email");
      setCanResend(false);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) handleSendOTP();
  }, [email]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#f69247]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {!verified ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                We sent a verification code to{" "}
                <span className="font-medium">{email}</span>
              </p>
              <OTPInput value={otp} onChange={setOtp} disabled={loading} />

              <div className="flex justify-center">
                <OTPTimer
                  seconds={60}
                  onTimerComplete={() => setCanResend(true)}
                  isActive={!canResend}
                />
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Email Verified Successfully!</p>
              <p className="text-sm text-muted-foreground mt-2">
                You can now proceed to your account.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          {!otpSent ? (
            <Button className="w-full" onClick={handleSendOTP} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Verification Code
            </Button>
          ) : !verified ? (
            <>
              <Button
                className="w-full"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendOTP}
                disabled={loading || !canResend}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resend Code
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={() => (window.location.href = "/profile")}>
              Continue to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default EmailVerification;
