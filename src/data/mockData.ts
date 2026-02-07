// Mock Data for RecoverGuard AI

export interface Patient {
    id: string;
    name: string;
    age: number;
    surgeryType: string;
    dischargeDate: Date;
    tier: 1 | 2 | 3;
    daysPostDischarge: number;
    status: 'green' | 'yellow' | 'red';
    photo?: string;
    assignedNurseId: string;
    baselineParams: {
        expectedPainCurve: number[];
        expectedStepCurve: number[];
    };
}

export interface DailyLog {
    date: Date;
    painScore: number;
    temperature: number;
    steps: number;
    medicationsTaken: boolean;
    notes?: string;
}

export interface Alert {
    id: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    surgeryType: string;
    daysPostDischarge: number;
    severity: 'red' | 'yellow' | 'green';
    reason: string;
    confidence: number;
    contributingSignals: { signal: string; weight: number }[];
    status: 'pending' | 'reviewed' | 'resolved' | 'escalated';
    createdAt: Date;
}

export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    nurseName: string;
    patientName: string;
    alertType: string;
    actionTaken: string;
}

// Current logged-in patient (mock)
export const currentPatient: Patient = {
    id: 'p1',
    name: 'Rajesh Kumar',
    age: 67,
    surgeryType: 'TKR (Total Knee Replacement)',
    dischargeDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    tier: 2,
    daysPostDischarge: 4,
    status: 'yellow',
    assignedNurseId: 'n1',
    baselineParams: {
        expectedPainCurve: [7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 0],
        expectedStepCurve: [500, 800, 1200, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500],
    },
};

// Recovery data for charts
export const recoveryData = [
    { day: 1, expected: 7, actual: 7, steps: 520, expectedSteps: 500 },
    { day: 2, expected: 6, actual: 6, steps: 850, expectedSteps: 800 },
    { day: 3, expected: 5, actual: 5, steps: 1100, expectedSteps: 1200 },
    { day: 4, expected: 4, actual: 6, steps: 600, expectedSteps: 1500 },
];

// Daily logs
export const dailyLogs: DailyLog[] = [
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), painScore: 7, temperature: 98.6, steps: 520, medicationsTaken: true },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), painScore: 6, temperature: 98.8, steps: 850, medicationsTaken: true },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), painScore: 5, temperature: 99.1, steps: 1100, medicationsTaken: true },
    { date: new Date(), painScore: 6, temperature: 99.8, steps: 600, medicationsTaken: false },
];

// Medications
export const medications = [
    { id: 'm1', name: 'Paracetamol 500mg', frequency: 'Twice daily', taken: true },
    { id: 'm2', name: 'Ibuprofen 400mg', frequency: 'After meals', taken: true },
    { id: 'm3', name: 'Calcium + Vitamin D', frequency: 'Once daily', taken: false },
    { id: 'm4', name: 'Antibiotic (Amoxicillin)', frequency: 'Three times daily', taken: true },
];

// Alerts for nurse dashboard
export const alerts: Alert[] = [
    {
        id: 'a1',
        patientId: 'p1',
        patientName: 'Rajesh Kumar',
        patientAge: 67,
        surgeryType: 'TKR',
        daysPostDischarge: 4,
        severity: 'red',
        reason: 'Pain +3 over 24h, Steps -60%, Temperature elevated',
        confidence: 82,
        contributingSignals: [
            { signal: 'Pain increase', weight: 0.4 },
            { signal: 'Activity decrease', weight: 0.35 },
            { signal: 'Temperature spike', weight: 0.25 },
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
        id: 'a2',
        patientId: 'p2',
        patientName: 'Priya Sharma',
        patientAge: 54,
        surgeryType: 'CABG',
        daysPostDischarge: 7,
        severity: 'red',
        reason: 'Wound redness reported, Pain +2',
        confidence: 78,
        contributingSignals: [
            { signal: 'Visual wound change', weight: 0.5 },
            { signal: 'Pain increase', weight: 0.3 },
            { signal: 'Low activity', weight: 0.2 },
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
        id: 'a3',
        patientId: 'p3',
        patientName: 'Amit Patel',
        patientAge: 45,
        surgeryType: 'Hernia',
        daysPostDischarge: 3,
        severity: 'yellow',
        reason: 'Steps significantly below baseline',
        confidence: 65,
        contributingSignals: [
            { signal: 'Activity decrease', weight: 0.6 },
            { signal: 'Pain stable', weight: 0.4 },
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: 'a4',
        patientId: 'p4',
        patientName: 'Sunita Reddy',
        patientAge: 62,
        surgeryType: 'TKR',
        daysPostDischarge: 5,
        severity: 'yellow',
        reason: 'Medication non-adherence (2 doses missed)',
        confidence: 72,
        contributingSignals: [
            { signal: 'Medication missed', weight: 0.7 },
            { signal: 'Pain stable', weight: 0.3 },
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
        id: 'a5',
        patientId: 'p5',
        patientName: 'Vikram Singh',
        patientAge: 58,
        surgeryType: 'CABG',
        daysPostDischarge: 10,
        severity: 'green',
        reason: 'Routine check - all parameters normal',
        confidence: 95,
        contributingSignals: [
            { signal: 'Pain on track', weight: 0.5 },
            { signal: 'Activity on track', weight: 0.5 },
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
];

// Patients list for admin
export const patients: Patient[] = [
    { ...currentPatient },
    {
        id: 'p2',
        name: 'Priya Sharma',
        age: 54,
        surgeryType: 'CABG',
        dischargeDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        tier: 2,
        daysPostDischarge: 7,
        status: 'red',
        assignedNurseId: 'n1',
        baselineParams: { expectedPainCurve: [], expectedStepCurve: [] },
    },
    {
        id: 'p3',
        name: 'Amit Patel',
        age: 45,
        surgeryType: 'Hernia',
        dischargeDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tier: 1,
        daysPostDischarge: 3,
        status: 'yellow',
        assignedNurseId: 'n2',
        baselineParams: { expectedPainCurve: [], expectedStepCurve: [] },
    },
    {
        id: 'p4',
        name: 'Sunita Reddy',
        age: 62,
        surgeryType: 'TKR',
        dischargeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tier: 2,
        daysPostDischarge: 5,
        status: 'yellow',
        assignedNurseId: 'n1',
        baselineParams: { expectedPainCurve: [], expectedStepCurve: [] },
    },
    {
        id: 'p5',
        name: 'Vikram Singh',
        age: 58,
        surgeryType: 'CABG',
        dischargeDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        tier: 1,
        daysPostDischarge: 10,
        status: 'green',
        assignedNurseId: 'n2',
        baselineParams: { expectedPainCurve: [], expectedStepCurve: [] },
    },
];

// Audit log
export const auditLog: AuditLogEntry[] = [
    { id: '1', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), nurseName: 'Nurse Priya', patientName: 'Vikram Singh', alertType: 'Yellow - Low Activity', actionTaken: 'Phone call - Encouraged mobility' },
    { id: '2', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), nurseName: 'Nurse Rahul', patientName: 'Sunita Reddy', alertType: 'Yellow - Medication', actionTaken: 'SMS reminder sent' },
    { id: '3', timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), nurseName: 'Nurse Priya', patientName: 'Amit Patel', alertType: 'Green - Routine', actionTaken: 'Marked as reviewed' },
];

// Upcoming checkups
export const upcomingCheckups = [
    { id: '1', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), type: 'Video Consultation', doctor: 'Dr. Mehta' },
    { id: '2', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), type: 'Clinic Visit', doctor: 'Dr. Sharma' },
];

// Daily tips based on surgery type
export const dailyTips = [
    { id: '1', tip: 'Gentle knee bends every 2 hours help improve flexibility and reduce stiffness.' },
    { id: '2', tip: 'Keep your surgical leg elevated when resting to reduce swelling.' },
    { id: '3', tip: 'Ice your knee for 15-20 minutes, 3-4 times a day to manage pain.' },
    { id: '4', tip: 'Stay hydrated! Aim for 8 glasses of water to aid recovery.' },
];

// Patient notifications
export const patientNotifications = [
    { id: '1', type: 'alert', message: 'Your recovery shows a small deviation. Nurse will review within 2 hours.', timestamp: new Date(Date.now() - 30 * 60 * 1000), priority: 'yellow' },
    { id: '2', type: 'message', message: 'Great progress on your walking! Keep it up.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), priority: 'green' },
    { id: '3', type: 'reminder', message: 'Video consultation with Dr. Mehta in 3 days.', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), priority: 'green' },
];

// Analytics data for admin
export const analyticsData = {
    totalPatients: 128,
    activeAlerts: 14,
    readmissionsAvoided: 23,
    costSavings: 1035000, // in INR
    alertPrecisionOverTime: [
        { month: 'Aug', precision: 68 },
        { month: 'Sep', precision: 72 },
        { month: 'Oct', precision: 75 },
        { month: 'Nov', precision: 79 },
        { month: 'Dec', precision: 82 },
        { month: 'Jan', precision: 85 },
    ],
    alertsBySurgeryType: [
        { type: 'TKR', alerts: 45 },
        { type: 'CABG', alerts: 38 },
        { type: 'Hernia', alerts: 22 },
        { type: 'Other', alerts: 15 },
    ],
};
