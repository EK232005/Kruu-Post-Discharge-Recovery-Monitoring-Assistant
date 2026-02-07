import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface RecoveryStatusBadgeProps {
    status: 'on_track' | 'deviated' | 'critical';
    size?: 'sm' | 'md' | 'lg';
}

export default function RecoveryStatusBadge({ status, size = 'md' }: RecoveryStatusBadgeProps) {
    const { t } = useTranslation();

    const config = {
        on_track: {
            label: t('patient.status.onTrack'),
            icon: CheckCircle,
            bg: 'var(--alert-green-bg)',
            color: '#16a34a', // WCAG compliant green
            borderColor: '#16a34a'
        },
        deviated: {
            label: t('patient.status.deviated'),
            icon: AlertTriangle,
            bg: 'var(--alert-yellow-bg)',
            color: '#b45309', // Darker yellow for WCAG contrast
            borderColor: '#f59e0b'
        },
        critical: {
            label: t('patient.status.critical'),
            icon: XCircle,
            bg: 'var(--alert-red-bg)',
            color: '#ef4444',
            borderColor: '#ef4444'
        }
    };

    const { label, icon: Icon, bg, color, borderColor } = config[status];

    const sizeStyles = {
        sm: { padding: '4px 8px', fontSize: '12px', iconSize: 14 },
        md: { padding: '6px 12px', fontSize: '14px', iconSize: 18 },
        lg: { padding: '8px 16px', fontSize: '16px', iconSize: 20 }
    };

    const { padding, fontSize, iconSize } = sizeStyles[size];

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding,
                background: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: '20px',
                fontSize,
                fontWeight: 600,
                color
            }}
            role="status"
            aria-label={`Recovery status: ${label}`}
        >
            <Icon size={iconSize} aria-hidden="true" />
            <span>{label}</span>
        </div>
    );
}
