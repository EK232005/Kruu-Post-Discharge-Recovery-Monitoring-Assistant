import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Phone,
    MessageSquare,
    ArrowUpRight,
    XCircle,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Repeat
} from 'lucide-react';
import Sparkline from './Sparkline';
import type { Alert } from '../api/types';

interface AlertCardProps {
    alert: Alert;
    patientName: string;
    patientAge: number;
    surgeryType: string;
    onAction: (action: 'call' | 'message' | 'escalate' | 'dismiss') => void;
}

export default function AlertCard({
    alert,
    patientName,
    patientAge,
    surgeryType,
    onAction
}: AlertCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Generate sparkline data from metrics (mock 7-day data)
    const sparklineData = Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        value: alert.metrics[0]?.value ? Math.max(1, alert.metrics[0].value - (6 - i) * 0.3) : 3 + Math.random() * 2,
        expected: alert.metrics[0]?.baseline_mean || 3
    }));

    const severityConfig = {
        red: {
            icon: AlertCircle,
            bg: 'rgba(239, 68, 68, 0.08)',
            border: '#ef4444',
            label: t('alerts.severity.red'),
            color: '#ef4444'
        },
        yellow: {
            icon: AlertTriangle,
            bg: 'rgba(245, 158, 11, 0.08)',
            border: '#f59e0b',
            label: t('alerts.severity.yellow'),
            color: '#b45309' // Darker for WCAG
        },
        green: {
            icon: CheckCircle,
            bg: 'rgba(22, 163, 74, 0.08)',
            border: '#16a34a',
            label: t('alerts.severity.green'),
            color: '#16a34a'
        }
    };

    const { icon: SeverityIcon, bg, border, label: severityLabel, color: severityColor } = severityConfig[alert.severity];

    const formatMetric = (metric: typeof alert.metrics[0]) => {
        if (metric.baseline_mean !== undefined) {
            return `${metric.value} (${t('alerts.metrics.baseline')} ${metric.baseline_mean})`;
        }
        if (metric.expected !== undefined) {
            return `${metric.value} (${t('alerts.metrics.expected')} ${metric.expected})`;
        }
        return `${metric.value}`;
    };

    const handleCardClick = () => {
        navigate(`/patient/${alert.patient_id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <article
            className="card"
            style={{
                background: bg,
                borderLeft: `4px solid ${border}`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="article"
            aria-label={t('accessibility.alertCard', { name: patientName, severity: severityLabel })}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '16px' }}>
                        {patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                            {patientName}
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {patientAge}y • {surgeryType} • {t('alerts.daysPostDischarge', { days: Math.ceil((Date.now() - new Date(alert.timestamp).getTime()) / (1000 * 60 * 60 * 24)) + 3 })}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Repeat count */}
                    {alert.repeat_count > 1 && (
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 500
                        }}>
                            <Repeat size={12} aria-hidden="true" />
                            ×{alert.repeat_count}
                        </span>
                    )}

                    {/* Severity Badge */}
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        background: 'white',
                        border: `1px solid ${border}`,
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: severityColor
                    }}>
                        <SeverityIcon size={14} aria-hidden="true" />
                        {severityLabel}
                    </span>
                </div>
            </div>

            {/* Content Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: '16px',
                marginBottom: '12px'
            }}>
                {/* Sparkline */}
                <div>
                    <Sparkline
                        data={sparklineData}
                        color={border}
                        showExpected={true}
                    />
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
                        7-day trend
                    </p>
                </div>

                {/* Metrics */}
                <div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '8px'
                    }}>
                        {alert.metrics.slice(0, 3).map((metric, idx) => (
                            <span
                                key={idx}
                                style={{
                                    padding: '4px 8px',
                                    background: 'white',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <strong>{t(`alerts.metrics.${metric.name}`, metric.name)}:</strong> {formatMetric(metric)}
                            </span>
                        ))}
                    </div>

                    {/* Confidence */}
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <strong>{t('alerts.confidence')}:</strong> {Math.round(alert.confidence * 100)}% ± {Math.round((alert.confidence_interval || 0.1) * 100)}%
                    </p>
                </div>
            </div>

            {/* Reason */}
            <div style={{
                padding: '8px 12px',
                background: 'white',
                borderRadius: '6px',
                marginBottom: '12px',
                fontSize: '14px'
            }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Reason:</strong> {alert.reason}
            </div>

            {/* Actions */}
            <div
                style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onAction('call')}
                    aria-label={t('accessibility.callButton', { name: patientName })}
                >
                    <Phone size={14} aria-hidden="true" />
                    {t('alerts.actions.call')}
                </button>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onAction('message')}
                    aria-label={t('accessibility.messageButton', { name: patientName })}
                >
                    <MessageSquare size={14} aria-hidden="true" />
                    {t('alerts.actions.message')}
                </button>
                <button
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: '#ef4444', color: '#ef4444' }}
                    onClick={() => onAction('escalate')}
                    aria-label={t('accessibility.escalateButton')}
                >
                    <ArrowUpRight size={14} aria-hidden="true" />
                    {t('alerts.actions.escalate')}
                </button>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onAction('dismiss')}
                    aria-label={t('accessibility.dismissButton')}
                >
                    <XCircle size={14} aria-hidden="true" />
                    {t('alerts.actions.dismiss')}
                </button>
            </div>
        </article>
    );
}
