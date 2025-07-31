import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Student, BusinessType } from './types';
import Sidebar from './components/Sidebar';
import HomeDashboard from './components/HomeDashboard';
import SalesDashboard from './components/SalesDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import ReportsDashboard from './components/ReportsDashboard';
import InventoryDashboard from './components/InventoryDashboard';
import ReceiptGenerator from './components/ReceiptGenerator';
import SettingsDashboard from './components/SettingsDashboard';
import DailySalesDashboard from './components/DailySalesDashboard';
import ExpensesDashboard from './components/ExpensesDashboard';
import UserAccountsDashboard from './components/UserAccountsDashboard';
import DataImportDashboard from './components/DataImportDashboard';
import PointOfSaleDashboard from './components/PointOfSaleDashboard';
import ChangePasswordDashboard from './components/ChangePasswordDashboard';
import PasswordExpiryNotification from './components/PasswordExpiryNotification';
import { DASHBOARD_TITLE } from './constants';
import { AuthContext } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import { PERMISSIONS } from './permissions';
import AccessDenied from './components/AccessDenied';
import { BusinessContext, defaultTheme } from './contexts/BusinessContext';
import { shadeColor } from './utils/color';
import BusinessTypeSelector from './components/BusinessTypeSelector';

// Industry-specific dashboards
import LogisticsDashboard from './components/LogisticsDashboard';
import CrmDashboard from './components/CrmDashboard';
import PatientsDashboard from './components/PatientsDashboard';
import AppointmentsDashboard from './components/AppointmentsDashboard';
import CylinderInventoryDashboard from './components/CylinderInventoryDashboard';
import SafetyChecklistsDashboard from './components/SafetyChecklistsDashboard';
import BulkSupplyLogDashboard from './components/BulkSupplyLogDashboard';
import StockAlertsDashboard from './components/StockAlertsDashboard';
import SuppliersDashboard from './components/SuppliersDashboard';
import PromotionsDashboard from './components/PromotionsDashboard';
import LoyaltyDashboard from './components/LoyaltyDashboard';

// Education-specific dashboards
import StudentsDashboard from './components/StudentsDashboard';
import StudentProfileDashboard from './components/StudentProfileDashboard';
import CoursesDashboard from './components/CoursesDashboard';
import TimetableDashboard from './components/TimetableDashboard';
import GradesDashboard from './components/GradesDashboard';
import FeesDashboard from './components/FeesDashboard';
import AttendanceDashboard from './components/AttendanceDashboard';
import StaffManagementDashboard from './components/StaffManagementDashboard';
import PayrollDashboard from './components/PayrollDashboard';
import StudentReportCard from './components/StudentReportCard';
import CostAnalysisReport from './components/CostAnalysisReport';
import AcademicCalendarDashboard from './components/AcademicCalendarDashboard';
import AcademicAdvisingDashboard from './components/AcademicAdvisingDashboard';

// Real Estate-specific dashboards
import PropertiesDashboard from './components/PropertiesDashboard';
import LeasesDashboard from './components/LeasesDashboard';
import ViewingsDashboard from './components/ViewingsDashboard';


// QR Code Modals
import QRCodeScanner from './components/QRCodeScanner';
import QRCodeDisplayModal from './components/QRCodeDisplayModal';
import { MenuIcon } from './components/icons/MenuIcon';
import PrintLoginSlipModal from './components/PrintLoginSlipModal';
import EditStudentModal from './components/EditStudentModal';
import AddTimetableEntryModal from './components/AddTimetableEntryModal';


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Home);
  const [modalView, setModalView] = useState<View | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  
  const { currentUser } = useContext(AuthContext);
  const { profile, updateProfile } = useContext(BusinessContext);

  useEffect(() => {
    const root = document.documentElement;
    const theme = profile.theme || defaultTheme;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-hover', shadeColor(theme.primary, -0.1));
    root.style.setProperty('--primary-light', shadeColor(theme.primary, 0.5));
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--card', theme.card);
    root.style.setProperty('--text-primary', theme.text);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--input', theme.input);
  }, [profile.theme]);

  useEffect(() => {
    if (currentUser) {
        const userPermissions = PERMISSIONS[currentUser.role];
        if (!userPermissions.includes(activeView)) {
            const firstAllowedView = userPermissions[0] || View.Home;
            setActiveView(firstAllowedView);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);


  const openModal = useCallback((view: View, data: any) => {
    setModalData(data);
    setModalView(view);
  }, []);

  const viewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveView(View.StudentProfile);
  };

  const handleBackToStudents = useCallback(() => {
    setSelectedStudentId(null);
    setActiveView(View.Students);
  }, []);

  const handleSetActiveView = (view: View) => {
    if (view !== View.StudentProfile) {
      setSelectedStudentId(null);
    }
    setActiveView(view);
  };

  const renderModalView = () => {
    if (!modalView) return null;
    
    switch (modalView) {
      case View.QRCodeScanner:
        return <QRCodeScanner onSuccess={modalData.onSuccess} onClose={() => setModalView(null)} />;
      case View.QRCodeDisplay:
        return <QRCodeDisplayModal item={modalData.item} onClose={() => setModalView(null)} />;
      case View.PrintLoginSlip:
        return <PrintLoginSlipModal student={modalData.student} profile={modalData.profile} onClose={() => setModalView(null)} />;
      case View.EditStudent:
        return <EditStudentModal student={modalData.student} onClose={() => setModalView(null)} />;
      case View.AddTimetableEntry:
        return <AddTimetableEntryModal
                onClose={() => setModalView(null)}
                className={modalData.className}
                day={modalData.day}
                timeSlot={modalData.timeSlot}
                entry={modalData.entry}
            />;
      default:
        return null;
    }
  };

  const renderActiveView = () => {
    if (!currentUser) return null;

    const hasPermission = PERMISSIONS[currentUser.role].includes(activeView);
    if (!hasPermission) {
      return <AccessDenied />;
    }

    switch (activeView) {
      case View.Home:
        return <HomeDashboard setActiveView={setActiveView} />;
      case View.Sales:
        return <SalesDashboard />;
      case View.PointOfSale:
        return <PointOfSaleDashboard openModal={openModal} />;
      case View.DailySales:
        return <DailySalesDashboard />;
      case View.Expenses:
        return <ExpensesDashboard />;
      case View.Reports:
        return <ReportsDashboard setActiveView={setActiveView} />;
      case View.Inventory:
        return <InventoryDashboard openModal={openModal} />;
      case View.DataImport:
        return <DataImportDashboard />;
      case View.Receipts:
        return <ReceiptGenerator />;
      case View.Security:
        return <SecurityDashboard />;
      case View.UserAccounts:
        return <UserAccountsDashboard />;
      case View.Settings:
        return <SettingsDashboard />;
      case View.ChangePassword:
        return <ChangePasswordDashboard />;
      case View.CostAnalysisReport:
        return <CostAnalysisReport setActiveView={setActiveView} />;
      // Logistics
      case View.Logistics:
        return <LogisticsDashboard />;
      // Retail/General
      case View.Crm:
        return <CrmDashboard />;
      // Hospital
      case View.Patients:
        return <PatientsDashboard />;
      case View.Appointments:
        return <AppointmentsDashboard />;
      // LPG
      case View.CylinderInventory:
        return <CylinderInventoryDashboard />;
      case View.SafetyChecklists:
        return <SafetyChecklistsDashboard />;
      case View.BulkSupplyLog:
        return <BulkSupplyLogDashboard />;
      // Supermarket
      case View.StockAlerts:
        return <StockAlertsDashboard />;
      case View.Suppliers:
        return <SuppliersDashboard />;
      case View.Promotions:
        return <PromotionsDashboard />;
      case View.Loyalty:
        return <LoyaltyDashboard />;
      // Education
      case View.Students:
        return <StudentsDashboard viewStudent={viewStudent} />;
      case View.StudentProfile:
        return selectedStudentId ? <StudentProfileDashboard studentId={selectedStudentId} onBack={handleBackToStudents} openModal={openModal} /> : <AccessDenied />;
      case View.Courses:
        return <CoursesDashboard />;
      case View.Timetable:
        return <TimetableDashboard openModal={openModal}/>;
      case View.Grades:
        return <GradesDashboard />;
      case View.Fees:
        return <FeesDashboard />;
      case View.Attendance:
        return <AttendanceDashboard />;
      case View.StaffManagement:
        return <StaffManagementDashboard />;
      case View.Payroll:
        return <PayrollDashboard />;
      case View.AcademicCalendar:
        return <AcademicCalendarDashboard />;
      case View.AcademicAdvising:
        return <AcademicAdvisingDashboard viewStudent={viewStudent} />;
      // Real Estate
      case View.Properties:
        return <PropertiesDashboard />;
      case View.Leases:
        return <LeasesDashboard />;
      case View.Viewings:
        return <ViewingsDashboard />;
      case View.AccessDenied:
        return <AccessDenied />;
      default:
        return <HomeDashboard setActiveView={setActiveView} />;
    }
  };

  const getTitle = () => {
    if (!currentUser) return "Login";
    const hasPermission = PERMISSIONS[currentUser.role].includes(activeView);
    return hasPermission ? DASHBOARD_TITLE[activeView] : DASHBOARD_TITLE[View.AccessDenied];
  };

  const renderContent = () => {
    if (!profile.isConfigured) {
        return (
            <div className="flex items-center justify-center h-screen">
                <BusinessTypeSelector 
                    onSelect={(type: BusinessType) => {
                        updateProfile({ ...profile, businessType: type, isConfigured: true });
                    }} 
                />
            </div>
        );
    }
    
    if (loggedInStudent) {
      return <StudentReportCard student={loggedInStudent} onLogout={() => setLoggedInStudent(null)} />;
    }
    if (!currentUser) {
      return <LoginScreen onStudentLogin={setLoggedInStudent} />;
    }
    return (
      <div className="flex h-screen">
        <Sidebar activeView={activeView} setActiveView={handleSetActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-8">
                <div className="flex items-center mb-8">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[var(--text-primary)] p-2 mr-4 bg-[var(--card)] rounded-lg">
                        <MenuIcon />
                    </button>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">{getTitle()}</h1>
                </div>
                <PasswordExpiryNotification setActiveView={setActiveView} />
                {renderActiveView()}
            </div>
        </main>
         {isSidebarOpen && (
            <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 lg:hidden"></div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen font-sans bg-[var(--background)] text-[var(--text-primary)]">
      <div 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530305408560-82d13781b33a?q=80&w=2672&auto=format&fit=crop')" }} 
        className="fixed inset-0 z-0 bg-cover bg-center opacity-50" 
      />
      <div className="relative z-10">
        {renderContent()}
        {renderModalView()}
      </div>
    </div>
  );
};

export default App;