// RecoverGuard AI - API Types (Exact Specification)

// Alert Schema (Mandatory)
export interface AlertMetric {
    name: string;
    value: number;
    baseline_mean?: number;
    baseline_std?: number;
    expected?: number;
}

export interface Alert {
    alert_id: string;
    patient_id: string;
    timestamp: string;
    severity: 'red' | 'yellow' | 'green';
    metrics: AlertMetric[];
    combined_score: number;
    confidence: number;
    confidence_interval?: number; // ± value
    reason: string;
    recommended_action: 'nurse_call' | 'physician_escalate' | 'monitor' | 'dismiss';
    status: 'open' | 'reviewed' | 'resolved' | 'escalated';
    repeat_count: number;
    links: {
        patient: string;
        audit: string;
    };
}

// Patient Object with Extensions
export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    last_taken?: string;
}

export interface Baseline {
    pain_mean: number;
    pain_std: number;
    steps_expected: number[];
    temp_mean: number;
    temp_std: number;
}

export interface EngagementMetrics {
    app_opens_last_7d: number;
    data_submissions_last_7d: number;
    response_rate: number;
}

export interface Patient {
    patient_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    surgery_type: string;
    discharge_date: string;
    days_post_discharge: number;
    comorbidities: string[];
    distance_to_hospital_km: number;
    caregiver?: {
        name: string;
        phone: string;
        relationship: string;
    };
    // SDoH fields
    sdoh: {
        housing_stability: 'stable' | 'unstable' | 'unknown';
        transportation_access: boolean;
        food_security: boolean;
        social_support: 'high' | 'medium' | 'low';
    };
    medications: Medication[];
    baselines: Baseline;
    engagement_metrics: EngagementMetrics;
    risk_tier: 1 | 2 | 3;
    consent: {
        voice: boolean;
        photo: boolean;
        voice_timestamp?: string;
        photo_timestamp?: string;
    };
}

// Audit Log (Append-only)
export interface AuditLogEntry {
    id: string;
    timestamp: string;
    userId: string;
    role: 'nurse' | 'physician' | 'admin' | 'auditor';
    action: 'call' | 'message' | 'escalate' | 'dismiss' | 'consent_granted' | 'consent_revoked';
    alert_id?: string;
    patient_id: string;
    note: string;
    previous_state?: string;
}

// Explain Response
export interface ExplainFactor {
    feature: string;
    contribution: number;
    evidence: string;
    evidence_link?: string;
}

export interface ExplainResponse {
    alert_id: string;
    factors: ExplainFactor[];
    confidence: number;
    confidence_interval: number;
    suggested_actions: string[];
    human_readable_reason: string;
}

// Consent Request
export interface ConsentRequest {
    patientId: string;
    type: 'voice' | 'photo';
    consent: boolean;
    signature?: string;
}

// Action Request
export interface ActionRequest {
    action: 'call' | 'message' | 'escalate' | 'dismiss';
    userId: string;
    note: string;
}

// Recovery Data Point (for charts)
export interface RecoveryDataPoint {
    day: number;
    date: string;
    pain_actual?: number;
    pain_expected: number;
    pain_upper: number;
    pain_lower: number;
    steps_actual?: number;
    steps_expected: number;
    temp_actual?: number;
}

// Tiered Monitoring
export type MonitoringTier = 1 | 2 | 3;
// Tier 1: pain, temp, steps - EWMA/CUSUM - nurse triage
// Tier 2: + wound photo (opt-in), voice (opt-in), digital twin
// Tier 3: + predictive twin, SDoH orchestration
