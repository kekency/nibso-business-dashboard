import { GoogleGenAI } from "@google/genai";
import { ReceiptItem, BusinessProfile, DailySaleRecord, Student, Grade, FeePayment, AttendanceRecord, Course, User, SecurityEvent, Appointment, Cylinder, Promotion, Shipment, Viewing } from '../types';

// Do not throw an error, to prevent the app from crashing.
// The feature will be gracefully disabled if the key is not present.
const apiKey = import.meta.env?.VITE_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const API_KEY_ERROR_MESSAGE = "AI Service Error: Your VITE_API_KEY is not configured. Please follow these steps:\n1. Create a file named .env in the project's root directory.\n2. Add this line to it: VITE_API_KEY=your_google_api_key_here\n3. Restart the development server.";


export const generateReceipt = async (items: ReceiptItem[], profile: BusinessProfile, customerName: string, deliveryDetails?: { address: string; cost: number }): Promise<string> => {
    if (!ai) {
        return API_KEY_ERROR_MESSAGE;
    }
    
    if (!navigator.onLine) {
        return "Error: You are offline. Please connect to the internet to generate AI receipts.";
    }

    const itemsList = items.map(item => `- ${item.name} (Qty: ${item.quantity}, Price: ${profile.currency}${item.price.toFixed(2)} each)`).join('\n');
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxAmount = subtotal * (profile.taxRate / 100);
    const deliveryCost = deliveryDetails?.cost || 0;
    const total = subtotal + taxAmount + deliveryCost;

    const deliverySection = deliveryDetails
        ? `
Delivery Information:
- Deliver to: ${customerName}
- Address: ${deliveryDetails.address}
- Delivery Fee: ${profile.currency}${deliveryDetails.cost.toFixed(2)}
`
        : '';

    const prompt = `
Generate a professional customer receipt with the following details. Do not include any introductory or concluding remarks, just the receipt text itself.

Business Name: ${profile.businessName}
Business Address: ${profile.businessAddress}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Customer Name: ${customerName || 'Valued Customer'}

Items Purchased:
${itemsList}
${deliverySection}
-----------------------------------
Subtotal: ${profile.currency}${subtotal.toFixed(2)}
Tax (${profile.taxRate}%): ${profile.currency}${taxAmount.toFixed(2)}
${deliveryDetails ? `Delivery Fee: ${profile.currency}${deliveryDetails.cost.toFixed(2)}` : ''}
-----------------------------------
Total: ${profile.currency}${total.toFixed(2)}

Thank you for your business!
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating receipt with Gemini API:", error);
        return "Error: Could not generate receipt. Please check your network connection and API configuration.";
    }
};


export const generateSalesInsights = async (sales: DailySaleRecord[], profile: BusinessProfile): Promise<string> => {
    if (!ai) {
        return API_KEY_ERROR_MESSAGE;
    }

    if (!navigator.onLine) {
        return "Error: You are offline. Please connect to the internet to generate AI insights.";
    }
    
    if (sales.length < 3) {
        return "Not enough data to generate insights. Please record at least 3 days of sales.";
    }

    const salesDataString = "Date,Revenue,Transactions\n" + sales
        .map(s => `${s.date},${s.revenue},${s.transactions}`)
        .join('\n');

    const prompt = `
You are a business sales analyst for a company named "${profile.businessName}". The currency used is ${profile.currency}.
Based on the following daily sales data in CSV format, provide some actionable insights.

Analyze the data and identify:
- Key trends (e.g., is revenue increasing or decreasing?).
- Busiest days or periods.
- Potential areas for growth or concern.
- The average revenue per day.

Format your response clearly, using headings and bullet points. Be concise and direct. Do not include any introductory or concluding remarks, just the analysis.

Sales Data:
${salesDataString}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating sales insights with Gemini API:", error);
        return "Error: Could not generate insights. The AI service may be experiencing issues.";
    }
};

export const generateStudentSummary = async (
    student: Student,
    grades: Grade[],
    payments: FeePayment[],
    attendance: AttendanceRecord[],
    courses: Course[],
    profile: BusinessProfile
): Promise<string> => {
    if (!ai) {
        return API_KEY_ERROR_MESSAGE;
    }

    if (!navigator.onLine) {
        return "Error: You are offline. Please connect to the internet to generate AI summaries.";
    }
    
    if (grades.length === 0 && attendance.length === 0) {
        return "Not enough data to generate a summary. Please add some grades or attendance records for this student.";
    }

    const getCourseName = (courseId: string) => courses.find(c => c.id === courseId)?.name || 'Unknown Course';

    const gradesString = grades.length > 0 
        ? "Grades:\n" + grades.map(g => `- ${getCourseName(g.courseId)} (${g.term}): ${g.score}%`).join('\n')
        : "No grades recorded.";

    const totalFeesDue = payments.reduce((acc, p) => acc + p.totalAmount, 0);
    const totalFeesPaid = payments.reduce((acc, p) => acc + p.amountPaid, 0);
    const feeStatus = totalFeesDue > 0 
        ? `Fee Status: ${profile.currency}${totalFeesPaid.toLocaleString()} paid out of ${profile.currency}${totalFeesDue.toLocaleString()}.`
        : "No fee records found.";

    const attendanceSummary = attendance.length > 0 
        ? `Attendance Summary: ${attendance.filter(a => a.status === 'Present').length} Present, ${attendance.filter(a => a.status === 'Late').length} Late, ${attendance.filter(a => a.status === 'Absent').length} Absent.`
        : "No attendance records found.";

    const prompt = `
You are an academic advisor for a school named "${profile.businessName}".
You are writing a performance summary for a student that will be read by their teacher or parents.
The summary should be objective, encouraging, and easy to understand.

Based on the following data for the student, ${student.firstName} ${student.lastName}, provide a concise summary.

The summary should cover three main areas:
1.  **Academic Performance:** Analyze their grades. Highlight subjects where they are doing well and subjects that might need more attention. Calculate their average score.
2.  **Financial Status:** Briefly mention their fee payment status.
3.  **Attendance:** Comment on their attendance record.

Conclude with a supportive closing remark.
Format your response clearly, using headings (like ## Academic Performance) and bullet points. Be professional and encouraging. Do not include any introductory or concluding remarks outside of the summary itself.

Student Data:
- Name: ${student.firstName} ${student.lastName}
- Class: ${student.className}
- Student ID: ${student.studentId}

${gradesString}
${feeStatus}
${attendanceSummary}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating student summary with Gemini API:", error);
        return "Error: Could not generate summary. The AI service may be experiencing issues.";
    }
};

interface DailyBriefingData {
    profile: BusinessProfile;
    user: User;
    todaySales?: DailySaleRecord;
    lowStockCount: number;
    latestSecurityEvent?: SecurityEvent;
    // Industry specific
    appointmentsToday?: Appointment[];
    newStudentsToday?: Student[];
    faultyCylinders?: Cylinder[];
    inTransitShipments?: Shipment[];
    activePromotions?: Promotion[];
    viewingsToday?: Viewing[];
}

export const generateDailyBriefing = async (data: DailyBriefingData): Promise<string> => {
    if (!ai) {
        return API_KEY_ERROR_MESSAGE;
    }

    if (!navigator.onLine) {
        return "Error: You are offline. Please connect to the internet to generate AI insights.";
    }

    let contextSpecificInfo = '';
    switch (data.profile.businessType) {
        case 'Hospital':
            contextSpecificInfo = data.appointmentsToday?.length
                ? `You have ${data.appointmentsToday.length} appointment(s) scheduled for today.`
                : 'There are no appointments scheduled for today.';
            break;
        case 'Education':
            contextSpecificInfo = data.newStudentsToday?.length
                ? `There ${data.newStudentsToday.length === 1 ? 'is 1 new student' : `are ${data.newStudentsToday.length} new students`} registered today.`
                : 'No new students have been registered today.';
            break;
        case 'LPGStation':
            contextSpecificInfo = data.faultyCylinders?.length
                ? `There are ${data.faultyCylinders.length} cylinder(s) marked as faulty.`
                : 'No cylinders are currently marked as faulty.';
            break;
        case 'Supermarket':
             contextSpecificInfo = data.activePromotions?.length
                ? `There are ${data.activePromotions.length} active promotion(s) running right now.`
                : 'There are no active promotions.';
            break;
        case 'RealEstate':
            contextSpecificInfo = data.viewingsToday?.length
                ? `You have ${data.viewingsToday.length} property viewing(s) scheduled for today.`
                : 'There are no property viewings scheduled for today.';
            break;
         case 'General': // Includes Logistics
            contextSpecificInfo = data.inTransitShipments?.length
                ? `There are ${data.inTransitShipments.length} shipment(s) currently in-transit.`
                : 'There are no shipments currently in-transit.';
            break;
    }

    const prompt = `
You are a friendly and helpful executive assistant for "${data.profile.businessName}", a ${data.profile.businessType} business.
You are generating a morning briefing for ${data.user.name}.
Based on the following data points, create a very brief, scannable summary for the user.
Use a friendly and encouraging tone. Use emojis where appropriate.
Do not use markdown like headings or bullet points, just write a few short sentences.

Data Points:
- Today's Sales Revenue: ${data.profile.currency}${data.todaySales?.revenue.toLocaleString() || 0} from ${data.todaySales?.transactions || 0} transactions.
- Low Stock Items: ${data.lowStockCount} items are running low.
- Latest Security Event: ${data.latestSecurityEvent ? `${data.latestSecurityEvent.severity} severity - ${data.latestSecurityEvent.description}` : 'No new events.'}
- Business Context: ${contextSpecificInfo}

Example Output:
"Good morning, ${data.user.name}! ☀️ Here's your daily snapshot: Sales are at ${data.profile.currency}12,500 so far. You have 3 items running low on stock. Heads up, there's a new high-priority security alert. Also, you have 5 appointments scheduled for today. Have a productive day! 👍"
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating daily briefing with Gemini API:", error);
        return "Error: Could not generate briefing. The AI service may be experiencing issues.";
    }
};

export const generateAcademicAdvice = async (
    query: string,
    students: Student[],
    courses: Course[],
    grades: Grade[],
    profile: BusinessProfile
): Promise<string> => {
    if (!ai) {
        return API_KEY_ERROR_MESSAGE;
    }

    if (!navigator.onLine) {
        return "Error: You are offline. Please connect to the internet to use the AI advisor.";
    }
    
    if (students.length === 0 || courses.length === 0) {
        return "There is no academic data available to analyze. Please add students and courses first."
    }

    const getCourseName = (courseId: string) => courses.find(c => c.id === courseId)?.name || 'Unknown';

    // Simplified data representation to avoid hitting token limits
    const studentsDataString = students.map(s => 
        `ID: ${s.studentId}, Name: ${s.firstName} ${s.lastName}, Class: ${s.className}`
    ).join('\n');

    const gradesDataString = grades.map(g => {
        const student = students.find(s => s.id === g.studentId);
        return student ? `Student: ${student.studentId}, Course: ${getCourseName(g.courseId)}, Score: ${g.score}%` : '';
    }).filter(Boolean).join('\n');
    
    const coursesDataString = courses.map(c => `Code: ${c.code}, Name: ${c.name}, Class: ${c.className}`).join('\n');

    const prompt = `
You are an expert AI academic advisor for a school named "${profile.businessName}".
Your role is to analyze student data and provide clear, actionable advice to teachers and administrators.
You must answer the user's query based ONLY on the data provided below. Do not invent information.
If the data is insufficient to answer the query, state that clearly.

Here is the available data:

## Students
${studentsDataString}

## Courses
${coursesDataString}

## Grades
${gradesDataString}

--------------------

Based on the data above, please answer the following query from a staff member:

**Query: "${query}"**

Provide a concise, well-structured answer. Use markdown for formatting if it helps clarity (e.g., lists, bold text).
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating academic advice with Gemini API:", error);
        return "Error: Could not get advice from the AI service. It may be experiencing issues.";
    }
};