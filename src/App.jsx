// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./components/Auth/login";
// import Dashboard from "./components/Admin/Dashboard";
// import ForgotPassword from "./components/Auth/ForgotPassword";

// import Inventorylist from "./components/inventory/InventoryList";
// import RentalMaster from "./components/rentalMaster/RentalMasterList";
// import RentalMasterForm from "./components/rentalMaster/RentalMasterForm";
// import RentalMasterView from "./components/rentalMaster/RentalMasterView";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/admin-dashboard" element={<Dashboard />} />
//         <Route path="/inventory" element={<Inventorylist />} />
//         <Route path="/rental-master" element={<RentalMaster />} />
//         <Route path="/rental-requisition" element={<RentalMasterForm />} />
//         <Route path="/rental-view" element={<RentalMasterView />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/Auth/login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Dashboard from "./components/Admin/Dashboard";
import Inventorylist from "./components/inventory/InventoryList";
import RentalMaster from "./components/rentalMaster/RentalMasterList";
import RentalMasterForm from "./components/rentalMaster/RentalMasterForm";
import RentalMasterView from "./components/rentalMaster/RentalMasterView";
import RentalMasterEdit from "./components/rentalMaster/RentalMatserEdit";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import SessionManager from "./components/Auth/SessionManager";

function App() {
  return (
    <Router>
      <SessionManager />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventorylist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rental-master"
          element={
            <ProtectedRoute>
              <RentalMaster />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rental-requisition"
          element={
            <ProtectedRoute>
              <RentalMasterForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rental-edit/:id"
          element={
            <ProtectedRoute>
              <RentalMasterEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rental-view/:id"
          element={
            <ProtectedRoute>
              <RentalMasterView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
