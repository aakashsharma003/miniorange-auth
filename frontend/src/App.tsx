import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OAuthCallbackPage from "./pages/OAuth-callback";
import ProfilePage from "./pages/profile";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import EmailVerification from "./pages/verify";
 // Assuming you have a Login page

export default function App() {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/oauth-callback" element={<OAuthCallbackPage/>}/>
        <Route path="/verify" element={<EmailVerification/>} />
      </Routes>
    </Router>
  );
}
