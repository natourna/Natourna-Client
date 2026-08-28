import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ResidentLayout } from "./components/layout/ResidentLayout";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { AddBillPage } from "./pages/admin/AddBillPage";
import { AddUserPage } from "./pages/admin/AddUserPage";
import { ApartmentDetailPage } from "./pages/admin/ApartmentDetailPage";
import { ApartmentFormPage } from "./pages/admin/ApartmentFormPage";
import { ApartmentsPage } from "./pages/admin/ApartmentsPage";
import { BillsPage } from "./pages/admin/BillsPage";
import { CycleWizardPage } from "./pages/admin/CycleWizardPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { FundsPage } from "./pages/admin/FundsPage";
import { PaymentsPage } from "./pages/admin/PaymentsPage";
import { PeoplePage } from "./pages/admin/PeoplePage";
import { RecordPaymentPage } from "./pages/admin/RecordPaymentPage";
import { BuildingMoneyPage } from "./pages/resident/BuildingMoneyPage";
import { ResidentHomePage } from "./pages/resident/ResidentHomePage";
import { ResidentPaymentsPage } from "./pages/resident/ResidentPaymentsPage";

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      {user.role === "Admin" ? (
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/apartments" element={<ApartmentsPage />} />
          <Route path="/apartments/new" element={<ApartmentFormPage />} />
          <Route path="/apartments/:apartmentId" element={<ApartmentDetailPage />} />
          <Route path="/apartments/:apartmentId/edit" element={<ApartmentFormPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/payments/new" element={<RecordPaymentPage />} />
          <Route path="/cycles/new" element={<CycleWizardPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/bills/new" element={<AddBillPage />} />
          <Route path="/funds" element={<FundsPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/new" element={<AddUserPage />} />
        </Route>
      ) : (
        <Route element={<ResidentLayout />}>
          <Route path="/" element={<ResidentHomePage />} />
          <Route path="/payments" element={<ResidentPaymentsPage />} />
          <Route path="/building" element={<BuildingMoneyPage />} />
        </Route>
      )}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
