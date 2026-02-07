import { Bell, AlertTriangle, MessageCircle, Calendar, ChevronRight } from 'lucide-react';
import { patientNotifications } from '../../data/mockData';

export default function PatientAlerts() {
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return `${minutes}m ago`;
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return AlertTriangle;
            case 'message': return MessageCircle;
            case 'reminder': return Calendar;
            default: return Bell;
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'red':
                return { bg: 'var(--alert-red-bg)', color: 'var(--alert-red)' };
            case 'yellow':
                return { bg: 'var(--alert-yellow-bg)', color: 'var(--alert-yellow)' };
            default:
                return { bg: 'var(--alert-green-bg)', color: 'var(--alert-green)' };
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bell size={24} />
                    Notifications
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Stay updated on your recovery journey
                </p>
            </div>

            {/* Active Alert Banner */}
            <div style={{
                background: 'var(--alert-yellow-bg)',
                border: '1px solid var(--alert-yellow)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'var(--alert-yellow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0
                    }}>
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            Recovery Deviation Detected
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Your recovery shows a small deviation. Nurse Priya will review and contact you within 2 hours.
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {patientNotifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    const style = getPriorityStyle(notification.priority);

                    return (
                        <div key={notification.id} className="card" style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px',
                            padding: '16px',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: style.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: style.color,
                                flexShrink: 0
                            }}>
                                <Icon size={22} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontWeight: '500',
                                    color: 'var(--text-primary)',
                                    marginBottom: '4px',
                                    lineHeight: 1.4
                                }}>
                                    {notification.message}
                                </p>
                                <p style={{
                                    fontSize: '13px',
                                    color: 'var(--text-muted)'
                                }}>
                                    {formatTime(notification.timestamp)}
                                </p>
                            </div>
                            <ChevronRight size={20} color="var(--text-muted)" />
                        </div>
                    );
                })}
            </div>

            {/* Empty State - for when there are no notifications */}
            {patientNotifications.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '48px 24px',
                    color: 'var(--text-muted)'
                }}>
                    <Bell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontWeight: '500', marginBottom: '8px' }}>No notifications</p>
                    <p style={{ fontSize: '14px' }}>You're all caught up!</p>
                </div>
            )}

            {/* Nurse Message Card */}
            <div style={{ marginTop: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Messages from Care Team</h2>
                <div className="card" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '18px' }}>👩‍⚕️</span>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Nurse Priya</p>
                            <p style={{ fontSize: '12px', opacity: 0.8 }}>2 hours ago</p>
                        </div>
                    </div>
                    <p style={{ fontSize: '15px', lineHeight: 1.6, opacity: 0.95 }}>
                        "Hi Rajesh, I see your pain has increased. Please ensure you're taking your medications on time.
                        I'll call you this afternoon to check in. Keep up the good work with your exercises! 💪"
                    </p>
                    <button style={{
                        marginTop: '16px',
                        padding: '10px 20px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '500',
                        cursor: 'pointer',
                        width: '100%'
                    }}>
                        Reply to Nurse
                    </button>
                </div>
            </div>
        </div>
    );
}
