import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import LoginPage from "./pages/LoginPage";
import ProviderDetailsPage from "./pages/ProviderDetailsPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/register-provider" element={<ProviderDetailsPage />}/>
        <Route path="/email-verification" element={<EmailVerificationPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
     <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
  
  </>
  );
}
