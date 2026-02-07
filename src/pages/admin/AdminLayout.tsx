import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Bell,
    Shield
} from 'lucide-react';

interface AdminLayoutProps {
    onLogout: () => void;
}

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Analytics' },
        { to: '/patients', icon: Users, label: 'Patients' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Shield size={32} color="var(--primary)" />
                    <h1>RecoverGuard</h1>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div className="nav-item" style={{ marginBottom: '8px' }}>
                        <div className="avatar">AD</div>
                        <div>
                            <p style={{ fontWeight: '500', fontSize: '14px' }}>Admin</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>System Admin</p>
                        </div>
                    </div>
                    <button className="nav-item" onClick={onLogout} style={{ width: '100%' }}>
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content with-sidebar">
                {/* Top Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <button className="btn-icon" style={{ position: 'relative' }}>
                        <Bell size={20} />
                    </button>
                </div>

                <Outlet />
            </main>

            {/* Bottom Navigation for Mobile */}
            <nav className="bottom-nav">
                <div className="bottom-nav-items">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `bottom-nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={24} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                    <button className="bottom-nav-item" onClick={onLogout}>
                        <LogOut size={24} />
                        <span>Exit</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
