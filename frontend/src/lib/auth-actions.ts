export async function sendOTP(email: string) {
    console.log("Sending OTP to:", email);
    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_API}/verify/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }
  
    return data;
  }
  
  export async function verifyOTP(email: string, otp: string) {
    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_API}/verify/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to verify OTP");
    }
  
    return data;
  }
  