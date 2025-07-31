export enum View {
    // Core Views
    Home = 'Home',
    Sales = 'Sales',
    Security = 'Security',
    Reports = 'Reports',
    Inventory = 'Inventory',
    Receipts = 'Receipts',
    Settings = 'Settings',
    DailySales = 'DailySales',
    Expenses = 'Expenses',
    UserAccounts = 'UserAccounts',
    DataImport = 'DataImport',
    PointOfSale = 'PointOfSale',
    ChangePassword = 'ChangePassword',
    AccessDenied = 'AccessDenied',
    CostAnalysisReport = 'CostAnalysisReport',

    // Logistics Views
    Logistics = 'Logistics',

    // Hospital Views
    Patients = 'Patients',
    Appointments = 'Appointments',

    // LPG Views
    CylinderInventory = 'CylinderInventory',
    SafetyChecklists = 'SafetyChecklists',
    BulkSupplyLog = 'BulkSupplyLog',

    // Supermarket Views
    StockAlerts = 'StockAlerts',
    Suppliers = 'Suppliers',
    Promotions = 'Promotions',
    Loyalty = 'Loyalty',
    
    // Retail/General
    Crm = 'Crm',
    
    // Education Views
    Students = 'Students',
    Courses = 'Courses',
    Timetable = 'Timetable',
    Grades = 'Grades',
    Fees = 'Fees',
    Attendance = 'Attendance',
    StaffManagement = 'UserManagement',
    Payroll = 'Payroll',
    StudentProfile = 'StudentProfile',
    AcademicCalendar = 'AcademicCalendar',
    AcademicAdvising = 'AcademicAdvising',

    // Real Estate Views
    Properties = 'Properties',
    Leases = 'Leases',
    Viewings = 'Viewings',

    // Modals
    QRCodeScanner = 'QRCodeScanner',
    QRCodeDisplay = 'QRCodeDisplay',
    PrintLoginSlip = 'PrintLoginSlip',
    EditStudent = 'EditStudent',
    AddTimetableEntry = 'AddTimetableEntry',
}

export enum BusinessType {
    General = 'General',
    Hospital = 'Hospital',
    LPGStation = 'LPGStation',
    Supermarket = 'Supermarket',
    Education = 'Education',
    RealEstate = 'RealEstate',
}

export interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    price: number;
    category: string;
    imageUrl?: string;
    // Supermarket specific
    department?: string;
    reorderLevel?: number;
    supplierId?: string;
}

export interface TransactionItem extends InventoryItem {
    quantity: number;
}

export interface Report {
    id: string;
    name: string;
    date: string;
    type: 'PDF' | 'Excel' | 'CSV' | 'View';
    view?: View;
}

export interface SecurityEvent {
    id: string;
    timestamp: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
}

export interface ReceiptItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  input: string;
}

export interface BusinessProfile {
    businessName: string;
    businessAddress: string;
    currency: string;
    taxRate: number;
    logoUrl?: string;
    theme?: ThemeColors;
    businessType?: BusinessType;
    isConfigured?: boolean;
}

export interface DailySaleRecord {
    id: string;
    date: string; // YYYY-MM-DD
    revenue: number;
    transactions: number;
}

export interface Expense {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
}

export type UserRole = 'Proprietor' | 'Manager' | 'Cashier' | 'Attendant' | 'Teacher' | 'Non-Teaching' | 'Admin' | 'StudentAdvisor';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    passwordLastChanged?: string;
    salary?: number;
    // Hospital specific
    specialty?: string;
    // Education specific
    assignedClass?: string;
}

// Logistics
export type ShipmentStatus = 'Pending' | 'In-Transit' | 'Delivered' | 'Cancelled';
export interface Shipment {
    id: string;
    trackingNumber: string;
    customerName: string;
    destination: string;
    estimatedDelivery: string; // YYYY-MM-DD
    status: ShipmentStatus;
    driverId?: string;
    sourceRequestId?: string; // Link back to CRM
    sourceTransactionId?: string; // Link back to POS
}
export interface Driver {
    id: string;
    name: string;
}

// Hospital
export interface Patient {
    id: string;
    patientId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    bloodType: string;
    phone: string;
    address: string;
    medicalHistorySummary: string;
}
export interface Doctor {
    id: string; // This will be the User's ID
    name: string;
    specialty: string;
}
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    date: string; // ISO string with time
    reason: string;
    status: AppointmentStatus;
}

// LPG Station
export type CylinderStatus = 'Full' | 'Empty' | 'Faulty';
export interface Cylinder {
    id: string;
    size: number; // in kg
    status: CylinderStatus;
}
export interface SafetyChecklist {
    id: string;
    name: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    tasks: { id: string; description: string; }[];
    lastCompleted?: string;
}
export interface BulkSupply {
    id: string;
    date: string;
    supplierName: string;
    quantityKg: number;
    costPerKg: number;
}

// Supermarket
export interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
}
export type PromotionType = 'percentage';
export interface Promotion {
    id: string;
    description: string;
    type: PromotionType;
    value: number; // e.g., 10 for 10%
    target: 'item' | 'category';
    targetId: string; // item ID or category name
    startDate: string;
    endDate: string;
}
export interface LoyaltyMember {
    id: string;
    name: string;
    phone: string;
    points: number;
}

// Education
export interface Student {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    className: string; // e.g., 'JSS 1', 'Grade 5'
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    address: string;
    advisorId?: string;
    riskLevel?: 'None' | 'Low' | 'Medium' | 'High';
    lastContact?: string; // ISO date string
}

export interface Course {
    id: string;
    name: string;
    code: string;
    className: string;
    teacherId?: string; // from User.id where role is 'Teacher'
}

export interface Grade {
    id:string;
    studentId: string;
    courseId: string;
    term: string; // e.g., 'First Term 2024/2025'
    score: number;
}

export interface FeePayment {
    id: string;
    studentId: string;
    amountPaid: number;
    totalAmount: number;
    date: string;
    term: string;
    status: 'Paid' | 'Partial' | 'Unpaid';
}

export interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string; // YYYY-MM-DD
    status: 'Present' | 'Absent' | 'Late';
}

export interface PayrollRecord {
    id: string;
    userId: string;
    userName: string;
    month: string; // e.g., "August 2024"
    amountDue: number;
    amountPaid: number;
    paymentDate: string; // YYYY-MM-DD
    status: 'Paid' | 'Partial' | 'Unpaid';
}

export interface TimetableEntry {
    id: string;
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    timeSlot: string; // e.g., '09:00 - 10:00'
    courseId: string;
    className: string;
}

export interface Term {
    id: string;
    name: string; // e.g., 'First Term'
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
}

export interface AcademicSession {
    id: string;
    name: string; // e.g., '2024/2025 Session'
    terms: Term[];
}

// CRM
export type CustomerRequestStatus = 'New' | 'Assigned' | 'Processing' | 'Ready for Shipment' | 'Shipped' | 'Completed';

export interface CustomerRequest {
    id: string;
    customerId: string;
    customerName: string;
    customerContact: string;
    requestDetails: string;
    status: CustomerRequestStatus;
    agentId?: string; // User ID of the assigned agent
    createdAt: string;
}

// Real Estate
export type PropertyStatus = 'Available' | 'Rented' | 'Sold';
export interface Property {
    id: string;
    title: string;
    address: string;
    type: 'Apartment' | 'House' | 'Office' | 'Land';
    status: PropertyStatus;
    price: number; // Sale price or rent per period
    size: number; // in square meters/feet
    bedrooms?: number;
    bathrooms?: number;
    imageUrl?: string;
}

export interface Lease {
    id: string;
    propertyId: string;
    tenantName: string;
    tenantContact: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    rentAmount: number;
    paymentStatus: 'Paid' | 'Due' | 'Overdue';
}

export type ViewingStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export interface Viewing {
    id: string;
    propertyId: string;
    clientName: string;
    clientContact: string;
    agentId: string; // User ID
    date: string; // ISO string with time
    status: ViewingStatus;
}