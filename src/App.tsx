import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './i18n/i18n';
import './index.css';

// Layouts
import NurseLayout from './pages/nurse/NurseLayout';

// Pages
import AlertInbox from './pages/alerts/AlertInbox';
import PatientNarrative from './pages/patient/PatientNarrative';
import AuditTrailPage from './pages/nurse/AuditTrail';
import SettingsPage from './pages/settings/SettingsPage';
import RoleSelector from './pages/RoleSelector';

// Patient Portal (existing)
import PatientLayout from './pages/patient/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import DailyDataEntry from './pages/patient/DailyDataEntry';
import RecoveryTimeline from './pages/patient/RecoveryTimeline';
import PatientAlerts from './pages/patient/PatientAlerts';

function App() {
    const [role, setRole] = useState<'patient' | 'nurse' | 'admin' | null>(null);

    const handleLogout = () => {
        setRole(null);
    };

    // Role selection screen
    if (!role) {
        return (
            <BrowserRouter>
                <RoleSelector onSelectRole={setRole} />
            </BrowserRouter>
        );
    }

    // Patient Portal
    if (role === 'patient') {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PatientLayout onLogout={handleLogout} />}>
                        <Route index element={<PatientDashboard />} />
                        <Route path="log" element={<DailyDataEntry />} />
                        <Route path="timeline" element={<RecoveryTimeline />} />
                        <Route path="alerts" element={<PatientAlerts />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        );
    }

    // Nurse Portal (Specification Exact Routes)
    if (role === 'nurse') {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<NurseLayout onLogout={handleLogout} />}>
                        <Route index element={<Navigate to="/alerts" replace />} />
                        <Route path="alerts" element={<AlertInbox />} />
                        <Route path="patient/:id" element={<PatientNarrative />} />
                        <Route path="audit" element={<AuditTrailPage />} />
                        <Route path="audit/:patientId" element={<AuditTrailPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/alerts" replace />} />
                </Routes>
            </BrowserRouter>
        );
    }

    // Admin Portal (uses same layout for now)
    if (role === 'admin') {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<NurseLayout onLogout={handleLogout} />}>
                        <Route index element={<Navigate to="/alerts" replace />} />
                        <Route path="alerts" element={<AlertInbox />} />
                        <Route path="patient/:id" element={<PatientNarrative />} />
                        <Route path="audit" element={<AuditTrailPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/alerts" replace />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return null;
}

export default App;
