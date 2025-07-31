import { View, UserRole } from './types';

const allViews = Object.values(View);

const managerViews: View[] = [
    View.Home,
    View.PointOfSale,
    View.DailySales,
    View.Sales,
    View.Inventory,
    View.DataImport,
    View.Receipts,
    View.Expenses,
    View.ChangePassword,
    View.Reports,
    View.CostAnalysisReport,
    View.Crm,
    // Industry specific
    View.Logistics,
    View.Patients,
    View.Appointments,
    View.CylinderInventory,
    View.SafetyChecklists,
    View.BulkSupplyLog,
    View.StockAlerts,
    View.Suppliers,
    View.Promotions,
    View.Loyalty,
    // Education
    View.Students,
    View.Courses,
    View.Timetable,
    View.Grades,
    View.Fees,
    View.Attendance,
    View.StaffManagement,
    View.Payroll,
    View.StudentProfile,
    View.AcademicCalendar,
    View.AcademicAdvising,
    // Real Estate
    View.Properties,
    View.Leases,
    View.Viewings,
];

const teacherViews: View[] = [
    View.Home,
    View.Students,
    View.Courses,
    View.Timetable,
    View.Grades,
    View.Attendance,
    View.ChangePassword,
    View.StudentProfile,
    View.AcademicAdvising,
];

const nonTeachingViews: View[] = [
    View.Home,
    View.ChangePassword,
];

const cashierViews: View[] = [
    View.Home,
    View.PointOfSale,
    View.DailySales,
    View.Receipts,
    View.Inventory,
    View.ChangePassword,
];

const studentAdvisorViews: View[] = [
    View.Home,
    View.StudentProfile,
    View.Courses,
    View.Grades,
    View.Attendance,
    View.AcademicAdvising,
    View.ChangePassword,
];


export const PERMISSIONS: Record<UserRole, View[]> = {
    Proprietor: allViews,
    Admin: allViews,
    Manager: [...managerViews, View.AddTimetableEntry],
    Cashier: cashierViews,
    Attendant: cashierViews, // Attendant has same permissions as Cashier
    Teacher: [...teacherViews, View.AddTimetableEntry],
    'Non-Teaching': nonTeachingViews,
    StudentAdvisor: studentAdvisorViews,
};