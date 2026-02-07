import { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    Download,
    Send,
    ChevronRight,
    Users
} from 'lucide-react';
import { patients } from '../../data/mockData';

export default function PatientManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.surgeryType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getTierBadge = (tier: number) => {
        const styles = {
            1: { bg: 'var(--alert-green-bg)', color: 'var(--alert-green)' },
            2: { bg: 'var(--alert-yellow-bg)', color: 'var(--alert-yellow)' },
            3: { bg: 'var(--alert-red-bg)', color: 'var(--alert-red)' },
        };
        return styles[tier as keyof typeof styles] || styles[1];
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Users size={28} />
                        Patient Management
                    </h1>
                    <p className="page-subtitle">Manage and monitor all patients</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Patient
                </button>
            </div>

            {/* Search & Actions */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }}
                    />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '48px' }}
                    />
                </div>
                <button className="btn btn-secondary">
                    <Filter size={18} />
                    Filters
                </button>
                <button className="btn btn-secondary">
                    <Download size={18} />
                    Export
                </button>
                <button className="btn btn-secondary">
                    <Send size={18} />
                    Broadcast
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-4" style={{ marginBottom: '24px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)' }}>
                        {patients.length}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Patients</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--alert-green)' }}>
                        {patients.filter(p => p.status === 'green').length}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>On Track</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--alert-yellow)' }}>
                        {patients.filter(p => p.status === 'yellow').length}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Needs Attention</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--alert-red)' }}>
                        {patients.filter(p => p.status === 'red').length}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Critical</p>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Surgery Type</th>
                            <th>Discharge Date</th>
                            <th>Risk Tier</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="avatar">
                                            {patient.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '500' }}>{patient.name}</p>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{patient.age} years</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{patient.surgeryType}</td>
                                <td>{formatDate(patient.dischargeDate)}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        ...getTierBadge(patient.tier)
                                    }}>
                                        Tier {patient.tier}
                                    </span>
                                </td>
                                <td>
                                    <div className={`alert-badge ${patient.status}`}>
                                        <span className={`alert-dot ${patient.status}`} />
                                        {patient.status === 'green' ? 'On Track' :
                                            patient.status === 'yellow' ? 'Attention' : 'Critical'}
                                    </div>
                                </td>
                                <td>
                                    <button className="btn-icon">
                                        <ChevronRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Patient Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '24px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '24px'
                    }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Add New Patient</h2>

                        <div className="form-group">
                            <label className="form-label">Patient Name</label>
                            <input type="text" className="form-input" placeholder="Full name" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Age</label>
                                <input type="number" className="form-input" placeholder="Age" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input type="tel" className="form-input" placeholder="+91" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Surgery Type</label>
                            <select className="form-input">
                                <option>Select surgery type</option>
                                <option>TKR (Total Knee Replacement)</option>
                                <option>CABG (Coronary Bypass)</option>
                                <option>Hernia Repair</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Risk Tier</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[1, 2, 3].map(tier => (
                                    <button
                                        key={tier}
                                        className="btn btn-secondary"
                                        style={{
                                            flex: 1,
                                            ...getTierBadge(tier)
                                        }}
                                    >
                                        Tier {tier}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Discharge Date</label>
                            <input type="date" className="form-input" />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={() => setShowAddModal(false)}
                            >
                                Add Patient
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
