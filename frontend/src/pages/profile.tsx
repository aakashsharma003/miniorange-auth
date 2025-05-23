import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ProfileForm } from "../components/profile-form";
import { toast } from "react-hot-toast";
import { Mail } from "lucide-react";


export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_API}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data.user);
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#f69247]">
        <div className="max-w-md w-full text-center">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#f69247]">
      <div className="max-w-md w-full">
        <Card className="w-full bg-white">
          <CardHeader className="space-y-3">
            <div className="flex justify-center">
            <img
              src="https://www.miniorange.com/images/logo/miniorange-logo.webp"
              alt="MiniOrange Logo"
              className="h-12"
            />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-black">
              User Profile
            </CardTitle>
            <CardDescription className="text-center">
              View and update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <>
                <div className="mb-4 space-y-1 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Welcome,   {profile?.profile?.name || "User"} 
                  </h2>
                  <p className="text-sm text-gray-500">{profile.email}</p>

                  {(() => {
                    const emailPrefix = profile.email?.split("@")[0]?.slice(0, 4)?.toLowerCase();
                    const nameIncludes = profile?.profile?.name?.toLowerCase().includes(emailPrefix);
                    const usernameIncludes = profile.username?.toLowerCase().includes(emailPrefix);

                    if (emailPrefix && (nameIncludes || usernameIncludes)) {
                      return (
                        <div className="flex items-center justify-center gap-2 mt-1 text-green-600 text-sm">
                          <Mail size={16} />
                          <span>Username</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <ProfileForm profile={profile} />
              </>
            ) : (
              <p className="text-center text-muted-foreground">No profile data available</p>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
