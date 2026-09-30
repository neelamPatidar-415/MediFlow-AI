import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import Appointments from "./pages/Appointments";
import MyAppointments from "./pages/MyAppointments";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import MyBookings from "./pages/MyBookings";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";

//hospital admin pages
import CreateDoctor from "./pages/hospital/CreateDoctor";
import ManageDoctors from "./pages/hospital/ManageDoctors";
import HospitalAnalytics from "./pages/hospital/HospitalAnalytics";
import HospitalAppointments from "./pages/hospital/HospitalAppointments";
import HospitalBookings from "./pages/hospital/HospitalBookings";

function App() {
    return (
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />

          <Route path="/appointments" element={<Appointments />} />

          <Route path="/bookings" element={<MyBookings />} />

          <Route path="/my-appointments" element={<MyAppointments />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/hospital/doctors/create" element={<CreateDoctor />} />
          <Route path="/hospital/doctors" element={<ManageDoctors />} />
          <Route path="/hospital/analytics" element={<HospitalAnalytics />} />
          <Route
            path="/hospital/appointments"
            element={<HospitalAppointments />}
          />
          <Route path="/hospital/bookings" element={<HospitalBookings />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />

        {/* Available globally */}
        <AIAssistant />
      </BrowserRouter>
    );
}

export default App;