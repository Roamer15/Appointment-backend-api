import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import LoginPage from "./pages/LoginPage";
import ProviderDetailsPage from "./pages/ProviderDetailsPage";
import Dashboard from "./pages/Dashboard";
import TimeSlot from "./pages/TimeSlotPage";
import Appointments from "./pages/AppointmentsPage";
import { UserData } from "./context/userContext";
import { NotificationProvider } from "./context/NotificationContext";
import ClientDashboard from "./pages/ClientDashboard";
import ProviderProfile from "./components/providerProfile/ProviderProfile";
import ClientHome from "./components/clientHome/ClientHome";
import ViewAppointment from "./components/viewAppointments/ViewAppointments";
import RescheduleAppointment from "./components/reschedule/RescheduleAppointment";
import ProviderHome from "./components/providerHome/ProviderHome";
import Profile from "./pages/ProfliePage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <>
      <UserData>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />}/>
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/register-provider"
                element={<ProviderDetailsPage />}
              />
              <Route
                path="/email-verification"
                element={<EmailVerificationPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<ProviderHome />}/>
                <Route path="timeslots" element={<TimeSlot />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="profile" element={<Profile />}/>
              </Route>
              <Route path="/client" element={<ClientDashboard />}>
              <Route index element={<ClientHome />}/>
                <Route path="provider/:id" element={<ProviderProfile />} />
                <Route path="appointments" element={<ViewAppointment />}/>
                <Route path="reschedule/:id" element={<RescheduleAppointment />}/>
                <Route path="profile" element={< Profile/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </UserData>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />
    </>
  );
}
