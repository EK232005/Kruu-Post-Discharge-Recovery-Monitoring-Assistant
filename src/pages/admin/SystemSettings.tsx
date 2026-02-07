import { useState } from 'react';
import {
    Settings,
    Bell,
    Shield,
    Database,
    Users,
    Save,
    Plus,
    Trash2
} from 'lucide-react';

export default function SystemSettings() {
    const [activeTab, setActiveTab] = useState('alerts');

    const tabs = [
        { id: 'alerts', label: 'Alert Thresholds', icon: Bell },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'data', label: 'Data Residency', icon: Database },
    ];

    const surgeryTypes = [
        { type: 'TKR', painDelta: 2, stepsDelta: 40, tempThreshold: 100.4 },
        { type: 'CABG', painDelta: 3, stepsDelta: 50, tempThreshold: 100.0 },
        { type: 'Hernia', painDelta: 2, stepsDelta: 30, tempThreshold: 100.4 },
    ];

    const nurses = [
        { id: 1, name: 'Nurse Priya', email: 'priya@hospital.com', role: 'Triage Lead' },
        { id: 2, name: 'Nurse Rahul', email: 'rahul@hospital.com', role: 'Triage' },
        { id: 3, name: 'Nurse Anjali', email: 'anjali@hospital.com', role: 'Triage' },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Settings size={28} />
                    System Settings
                </h1>
                <p className="page-subtitle">Configure system behavior and preferences</p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                overflowX: 'auto',
                paddingBottom: '4px'
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Alert Thresholds */}
            {activeTab === 'alerts' && (
                <div className="card">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                        Alert Threshold Configuration
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Configure deviation thresholds by surgery type. Alerts trigger when actual values
                        exceed expected values by these amounts.
                    </p>

                    <div className="table-container" style={{ boxShadow: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Surgery Type</th>
                                    <th>Pain Delta (±)</th>
                                    <th>Steps Delta (%)</th>
                                    <th>Temp Threshold (°F)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {surgeryTypes.map((surgery, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: '500' }}>{surgery.type}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-input"
                                                defaultValue={surgery.painDelta}
                                                style={{ width: '80px', height: '36px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-input"
                                                defaultValue={surgery.stepsDelta}
                                                style={{ width: '80px', height: '36px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="form-input"
                                                defaultValue={surgery.tempThreshold}
                                                style={{ width: '100px', height: '36px' }}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn-icon" style={{ color: 'var(--alert-red)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                        <button className="btn btn-secondary">
                            <Plus size={16} />
                            Add Surgery Type
                        </button>
                        <button className="btn btn-primary">
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <div className="card">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                        Notification Templates
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Critical Alert SMS</label>
                        <textarea
                            className="form-input"
                            style={{ height: '80px', resize: 'none', paddingTop: '12px' }}
                            defaultValue="RecoverGuard Alert: {patient_name}'s recovery shows deviation. Nurse will contact you within 2 hours."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Medication Reminder SMS</label>
                        <textarea
                            className="form-input"
                            style={{ height: '80px', resize: 'none', paddingTop: '12px' }}
                            defaultValue="Hi {patient_name}, remember to take your {medication_name}. Reply 1 if taken, 2 if not."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Daily Check-in Reminder</label>
                        <textarea
                            className="form-input"
                            style={{ height: '80px', resize: 'none', paddingTop: '12px' }}
                            defaultValue="Hi {patient_name}! Time for your daily health check-in on RecoverGuard. Tap here: {app_link}"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }}>
                            Reset to Default
                        </button>
                        <button className="btn btn-primary" style={{ flex: 1 }}>
                            <Save size={16} />
                            Save Templates
                        </button>
                    </div>
                </div>
            )}

            {/* User Management */}
            {activeTab === 'users' && (
                <div className="card">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                            User Management
                        </h3>
                        <button className="btn btn-primary btn-sm">
                            <Plus size={16} />
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nurses.map((nurse) => (
                                    <tr key={nurse.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                    {nurse.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                {nurse.name}
                                            </div>
                                        </td>
                                        <td>{nurse.email}</td>
                                        <td>
                                            <select className="form-input" defaultValue={nurse.role} style={{ height: '36px', width: 'auto' }}>
                                                <option>Triage</option>
                                                <option>Triage Lead</option>
                                                <option>Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button className="btn-icon" style={{ color: 'var(--alert-red)' }}>
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
                <div className="card">
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                        <Shield size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        Data Residency & Compliance
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Primary Data Region</label>
                        <select className="form-input" defaultValue="india">
                            <option value="india">🇮🇳 India (Mumbai)</option>
                            <option value="eu">🇪🇺 European Union (Frankfurt)</option>
                            <option value="us">🇺🇸 United States (Virginia)</option>
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
                        <p style={{ fontWeight: '600', color: 'var(--alert-green)', marginBottom: '8px' }}>
                            ✓ HIPAA Compliant
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            RecoverGuard follows HIPAA guidelines for protected health information storage and transmission.
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

                    <button className="btn btn-primary">
                        <Save size={16} />
                        Save Settings
                    </button>
                </div>
            )}
        </div>
    );
}
