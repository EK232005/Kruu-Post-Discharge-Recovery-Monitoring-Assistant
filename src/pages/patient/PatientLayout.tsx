import { Outlet, NavLink } from 'react-router-dom';
import { Home, PlusCircle, TrendingUp, Bell, LogOut } from 'lucide-react';

interface PatientLayoutProps {
    onLogout: () => void;
}

export default function PatientLayout({ onLogout }: PatientLayoutProps) {
    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/log-data', icon: PlusCircle, label: 'Log' },
        { to: '/timeline', icon: TrendingUp, label: 'Timeline' },
        { to: '/alerts', icon: Bell, label: 'Alerts' },
    ];

    return (
        <div className="app-container" style={{ flexDirection: 'column' }}>
            {/* Main Content */}
            <main className="main-content" style={{
                paddingBottom: '100px',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav" style={{ display: 'block' }}>
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
