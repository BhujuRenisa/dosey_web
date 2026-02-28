import { useNavigate, useLocation } from 'react-router-dom';
import { Pill, LayoutDashboard, BookOpen, History, User, Plus, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import '../pages/private/Home.css';

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out');
        navigate('/login');
    };

    const navLinks = [
        { path: '/home', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/medicines', label: 'My Meds', icon: BookOpen },
        { path: '/history', label: 'History', icon: History },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav
            className="navbar navbar-dark sticky-top"
            style={{
                backgroundColor: '#708238',
                boxShadow: '0 2px 16px rgba(112,130,56,0.3)',
                padding: '0.6rem 1.5rem',
                fontFamily: "'Quicksand', sans-serif",
            }}
        >
            {/* Logo */}
            <span
                className="navbar-brand fw-bold d-flex align-items-center gap-2"
                style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                onClick={() => navigate('/home')}
            >
                <div
                    className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '34px', height: '34px', flexShrink: 0 }}
                >
                    <Pill size={18} style={{ color: '#708238' }} />
                </div>
                Dosey
            </span>

            {/* Nav links — center */}
            <div className="d-none d-md-flex align-items-center gap-1 mx-auto">
                {navLinks.map(({ path, label, icon: Icon }) => {
                    const active = location.pathname === path;
                    return (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            style={{
                                background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '6px 14px',
                                fontWeight: active ? '700' : '600',
                                fontSize: '0.88rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontFamily: "'Quicksand', sans-serif",
                                cursor: 'pointer',
                                transition: '0.2s',
                            }}
                            onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                            onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Right side */}
            <div className="d-flex align-items-center gap-2 ms-auto ms-md-0">
                <button
                    onClick={() => navigate('/add-medication')}
                    style={{
                        background: '#e9edc9',
                        color: '#4B5320',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '7px 16px',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontFamily: "'Quicksand', sans-serif",
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <Plus size={15} /> Add Medicine
                </button>
                <button
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '7px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <LogOut size={16} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
