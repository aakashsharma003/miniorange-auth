import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OAuthCallbackPage from "./pages/OAuth-callback";
import ProfilePage from "./pages/profile";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import EmailVerification from "./pages/verify";
import ProtectedRedirect from "./components/ProtectRoute";
 // Assuming you have a Login page

export default function App() {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={
          <ProtectedRedirect>
            <Login />
          </ProtectedRedirect>}/>
        <Route path="/profile" element={ <ProtectedRedirect><ProfilePage /></ProtectedRedirect>} />
        <Route path="/oauth-callback" element={<OAuthCallbackPage/>}/>
        <Route path="/verify" element={<ProtectedRedirect><EmailVerification/></ProtectedRedirect>} />
      </Routes>
    </Router>
  );
}
