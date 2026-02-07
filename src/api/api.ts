// RecoverGuard AI - Mock API Service
import type {
    Alert,
    Patient,
    AuditLogEntry,
    ExplainResponse,
    ActionRequest,
    ConsentRequest
} from './types';

// In-memory mock data store
let alerts: Alert[] = [];
let patients: Map<string, Patient> = new Map();
let auditLog: AuditLogEntry[] = [];

// Initialize mock data
export function initializeMockData() {
    // Sample patients (TKR focus for demo)
    const patientsList: Patient[] = [
        {
            patient_id: 'P001',
            name: 'Rajesh Kumar',
            age: 67,
            gender: 'male',
            phone: '+91 98765 43210',
            surgery_type: 'TKR',
            discharge_date: '2026-02-03',
            days_post_discharge: 4,
            comorbidities: ['Diabetes Type 2', 'Hypertension'],
            distance_to_hospital_km: 45,
            caregiver: {
                name: 'Sunita Kumar',
                phone: '+91 98765 43211',
                relationship: 'Wife'
            },
            sdoh: {
                housing_stability: 'stable',
                transportation_access: true,
                food_security: true,
                social_support: 'high'
            },
            medications: [
                { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', last_taken: '2026-02-07T08:00:00Z' },
                { name: 'Ibuprofen', dosage: '400mg', frequency: 'After meals', last_taken: '2026-02-07T09:00:00Z' },
                { name: 'Enoxaparin', dosage: '40mg', frequency: 'Once daily', last_taken: '2026-02-06T20:00:00Z' }
            ],
            baselines: {
                pain_mean: 3.2,
                pain_std: 0.8,
                steps_expected: [500, 800, 1200, 1500, 2000, 2500, 3000],
                temp_mean: 98.4,
                temp_std: 0.3
            },
            engagement_metrics: {
                app_opens_last_7d: 12,
                data_submissions_last_7d: 4,
                response_rate: 0.85
            },
            risk_tier: 2,
            consent: {
                voice: true,
                photo: false,
                voice_timestamp: '2026-02-03T10:00:00Z'
            }
        },
        {
            patient_id: 'P002',
            name: 'Priya Sharma',
            age: 54,
            gender: 'female',
            phone: '+91 99887 65432',
            surgery_type: 'TKR',
            discharge_date: '2026-01-31',
            days_post_discharge: 7,
            comorbidities: ['Obesity'],
            distance_to_hospital_km: 12,
            sdoh: {
                housing_stability: 'stable',
                transportation_access: true,
                food_security: true,
                social_support: 'medium'
            },
            medications: [
                { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', last_taken: '2026-02-07T07:30:00Z' }
            ],
            baselines: {
                pain_mean: 2.8,
                pain_std: 0.6,
                steps_expected: [600, 1000, 1500, 2000, 2500, 3000, 3500],
                temp_mean: 98.2,
                temp_std: 0.25
            },
            engagement_metrics: {
                app_opens_last_7d: 18,
                data_submissions_last_7d: 7,
                response_rate: 1.0
            },
            risk_tier: 1,
            consent: {
                voice: false,
                photo: true,
                photo_timestamp: '2026-01-31T14:00:00Z'
            }
        },
        {
            patient_id: 'P003',
            name: 'Amit Verma',
            age: 72,
            gender: 'male',
            phone: '+91 97654 32109',
            surgery_type: 'TKR',
            discharge_date: '2026-02-04',
            days_post_discharge: 3,
            comorbidities: ['COPD', 'Diabetes Type 2', 'CKD Stage 2'],
            distance_to_hospital_km: 78,
            caregiver: {
                name: 'Rahul Verma',
                phone: '+91 97654 32110',
                relationship: 'Son'
            },
            sdoh: {
                housing_stability: 'stable',
                transportation_access: false,
                food_security: true,
                social_support: 'low'
            },
            medications: [
                { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily' },
                { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
            ],
            baselines: {
                pain_mean: 4.0,
                pain_std: 1.0,
                steps_expected: [300, 500, 800, 1000, 1200, 1500, 1800],
                temp_mean: 98.6,
                temp_std: 0.4
            },
            engagement_metrics: {
                app_opens_last_7d: 5,
                data_submissions_last_7d: 2,
                response_rate: 0.4
            },
            risk_tier: 3,
            consent: {
                voice: true,
                photo: true,
                voice_timestamp: '2026-02-04T11:00:00Z',
                photo_timestamp: '2026-02-04T11:00:00Z'
            }
        }
    ];

    patientsList.forEach(p => patients.set(p.patient_id, p));

    // Sample alerts matching exact schema
    alerts = [
        {
            alert_id: 'A001',
            patient_id: 'P001',
            timestamp: '2026-02-07T10:21:00Z',
            severity: 'red',
            metrics: [
                { name: 'pain_score', value: 7, baseline_mean: 3.2, baseline_std: 0.8 },
                { name: 'steps', value: 600, expected: 1500 },
                { name: 'temperature', value: 100.2, baseline_mean: 98.4, baseline_std: 0.3 }
            ],
            combined_score: 0.87,
            confidence: 0.82,
            confidence_interval: 0.08,
            reason: 'Pain ↑ 3.8 in 24h; steps -60% vs expected; temp elevated',
            recommended_action: 'nurse_call',
            status: 'open',
            repeat_count: 2,
            links: {
                patient: '/patient/P001',
                audit: '/audit/P001'
            }
        },
        {
            alert_id: 'A002',
            patient_id: 'P003',
            timestamp: '2026-02-07T09:45:00Z',
            severity: 'red',
            metrics: [
                { name: 'pain_score', value: 8, baseline_mean: 4.0, baseline_std: 1.0 },
                { name: 'steps', value: 150, expected: 800 }
            ],
            combined_score: 0.91,
            confidence: 0.78,
            confidence_interval: 0.12,
            reason: 'Pain ↑ 4 in 24h; mobility severely reduced; high-risk tier',
            recommended_action: 'nurse_call',
            status: 'open',
            repeat_count: 3,
            links: {
                patient: '/patient/P003',
                audit: '/audit/P003'
            }
        },
        {
            alert_id: 'A003',
            patient_id: 'P002',
            timestamp: '2026-02-07T08:30:00Z',
            severity: 'yellow',
            metrics: [
                { name: 'steps', value: 1800, expected: 3000 },
                { name: 'medication_adherence', value: 0.5, expected: 1.0 }
            ],
            combined_score: 0.62,
            confidence: 0.71,
            confidence_interval: 0.10,
            reason: 'Steps -40% vs expected; medication dose missed',
            recommended_action: 'nurse_call',
            status: 'open',
            repeat_count: 1,
            links: {
                patient: '/patient/P002',
                audit: '/audit/P002'
            }
        },
        {
            alert_id: 'A004',
            patient_id: 'P002',
            timestamp: '2026-02-06T14:00:00Z',
            severity: 'green',
            metrics: [
                { name: 'pain_score', value: 3, baseline_mean: 2.8, baseline_std: 0.6 },
                { name: 'steps', value: 2800, expected: 3000 }
            ],
            combined_score: 0.15,
            confidence: 0.92,
            confidence_interval: 0.04,
            reason: 'Recovery on track; minor step deficit within normal range',
            recommended_action: 'monitor',
            status: 'open',
            repeat_count: 0,
            links: {
                patient: '/patient/P002',
                audit: '/audit/P002'
            }
        }
    ];

    // Sample audit log
    auditLog = [
        {
            id: 'L001',
            timestamp: '2026-02-06T16:30:00Z',
            userId: 'nurse_priya',
            role: 'nurse',
            action: 'call',
            alert_id: 'A005',
            patient_id: 'P002',
            note: 'Called patient. Confirmed taking medications. Encouraged more walking.',
            previous_state: 'open'
        },
        {
            id: 'L002',
            timestamp: '2026-02-05T10:00:00Z',
            userId: 'nurse_rahul',
            role: 'nurse',
            action: 'message',
            patient_id: 'P001',
            note: 'Sent medication reminder SMS',
            previous_state: undefined
        }
    ];
}

// API Endpoints

// GET /api/alerts
export async function getAlerts(role?: string): Promise<Alert[]> {
    // Sort by severity (red first) then timestamp (newest first)
    const severityOrder = { red: 0, yellow: 1, green: 2 };
    return [...alerts].sort((a, b) => {
        const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (sevDiff !== 0) return sevDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
}

// GET /api/alerts/{id}
export async function getAlertById(alertId: string): Promise<Alert | null> {
    return alerts.find(a => a.alert_id === alertId) || null;
}

// POST /api/alerts/{id}/action
export async function postAlertAction(
    alertId: string,
    request: ActionRequest
): Promise<{ success: boolean; auditId: string }> {
    const alert = alerts.find(a => a.alert_id === alertId);
    if (!alert) throw new Error('Alert not found');

    const previousState = alert.status;

    // Update alert status
    if (request.action === 'dismiss') {
        alert.status = 'resolved';
    } else if (request.action === 'escalate') {
        alert.status = 'escalated';
    } else {
        alert.status = 'reviewed';
    }

    // Append to audit log
    const auditEntry: AuditLogEntry = {
        id: `L${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: request.userId,
        role: 'nurse',
        action: request.action,
        alert_id: alertId,
        patient_id: alert.patient_id,
        note: request.note,
        previous_state: previousState
    };
    auditLog.push(auditEntry);

    return { success: true, auditId: auditEntry.id };
}

// GET /api/patients/{id}
export async function getPatientById(patientId: string): Promise<Patient | null> {
    return patients.get(patientId) || null;
}

// POST /api/consent
export async function postConsent(request: ConsentRequest): Promise<{ success: boolean }> {
    const patient = patients.get(request.patientId);
    if (!patient) throw new Error('Patient not found');

    patient.consent[request.type] = request.consent;
    if (request.consent) {
        patient.consent[`${request.type}_timestamp`] = new Date().toISOString();
    }

    // Log consent event
    auditLog.push({
        id: `L${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: 'system',
        role: 'admin',
        action: request.consent ? 'consent_granted' : 'consent_revoked',
        patient_id: request.patientId,
        note: `${request.type} consent ${request.consent ? 'granted' : 'revoked'}`
    });

    return { success: true };
}

// GET /api/explain/{alert_id}
export async function getExplain(alertId: string): Promise<ExplainResponse | null> {
    const alert = alerts.find(a => a.alert_id === alertId);
    if (!alert) return null;

    const patient = patients.get(alert.patient_id);

    // Generate explanation based on metrics
    const factors: ExplainResponse['factors'] = alert.metrics.map(m => {
        let contribution = 0;
        let evidence = '';

        if (m.name === 'pain_score' && m.baseline_mean) {
            const zScore = (m.value - m.baseline_mean) / (m.baseline_std || 1);
            contribution = Math.min(Math.abs(zScore) / 5, 0.5);
            evidence = `Pain ${m.value} is ${zScore.toFixed(1)}σ above baseline (${m.baseline_mean})`;
        } else if (m.name === 'steps' && m.expected) {
            const deficit = 1 - (m.value / m.expected);
            contribution = deficit * 0.4;
            evidence = `Steps ${m.value} is ${(deficit * 100).toFixed(0)}% below expected (${m.expected})`;
        } else if (m.name === 'temperature' && m.baseline_mean) {
            const zScore = (m.value - m.baseline_mean) / (m.baseline_std || 0.3);
            contribution = Math.min(Math.abs(zScore) / 4, 0.3);
            evidence = `Temperature ${m.value}°F is elevated above baseline (${m.baseline_mean}°F)`;
        } else {
            contribution = 0.1;
            evidence = `${m.name}: ${m.value}`;
        }

        return {
            feature: m.name,
            contribution: Math.round(contribution * 100) / 100,
            evidence
        };
    });

    // Sort by contribution
    factors.sort((a, b) => b.contribution - a.contribution);

    return {
        alert_id: alertId,
        factors: factors.slice(0, 3), // Top 3
        confidence: alert.confidence,
        confidence_interval: alert.confidence_interval || 0.1,
        suggested_actions: [
            'Call patient to assess symptoms',
            'Review medication adherence',
            patient?.risk_tier === 3 ? 'Consider early physician consult' : 'Continue monitoring'
        ],
        human_readable_reason: alert.reason
    };
}

// GET /api/audit/{patientId}
export async function getAuditByPatient(patientId: string): Promise<AuditLogEntry[]> {
    return auditLog.filter(l => l.patient_id === patientId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// GET /api/metrics (admin)
export async function getMetrics() {
    return {
        total_patients: patients.size,
        active_alerts: alerts.filter(a => a.status === 'open').length,
        alerts_per_patient_day: 0.18,
        avg_nurse_action_time_min: 4.2,
        model_confidence_avg: 0.79,
        readmissions_avoided: 23,
        cost_savings_inr: 1035000
    };
}

// Initialize on import
initializeMockData();
