import { User, Stethoscope, BarChart3 } from 'lucide-react';

type UserRole = 'patient' | 'nurse' | 'admin';

interface RoleSelectorProps {
    onSelectRole: (role: UserRole) => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
    const roles = [
        {
            id: 'patient' as UserRole,
            title: 'Patient',
            description: 'Track your recovery, log daily health data, and stay connected with your care team.',
            icon: User,
        },
        {
            id: 'nurse' as UserRole,
            title: 'Nurse (Triage)',
            description: 'Review patient alerts, take action on deviations, and manage your patient queue.',
            icon: Stethoscope,
        },
        {
            id: 'admin' as UserRole,
            title: 'Administrator',
            description: 'View analytics, manage patients, and configure system settings.',
            icon: BarChart3,
        },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    }}>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <path d="M24 4L6 12V24C6 33.94 13.8 43.18 24 46C34.2 43.18 42 33.94 42 24V12L24 4Z" fill="#6B5CE7" />
                            <path d="M21 28L17 24L15 26L21 32L33 20L31 18L21 28Z" fill="white" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px',
                    }}>
                        RecoverGuard AI
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '16px',
                    }}>
                        Recovery Intelligence Platform
                    </p>
                </div>

                {/* Role Selection */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}>
                    <h2 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '20px',
                        textAlign: 'center',
                        color: '#1F2937',
                    }}>
                        Select your role to continue
                    </h2>

                    <div className="role-selector">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                className="role-card"
                                onClick={() => onSelectRole(role.id)}
                                style={{ width: '100%', textAlign: 'left' }}
                            >
                                <div className="role-icon">
                                    <role.icon size={28} />
                                </div>
                                <div className="role-info">
                                    <h3>{role.title}</h3>
                                    <p>{role.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Demo notice */}
                <p style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    marginTop: '24px',
                }}>
                    Demo Mode - No login required
                </p>
            </div>
        </div>
    );
}
