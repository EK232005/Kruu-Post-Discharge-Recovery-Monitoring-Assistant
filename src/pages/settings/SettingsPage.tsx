import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Settings,
    Bell,
    Shield,
    Users,
    Save,
    Plus,
    Trash2
} from 'lucide-react';

export default function SettingsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('thresholds');
    const [dataResidency, setDataResidency] = useState('india');

    const tabs = [
        { id: 'thresholds', label: t('settings.thresholds'), icon: Bell },
        { id: 'notifications', label: t('settings.notifications'), icon: Bell },
        { id: 'users', label: t('settings.users'), icon: Users },
        { id: 'data', label: t('settings.dataResidency'), icon: Shield },
    ];

    const surgeryThresholds = [
        { type: 'TKR', painDelta: 2, stepsDelta: 40, tempThreshold: 100.4, hysteresisHours: 6 },
        { type: 'CABG', painDelta: 3, stepsDelta: 50, tempThreshold: 100.0, hysteresisHours: 6 },
        { type: 'Hernia', painDelta: 2, stepsDelta: 30, tempThreshold: 100.4, hysteresisHours: 6 },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={24} aria-hidden="true" />
                    {t('settings.title')}
                </h1>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                overflowX: 'auto'
            }} role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        onClick={() => setActiveTab(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                    >
                        <tab.icon size={16} aria-hidden="true" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Alert Thresholds */}
            {activeTab === 'thresholds' && (
                <div className="card" role="tabpanel">
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                        Alert Threshold Configuration
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
                        Configure deviation thresholds by surgery type. Alerts require 2 consecutive abnormal readings
                        OR persistence beyond the hysteresis period (configurable).
                    </p>

                    <div className="table-container" style={{ boxShadow: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Surgery Type</th>
                                    <th>Pain Delta (±)</th>
                                    <th>Steps Delta (%)</th>
                                    <th>Temp (°F)</th>
                                    <th>Hysteresis (h)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {surgeryThresholds.map((surgery, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: 500 }}>{surgery.type}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-input"
                                                defaultValue={surgery.painDelta}
                                                style={{ width: '70px', height: '36px' }}
                                                aria-label={`Pain delta for ${surgery.type}`}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-input"
                                                defaultValue={surgery.stepsDelta}
                                                style={{ width: '70px', height: '36px' }}
                                                aria-label={`Steps delta for ${surgery.type}`}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="form-input"
                                                defaultValue={surgery.tempThreshold}
                                                style={{ width: '80px', height: '36px' }}
                                                aria-label={`Temperature threshold for ${surgery.type}`}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-input"
                                                defaultValue={surgery.hysteresisHours}
                                                style={{ width: '70px', height: '36px' }}
                                                aria-label={`Hysteresis hours for ${surgery.type}`}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon"
                                                style={{ color: '#ef4444' }}
                                                aria-label={`Delete ${surgery.type} threshold`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        padding: '12px',
                        background: 'var(--alert-yellow-bg)',
                        borderRadius: '8px',
                        marginTop: '16px',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        <strong>Deduplication Policy:</strong> Yellow alerts require 2 consecutive abnormal readings
                        OR 6-hour persistence before triggering (configurable per surgery type).
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary">
                            <Plus size={16} aria-hidden="true" />
                            Add Surgery Type
                        </button>
                        <button className="btn btn-primary">
                            <Save size={16} aria-hidden="true" />
                            {t('common.save')}
                        </button>
                    </div>
                </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <div className="card" role="tabpanel">
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                        Notification Templates
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Critical Alert SMS (English)</label>
                        <textarea
                            className="form-input"
                            style={{ height: '80px', resize: 'none' }}
                            defaultValue="Hi {name}, this is {hospital}. We noticed some changes in your recovery. A nurse will call you now. If you have fever or wound discharge, please reply YES."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Critical Alert SMS (Hindi)</label>
                        <textarea
                            className="form-input"
                            style={{ height: '80px', resize: 'none' }}
                            defaultValue="Namaste {name}, hospital se {hospital}. Aapki halat mein badlav dekha gaya hai. Nurse call karegi. Bukhar ya ghaav se ras aa raha ho to YES bhejein."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Medication Reminder</label>
                        <textarea
                            className="form-input"
                            style={{ height: '60px', resize: 'none' }}
                            defaultValue="Hi {name}, remember to take your {medication}. Reply 1 if taken, 2 if not."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }}>
                            Reset to Default
                        </button>
                        <button className="btn btn-primary" style={{ flex: 1 }}>
                            <Save size={16} aria-hidden="true" />
                            Save Templates
                        </button>
                    </div>
                </div>
            )}

            {/* User Management */}
            {activeTab === 'users' && (
                <div className="card" role="tabpanel">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                            User Management
                        </h3>
                        <button className="btn btn-primary btn-sm">
                            <Plus size={16} aria-hidden="true" />
                            Add User
                        </button>
                    </div>

                    <div className="table-container" style={{ boxShadow: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Nurse Priya', email: 'priya@hospital.com', role: 'nurse' },
                                    { name: 'Nurse Rahul', email: 'rahul@hospital.com', role: 'nurse' },
                                    { name: 'Dr. Sharma', email: 'sharma@hospital.com', role: 'physician' },
                                    { name: 'Admin User', email: 'admin@hospital.com', role: 'admin' }
                                ].map((user, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                {user.name}
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <select
                                                className="form-input"
                                                defaultValue={user.role}
                                                style={{ height: '36px', width: 'auto' }}
                                                aria-label={`Role for ${user.name}`}
                                            >
                                                <option value="nurse">Nurse</option>
                                                <option value="physician">Physician</option>
                                                <option value="admin">Admin</option>
                                                <option value="auditor">Auditor</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-icon"
                                                style={{ color: '#ef4444' }}
                                                aria-label={`Delete user ${user.name}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Data Residency */}
            {activeTab === 'data' && (
                <div className="card" role="tabpanel">
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shield size={20} aria-hidden="true" />
                        Data Residency & Compliance
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Primary Data Region</label>
                        <select
                            className="form-input"
                            value={dataResidency}
                            onChange={(e) => setDataResidency(e.target.value)}
                        >
                            <option value="india">🇮🇳 {t('settings.residencyOptions.india')}</option>
                            <option value="eu">🇪🇺 {t('settings.residencyOptions.eu')}</option>
                            <option value="us">🇺🇸 {t('settings.residencyOptions.us')}</option>
                        </select>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                            All patient data will be stored in this region to comply with local regulations.
                        </p>
                    </div>

                    <div style={{
                        padding: '16px',
                        background: 'var(--alert-green-bg)',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ fontWeight: 600, color: '#16a34a', marginBottom: '8px' }}>
                            ✓ HIPAA Compliant
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            RecoverGuard follows HIPAA guidelines. This is Clinical Decision Support (CDS) —
                            no autonomous diagnosis. All alerts require nurse verification.
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Data Retention Period</label>
                        <select className="form-input" defaultValue="90">
                            <option value="30">30 days post-recovery</option>
                            <option value="90">90 days post-recovery</option>
                            <option value="180">180 days post-recovery</option>
                            <option value="365">1 year post-recovery</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Audit Log Retention</label>
                        <select className="form-input" defaultValue="7years">
                            <option value="3years">3 years</option>
                            <option value="5years">5 years</option>
                            <option value="7years">7 years</option>
                            <option value="permanent">Permanent</option>
                        </select>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                            Audit logs are append-only with periodic Merkle root notarization.
                        </p>
                    </div>

                    <button className="btn btn-primary">
                        <Save size={16} aria-hidden="true" />
                        Save Settings
                    </button>
                </div>
            )}
        </div>
    );
}
