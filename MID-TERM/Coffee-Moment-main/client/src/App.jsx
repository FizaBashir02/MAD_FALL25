import { Routes, Route } from "react-router-dom";
import Moment from "./pages/MomentPage";
import Cafe from "./pages/CafePage";
import Dashboard from "./pages/Dashboard";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import CafeManage from "./pages/CafeManage";
import MomentManage from "./pages/MomentManage";
import CreateCafe from "./pages/CreateCafe";
import UpdateCafe from "./pages/UpdateCafe";
import CreateMoment from "./pages/CreateMoment";
import UpdateMoment from "./pages/UpdateMoment";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Routes>
      {/* Public pages use PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/moment" element={<Moment />} />
        <Route path="/cafe" element={<Cafe />} />
      </Route>

      {/* Dashboard pages use DashboardLayout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cafe-manage" element={<CafeManage />} />
        <Route path="/create-cafe" element={<CreateCafe />} />
        <Route path="/update-cafe/:id" element={<UpdateCafe />} />
        <Route path="/moment-manage" element={<MomentManage />} />
        <Route path="/create-moment" element={<CreateMoment />} />
        <Route path="/update-moment/:id" element={<UpdateMoment />} />
      </Route>
    </Routes>
  );
}

export default App;
