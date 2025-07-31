import React, { useContext } from 'react';
import { View, BusinessType } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { SalesIcon } from './icons/SalesIcon';
import { SecurityIcon } from './icons/SecurityIcon';
import { ReportsIcon } from './icons/ReportsIcon';
import { InventoryIcon } from './icons/InventoryIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { DailySalesIcon } from './icons/DailySalesIcon';
import { ExpensesIcon } from './icons/ExpensesIcon';
import { UserAccountsIcon } from './icons/UserAccountsIcon';
import { DataImportIcon } from './icons/DataImportIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ChangePasswordIcon } from './icons/ChangePasswordIcon';
import { PointOfSaleIcon } from './icons/PointOfSaleIcon';
import { BusinessContext } from '../contexts/BusinessContext';
import { AuthContext } from '../contexts/AuthContext';
import { PERMISSIONS } from '../permissions';
import { SecurityContext } from '../contexts/SecurityContext';

// Industry Icons
import { LogisticsIcon } from './icons/LogisticsIcon';
import { PatientIcon } from './icons/PatientIcon';
import { AppointmentIcon } from './icons/AppointmentIcon';
import { CylinderIcon } from './icons/CylinderIcon';
import { SafetyChecklistIcon } from './icons/SafetyChecklistIcon';
import { BulkSupplyIcon } from './icons/BulkSupplyIcon';
import { StockAlertsIcon } from './icons/StockAlertsIcon';
import { SuppliersIcon } from './icons/SuppliersIcon';
import { PromotionsIcon } from './icons/PromotionsIcon';
import { LoyaltyIcon } from './icons/LoyaltyIcon';
import { StudentsIcon } from './icons/StudentsIcon';
import { CoursesIcon } from './icons/CoursesIcon';
import { TimetableIcon } from './icons/TimetableIcon';
import { GradesIcon } from './icons/GradesIcon';
import { FeesIcon } from './icons/FeesIcon';
import { AttendanceIcon } from './icons/AttendanceIcon';
import { PayrollIcon } from './icons/PayrollIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CrmIcon } from './icons/CrmIcon';
import { PropertyIcon } from './icons/PropertyIcon';
import { LeaseIcon } from './icons/LeaseIcon';
import { ViewingIcon } from './icons/ViewingIcon';
import { AcademicAdvisingIcon } from './icons/AcademicAdvisingIcon';


interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItemProps {
  view: View;
  label: string;
  activeView: View;
  setActiveView: (view: View) => void;
  closeSidebar: () => void;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, activeView, setActiveView, closeSidebar, children }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setActiveView(view);
        closeSidebar();
      }}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        activeView === view
          ? 'bg-[var(--primary)] text-white shadow-lg'
          : 'text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text-primary)]'
      }`}
    >
      {children}
      <span className="ml-4 font-medium">{label}</span>
    </a>
  </li>
);

const navItemConfig = {
  [BusinessType.General]: [
    { view: View.PointOfSale, label: "Point of Sale", icon: <PointOfSaleIcon />, group: "Sales" },
    { view: View.Sales, label: "Sales Overview", icon: <SalesIcon />, group: "Sales" },
    { view: View.DailySales, label: "Daily Sales", icon: <DailySalesIcon />, group: "Sales" },
    { view: View.Crm, label: "CRM", icon: <CrmIcon />, group: "Operations" },
    { view: View.Logistics, label: "Logistics", icon: <LogisticsIcon />, group: "Operations" },
    { view: View.Inventory, label: "Inventory", icon: <InventoryIcon />, group: "Operations" },
    { view: View.Expenses, label: "Expenses", icon: <ExpensesIcon />, group: "Operations" },
    { view: View.Reports, label: "Reports", icon: <ReportsIcon />, group: "Admin" },
    { view: View.DataImport, label: "Data & Import", icon: <DataImportIcon />, group: "Admin" },
  ],
  [BusinessType.Hospital]: [
    { view: View.Appointments, label: "Appointments", icon: <AppointmentIcon />, group: "Clinical" },
    { view: View.Patients, label: "Patients", icon: <PatientIcon />, group: "Clinical" },
    { view: View.PointOfSale, label: "Point of Sale", icon: <PointOfSaleIcon />, group: "Operations" },
    { view: View.Inventory, label: "Inventory", icon: <InventoryIcon />, group: "Operations" },
    { view: View.Expenses, label: "Expenses", icon: <ExpensesIcon />, group: "Operations" },
    { view: View.Receipts, label: "Billing / Receipts", icon: <ReceiptIcon />, group: "Financial" },
    { view: View.Reports, label: "Reports", icon: <ReportsIcon />, group: "Financial" },
  ],
  [BusinessType.LPGStation]: [
    { view: View.PointOfSale, label: "Point of Sale", icon: <PointOfSaleIcon />, group: "Sales" },
    { view: View.DailySales, label: "Daily Sales", icon: <DailySalesIcon />, group: "Sales" },
    { view: View.CylinderInventory, label: "Cylinder Inventory", icon: <CylinderIcon />, group: "LPG Operations" },
    { view: View.BulkSupplyLog, label: "Bulk Supply Log", icon: <BulkSupplyIcon />, group: "LPG Operations" },
    { view: View.SafetyChecklists, label: "Safety Checklists", icon: <SafetyChecklistIcon />, group: "LPG Operations" },
    { view: View.Inventory, label: "Other Inventory", icon: <InventoryIcon />, group: "General" },
    { view: View.Expenses, label: "Expenses", icon: <ExpensesIcon />, group: "General" },
  ],
  [BusinessType.Supermarket]: [
    { view: View.PointOfSale, label: "Point of Sale", icon: <PointOfSaleIcon />, group: "Sales" },
    { view: View.Sales, label: "Sales Overview", icon: <SalesIcon />, group: "Sales" },
    { view: View.Loyalty, label: "Customer Loyalty", icon: <LoyaltyIcon />, group: "Sales" },
    { view: View.Inventory, label: "Inventory", icon: <InventoryIcon />, group: "Merchandising" },
    { view: View.StockAlerts, label: "Stock Alerts", icon: <StockAlertsIcon />, group: "Merchandising" },
    { view: View.Promotions, label: "Promotions", icon: <PromotionsIcon />, group: "Merchandising" },
    { view: View.Suppliers, label: "Suppliers", icon: <SuppliersIcon />, group: "Merchandising" },
    { view: View.Expenses, label: "Expenses", icon: <ExpensesIcon />, group: "Admin" },
    { view: View.DataImport, label: "Data Import", icon: <DataImportIcon />, group: "Admin" },
  ],
  [BusinessType.Education]: [
    { view: View.Students, label: "Students", icon: <StudentsIcon />, group: "Academics" },
    { view: View.Courses, label: "Courses", icon: <CoursesIcon />, group: "Academics" },
    { view: View.Grades, label: "Gradebook", icon: <GradesIcon />, group: "Academics" },
    { view: View.Attendance, label: "Attendance", icon: <AttendanceIcon />, group: "Academics" },
    { view: View.Timetable, label: "Timetable", icon: <TimetableIcon />, group: "Academics" },
    { view: View.AcademicAdvising, label: "Academic Advising", icon: <AcademicAdvisingIcon />, group: "Academics" },
    { view: View.Fees, label: "Student Fees", icon: <FeesIcon />, group: "Financial" },
    { view: View.Payroll, label: "Staff Payroll", icon: <PayrollIcon />, group: "Financial" },
    { view: View.Expenses, label: "School Expenses", icon: <ExpensesIcon />, group: "Financial" },
    { view: View.StaffManagement, label: "User Management", icon: <UserAccountsIcon />, group: "Administration" },
    { view: View.AcademicCalendar, label: "Academic Calendar", icon: <CalendarIcon />, group: "Administration" },
    { view: View.Reports, label: "Reports", icon: <ReportsIcon />, group: "Administration" },
  ],
  [BusinessType.RealEstate]: [
    { view: View.Properties, label: "Properties", icon: <PropertyIcon />, group: "Property Management" },
    { view: View.Leases, label: "Leases", icon: <LeaseIcon />, group: "Property Management" },
    { view: View.Viewings, label: "Viewings", icon: <ViewingIcon />, group: "Property Management" },
    { view: View.Expenses, label: "Expenses", icon: <ExpensesIcon />, group: "Financial" },
    { view: View.Reports, label: "Reports", icon: <ReportsIcon />, group: "Financial" },
  ],
};

const commonNavItems = [
    { view: View.Security, label: "Security", icon: <SecurityIcon />, group: "System" },
    { view: View.UserAccounts, label: "User Accounts", icon: <UserAccountsIcon />, group: "System" },
    { view: View.Settings, label: "Settings", icon: <SettingsIcon />, group: "System" },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
  const { profile } = useContext(BusinessContext);
  const { currentUser, logout } = useContext(AuthContext);
  const { logSecurityEvent } = useContext(SecurityContext);

  if (!currentUser) return null;

  const closeSidebar = () => setIsOpen(false);

  const businessType = profile.businessType || BusinessType.General;
  const isEducation = businessType === BusinessType.Education;
  const userPermissions = PERMISSIONS[currentUser.role];
  
  const baseNavItems = navItemConfig[businessType] || navItemConfig[BusinessType.General];

  // For Education, we use StaffManagement instead of the common UserAccounts
  const effectiveCommonNavItems = isEducation 
      ? commonNavItems.filter(item => item.view !== View.UserAccounts)
      : commonNavItems;

  const allNavItems = [...baseNavItems, ...effectiveCommonNavItems];
  const allowedNavItems = allNavItems.filter(item => userPermissions.includes(item.view));

  const groupedNavItems = allowedNavItems.reduce((acc, item) => {
      acc[item.group] = [...(acc[item.group] || []), item];
      return acc;
  }, {} as Record<string, typeof allowedNavItems>);

  const groupOrder = businessType === BusinessType.Hospital 
    ? ["Clinical", "Operations", "Financial", "System"]
    : businessType === BusinessType.LPGStation
    ? ["Sales", "LPG Operations", "General", "System"]
    : businessType === BusinessType.Supermarket
    ? ["Sales", "Merchandising", "Admin", "System"]
    : businessType === BusinessType.Education
    ? ["Academics", "Financial", "Administration", "System"]
    : businessType === BusinessType.RealEstate
    ? ["Property Management", "Financial", "System"]
    : ["Sales", "Operations", "Admin", "System"];


  return (
    <aside className={`fixed lg:relative inset-y-0 left-0 bg-[var(--card)] backdrop-blur-sm p-4 flex flex-col shadow-2xl w-64 z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex items-center mb-10 p-2">
        <div className="bg-[var(--primary)] p-2 rounded-md mr-3 flex-shrink-0">
          {profile.logoUrl ? (
            <img src={profile.logoUrl} alt="Business Logo" className="h-6 w-6 object-contain" />
          ) : (
            <DashboardIcon />
          )}
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] truncate">{profile.businessName}</h1>
      </div>
      <nav className='flex-grow overflow-y-auto'>
        <ul>
          <NavItem key={View.Home} view={View.Home} label="Home" activeView={activeView} setActiveView={setActiveView} closeSidebar={closeSidebar}>
              <HomeIcon />
          </NavItem>
        </ul>
        {Object.keys(groupedNavItems).length > 0 && <hr className="my-2 border-[var(--border)]" />}
        {groupOrder.map((group) => (
            groupedNavItems[group] && (
                <React.Fragment key={group}>
                    <h3 className="px-3 pt-4 pb-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{group}</h3>
                    <ul>
                        {groupedNavItems[group].map(item => (
                            <NavItem key={item.view} view={item.view} label={item.label} activeView={activeView} setActiveView={setActiveView} closeSidebar={closeSidebar}>
                                {item.icon}
                            </NavItem>
                        ))}
                    </ul>
                </React.Fragment>
            )
        ))}
      </nav>
       <nav className="mt-4 flex-shrink-0">
        <hr className="my-2 border-[var(--border)]" />
        <ul>
           <NavItem view={View.ChangePassword} label="Change Password" activeView={activeView} setActiveView={setActiveView} closeSidebar={closeSidebar}>
               <ChangePasswordIcon />
           </NavItem>
           <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentUser) {
                    logSecurityEvent({ severity: 'Low', description: `User '${currentUser.name}' logged out.` });
                }
                logout();
                closeSidebar();
              }}
              className="flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-[var(--text-muted)] hover:bg-red-500 hover:text-white"
            >
              <LogoutIcon />
              <span className="ml-4 font-medium">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-4 p-4 text-center text-xs flex-shrink-0">
        <p className="text-[var(--text-muted)]">Logged in as: <span className="font-bold text-[var(--text-primary)]">{currentUser.name}</span></p>
        <p className="text-[var(--text-muted)]">&copy; {new Date().getFullYear()} {profile.businessName}.</p>
      </div>
    </aside>
  );
};

export default Sidebar;