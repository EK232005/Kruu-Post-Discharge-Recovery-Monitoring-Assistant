import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Camera, Mic } from 'lucide-react';
import { medications } from '../../data/mockData';

export default function DailyDataEntry() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [painScore, setPainScore] = useState(5);
    const [temperature, setTemperature] = useState('98.6');
    const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');
    const [steps, setSteps] = useState('');
    const [medicationsTaken, setMedicationsTaken] = useState<Record<string, boolean>>(
        medications.reduce((acc, med) => ({ ...acc, [med.id]: med.taken }), {})
    );
    const [showSuccess, setShowSuccess] = useState(false);

    const painEmojis = ['😊', '🙂', '😐', '😕', '😣', '😖', '😫', '😰', '😭', '🤯', '💀'];

    const handleSubmit = () => {
        setShowSuccess(true);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    if (showSuccess) {
        return (
            <div className="animate-fadeIn" style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--alert-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                }}>
                    <Check size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Data Logged!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Your daily check-in has been recorded successfully.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <button
                    className="btn-icon"
                    onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '24px' }}>Daily Check-in</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Step {step} of 4</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="progress-steps">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`progress-step ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
                    />
                ))}
            </div>

            {/* Step 1: Pain */}
            {step === 1 && (
                <div className="card">
                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>How's your pain level?</h2>

                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <span style={{ fontSize: '64px' }}>{painEmojis[painScore]}</span>
                        <p style={{
                            fontSize: '48px',
                            fontWeight: '700',
                            color: painScore <= 3 ? 'var(--alert-green)' : painScore <= 6 ? 'var(--alert-yellow)' : 'var(--alert-red)',
                            marginTop: '8px'
                        }}>
                            {painScore}
                        </p>
                        <p style={{ color: 'var(--text-secondary)' }}>out of 10</p>
                    </div>

                    <div className="slider-container">
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={painScore}
                            onChange={(e) => setPainScore(parseInt(e.target.value))}
                            className="slider"
                        />
                    </div>

                    <div className="emoji-scale">
                        {painEmojis.slice(0, 11).map((emoji, i) => (
                            <span
                                key={i}
                                className={painScore === i ? 'active' : ''}
                                onClick={() => setPainScore(i)}
                                style={{ cursor: 'pointer' }}
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }} onClick={() => setStep(2)}>
                        Continue
                    </button>
                </div>
            )}

            {/* Step 2: Temperature & Steps */}
            {step === 2 && (
                <div className="card">
                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Vitals & Activity</h2>

                    {/* Temperature */}
                    <div className="form-group">
                        <label className="form-label">Body Temperature</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="number"
                                step="0.1"
                                value={temperature}
                                onChange={(e) => setTemperature(e.target.value)}
                                className="form-input"
                                style={{ flex: 1 }}
                                placeholder={tempUnit === 'F' ? '98.6' : '37.0'}
                            />
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                    className={`btn ${tempUnit === 'F' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setTempUnit('F')}
                                >
                                    °F
                                </button>
                                <button
                                    className={`btn ${tempUnit === 'C' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setTempUnit('C')}
                                >
                                    °C
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="form-group">
                        <label className="form-label">Steps Today</label>
                        <input
                            type="number"
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            className="form-input"
                            placeholder="Enter steps or sync from phone"
                        />
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                            💡 Tip: Walk at least 1000 steps today for optimal recovery
                        </p>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => setStep(3)}>
                        Continue
                    </button>
                </div>
            )}

            {/* Step 3: Medications */}
            {step === 3 && (
                <div className="card">
                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Medication Check</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        Mark the medications you've taken today:
                    </p>

                    {medications.map((med) => (
                        <div
                            key={med.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px',
                                background: medicationsTaken[med.id] ? 'var(--alert-green-bg)' : 'var(--bg-primary)',
                                borderRadius: '12px',
                                marginBottom: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => setMedicationsTaken({
                                ...medicationsTaken,
                                [med.id]: !medicationsTaken[med.id]
                            })}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                border: medicationsTaken[med.id] ? 'none' : '2px solid var(--border-color)',
                                background: medicationsTaken[med.id] ? 'var(--alert-green)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {medicationsTaken[med.id] && <Check size={16} color="white" />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '500' }}>{med.name}</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{med.frequency}</p>
                            </div>
                        </div>
                    ))}

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => setStep(4)}>
                        Continue
                    </button>
                </div>
            )}

            {/* Step 4: Optional (Photo/Voice) */}
            {step === 4 && (
                <div className="card">
                    <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Additional Info (Optional)</h2>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <button className="btn btn-secondary" style={{ flex: 1, height: '80px', flexDirection: 'column', gap: '8px' }}>
                            <Camera size={24} />
                            <span>Upload Wound Photo</span>
                        </button>
                        <button className="btn btn-secondary" style={{ flex: 1, height: '80px', flexDirection: 'column', gap: '8px' }}>
                            <Mic size={24} />
                            <span>Voice Note</span>
                        </button>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Any notes for your care team?</label>
                        <textarea
                            className="form-input"
                            style={{ height: '100px', resize: 'none', paddingTop: '12px' }}
                            placeholder="Optional: Describe how you're feeling..."
                        />
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleSubmit}>
                        Submit Check-in
                    </button>
                </div>
            )}
        </div>
    );
}
