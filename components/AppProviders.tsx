import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { BusinessProvider } from '../contexts/BusinessContext';
import { InventoryProvider } from '../contexts/InventoryContext';
import { SalesProvider } from '../contexts/SalesContext';
import { SecurityProvider } from '../contexts/SecurityContext';
import { LogisticsProvider } from '../contexts/LogisticsContext';
import { PatientProvider } from '../contexts/PatientContext';
import { AppointmentProvider } from '../contexts/AppointmentContext';
import { CylinderProvider } from '../contexts/CylinderContext';
import { SafetyChecklistProvider } from '../contexts/SafetyChecklistContext';
import { BulkSupplyProvider } from '../contexts/BulkSupplyContext';
import { SuppliersProvider } from '../contexts/SuppliersContext';
import { PromotionsProvider } from '../contexts/PromotionsContext';
import { LoyaltyProvider } from '../contexts/LoyaltyContext';
import { UsersProvider } from '../contexts/UsersContext';
import { ExpensesProvider } from '../contexts/ExpensesContext';
import { StudentProvider } from '../contexts/StudentContext';
import { CourseProvider } from '../contexts/CourseContext';
import { GradeProvider } from '../contexts/GradeContext';
import { FeeProvider } from '../contexts/FeeContext';
import { AttendanceProvider } from '../contexts/AttendanceContext';
import { PayrollProvider } from '../contexts/PayrollContext';
import { AcademicCalendarProvider } from '../contexts/AcademicCalendarContext';
import { TimetableProvider } from '../contexts/TimetableContext';
import { CrmProvider } from '../contexts/CrmContext';
import { PropertyProvider } from '../contexts/PropertyContext';
import { LeaseProvider } from '../contexts/LeaseContext';
import { ViewingProvider } from '../contexts/ViewingContext';

// This component consolidates all context providers into a single place
// to avoid the "pyramid of doom" in the main index.tsx file.
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthProvider>
            <BusinessProvider>
                <UsersProvider>
                    <ExpensesProvider>
                        <InventoryProvider>
                            <SalesProvider>
                                <SecurityProvider>
                                    <CrmProvider>
                                        <LogisticsProvider>
                                            <PatientProvider>
                                                <AppointmentProvider>
                                                    <CylinderProvider>
                                                        <SafetyChecklistProvider>
                                                            <BulkSupplyProvider>
                                                                <SuppliersProvider>
                                                                    <PromotionsProvider>
                                                                        <LoyaltyProvider>
                                                                            <StudentProvider>
                                                                                <CourseProvider>
                                                                                    <GradeProvider>
                                                                                        <FeeProvider>
                                                                                            <AttendanceProvider>
                                                                                                <PayrollProvider>
                                                                                                    <AcademicCalendarProvider>
                                                                                                        <TimetableProvider>
                                                                                                            <PropertyProvider>
                                                                                                                <LeaseProvider>
                                                                                                                    <ViewingProvider>
                                                                                                                        {children}
                                                                                                                    </ViewingProvider>
                                                                                                                </LeaseProvider>
                                                                                                            </PropertyProvider>
                                                                                                        </TimetableProvider>
                                                                                                    </AcademicCalendarProvider>
                                                                                                </PayrollProvider>
                                                                                            </AttendanceProvider>
                                                                                        </FeeProvider>
                                                                                    </GradeProvider>
                                                                                </CourseProvider>
                                                                            </StudentProvider>
                                                                        </LoyaltyProvider>
                                                                    </PromotionsProvider>
                                                                </SuppliersProvider>
                                                            </BulkSupplyProvider>
                                                        </SafetyChecklistProvider>
                                                    </CylinderProvider>
                                                </AppointmentProvider>
                                            </PatientProvider>
                                        </LogisticsProvider>
                                    </CrmProvider>
                                </SecurityProvider>
                            </SalesProvider>
                        </InventoryProvider>
                    </ExpensesProvider>
                </UsersProvider>
            </BusinessProvider>
        </AuthProvider>
    );
};