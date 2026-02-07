import { useTranslation } from 'react-i18next';
import { Mic, Camera, Check, X } from 'lucide-react';

interface ConsentBannerProps {
    voiceConsent: boolean;
    photoConsent: boolean;
    onRevokeVoice?: () => void;
    onRevokePhoto?: () => void;
}

export default function ConsentBanner({
    voiceConsent,
    photoConsent,
    onRevokeVoice,
    onRevokePhoto
}: ConsentBannerProps) {
    const { t } = useTranslation();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                marginBottom: '16px',
                flexWrap: 'wrap'
            }}
            role="region"
            aria-label={t('patient.consent.title')}
        >
            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)' }}>
                {t('patient.consent.title')}:
            </span>

            {/* Voice Consent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={16} aria-hidden="true" />
                <span style={{ fontSize: '14px' }}>{t('patient.consent.voice')}:</span>
                {voiceConsent ? (
                    <>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#16a34a',
                            fontWeight: 500
                        }}>
                            <Check size={14} aria-hidden="true" />
                            {t('patient.consent.granted')}
                        </span>
                        {onRevokeVoice && (
                            <button
                                onClick={onRevokeVoice}
                                className="btn btn-sm"
                                style={{
                                    padding: '2px 8px',
                                    fontSize: '12px',
                                    background: 'transparent',
                                    border: '1px solid var(--alert-red)',
                                    color: 'var(--alert-red)'
                                }}
                                aria-label={`${t('patient.consent.revoke')} ${t('patient.consent.voice')}`}
                            >
                                {t('patient.consent.revoke')}
                            </button>
                        )}
                    </>
                ) : (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--text-muted)'
                    }}>
                        <X size={14} aria-hidden="true" />
                        {t('patient.consent.notGranted')}
                    </span>
                )}
            </div>

            <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />

            {/* Photo Consent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={16} aria-hidden="true" />
                <span style={{ fontSize: '14px' }}>{t('patient.consent.photo')}:</span>
                {photoConsent ? (
                    <>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#16a34a',
                            fontWeight: 500
                        }}>
                            <Check size={14} aria-hidden="true" />
                            {t('patient.consent.granted')}
                        </span>
                        {onRevokePhoto && (
                            <button
                                onClick={onRevokePhoto}
                                className="btn btn-sm"
                                style={{
                                    padding: '2px 8px',
                                    fontSize: '12px',
                                    background: 'transparent',
                                    border: '1px solid var(--alert-red)',
                                    color: 'var(--alert-red)'
                                }}
                                aria-label={`${t('patient.consent.revoke')} ${t('patient.consent.photo')}`}
                            >
                                {t('patient.consent.revoke')}
                            </button>
                        )}
                    </>
                ) : (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--text-muted)'
                    }}>
                        <X size={14} aria-hidden="true" />
                        {t('patient.consent.notGranted')}
                    </span>
                )}
            </div>
        </div>
    );
}
