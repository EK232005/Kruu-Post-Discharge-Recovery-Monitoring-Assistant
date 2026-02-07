import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Bell,
    ClipboardList,
    Settings,
    LogOut,
    Shield,
    Globe
} from 'lucide-react';

interface NurseLayoutProps {
    onLogout: () => void;
}

export default function NurseLayout({ onLogout }: NurseLayoutProps) {
    const { t, i18n } = useTranslation();

    const navItems = [
        { to: '/alerts', icon: Bell, label: t('nav.alerts') },
        { to: '/audit', icon: ClipboardList, label: t('nav.audit') },
        { to: '/settings', icon: Settings, label: t('nav.settings') },
    ];

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Shield size={32} color="var(--primary)" aria-hidden="true" />
                    <h1>{t('common.appName')}</h1>
                </div>

                <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={20} aria-hidden="true" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button
                        className="nav-item"
                        onClick={toggleLanguage}
                        style={{ width: '100%', marginBottom: '8px' }}
                        aria-label="Toggle language"
                    >
                        <Globe size={20} aria-hidden="true" />
                        {i18n.language === 'en' ? 'हिंदी' : 'English'}
                    </button>

                    <div className="nav-item" style={{ marginBottom: '8px' }}>
                        <div className="avatar">NP</div>
                        <div>
                            <p style={{ fontWeight: '500', fontSize: '14px' }}>{t('roles.nurse')} Priya</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Triage Lead</p>
                        </div>
                    </div>
                    <button
                        className="nav-item"
                        onClick={onLogout}
                        style={{ width: '100%' }}
                        aria-label={t('common.logout')}
                    >
                        <LogOut size={20} aria-hidden="true" />
                        {t('common.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content with-sidebar">
                <Outlet />
            </main>

            {/* Bottom Navigation for Mobile */}
            <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
                <div className="bottom-nav-items">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `bottom-nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={24} aria-hidden="true" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                    <button className="bottom-nav-item" onClick={onLogout}>
                        <LogOut size={24} aria-hidden="true" />
                        <span>{t('common.logout')}</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
