import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { LoginForm } from "../components/login-form";
import { RegisterForm } from "../components/register-form";
import { SocialLogin } from "../components/social-login";
import { Link } from "react-router-dom"; 

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#f69247]">
      <div className="max-w-md w-full">
        <Card className="w-full">
          {/* Logo Image */}
          <div className="flex justify-center mt-6">
            <img
              src="https://www.miniorange.com/images/logo/miniorange-logo.webp"
              alt="MiniOrange Logo"
              className="h-12"
            />
          </div>

          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#616161]">Authentication System</CardTitle>
            <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <SocialLogin />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link to="/" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
