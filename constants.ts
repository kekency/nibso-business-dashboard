import { View } from './types';

export const DASHBOARD_TITLE: Record<View, string> = {
    // Core
    [View.Home]: 'Home',
    [View.Sales]: 'Sales Overview',
    [View.Security]: 'Security Center',
    [View.Reports]: 'Generated Reports',
    [View.Inventory]: 'Inventory Management',
    [View.Receipts]: 'Billing / Receipts',
    [View.Settings]: 'Business Settings',
    [View.DailySales]: 'Daily Sales Records',
    [View.Expenses]: 'Expense Tracking',
    [View.UserAccounts]: 'User Accounts',
    [View.DataImport]: 'Data & Import',
    [View.PointOfSale]: 'Point of Sale',
    [View.AccessDenied]: 'Access Denied',
    [View.ChangePassword]: 'Change Password',
    [View.CostAnalysisReport]: 'App Development Cost Analysis',

    // Logistics
    [View.Logistics]: 'Logistics & Shipments',

    // Hospital
    [View.Patients]: 'Patient Management',
    [View.Appointments]: 'Appointment Scheduler',

    // LPG Station
    [View.CylinderInventory]: 'Cylinder Inventory',
    [View.SafetyChecklists]: 'Safety Checklists',
    [View.BulkSupplyLog]: 'Bulk Supply Log',
    
    // Supermarket
    [View.StockAlerts]: 'Low Stock Alerts',
    [View.Suppliers]: 'Supplier Management',
    [View.Promotions]: 'Promotions & Discounts',
    [View.Loyalty]: 'Customer Loyalty',
    
    // Retail/General
    [View.Crm]: 'Customer Relationship Management',
    
    // Education
    [View.Students]: 'Student Management',
    [View.Courses]: 'Course Management',
    [View.Timetable]: 'Class Timetable',
    [View.Grades]: 'Gradebook',
    [View.Fees]: 'Fee Management',
    [View.Attendance]: 'Attendance Tracking',
    [View.StaffManagement]: 'User Management',
    [View.Payroll]: 'Staff Payroll',
    [View.StudentProfile]: 'Student Profile',
    [View.AcademicCalendar]: 'Academic Calendar',
    [View.AcademicAdvising]: 'Academic Advising',

    // Real Estate
    [View.Properties]: 'Property Management',
    [View.Leases]: 'Lease Management',
    [View.Viewings]: 'Viewing Scheduler',

    // Modals
    [View.QRCodeScanner]: 'Scan QR Code',
    [View.QRCodeDisplay]: 'Product QR Code',
    [View.PrintLoginSlip]: 'Print Login Slip',
    [View.EditStudent]: 'Edit Student Profile',
    [View.AddTimetableEntry]: 'Add/Edit Timetable Entry',
};