import React, { useState } from 'react';
import { Lock, Save, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Token is invalid or expired');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 14px',
        border: '1.5px solid #d5ddc8',
        borderRadius: '12px',
        fontSize: '0.95rem',
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: '600',
        background: '#fafaf7',
        outline: 'none',
        marginBottom: '1rem'
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', background: '#f2f4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Quicksand', sans-serif" }}>
                <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 10px 30px rgba(112,130,56,0.12)', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#f0fdf4', color: '#15803d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <CheckCircle size={32} />
                    </div>
                    <h3 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '10px' }}>Password Reset!</h3>
                    <p style={{ color: '#8a9a5e', fontWeight: '500', marginBottom: '2rem' }}>
                        Your password has been successfully updated. Redirecting you to the login page...
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ width: '100%', padding: '12px', background: '#708238', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                    >
                        Login Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f2f4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Quicksand', sans-serif" }}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 10px 30px rgba(112,130,56,0.12)' }}>
                <h3 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '8px' }}>Reset Password</h3>
                <p style={{ color: '#8a9a5e', fontWeight: '500', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    Please enter a new secure password for your account.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#a3b464' }} />
                        <input
                            type="password"
                            placeholder="New Password"
                            style={{ ...inputStyle, paddingLeft: '42px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#a3b464' }} />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            style={{ ...inputStyle, paddingLeft: '42px' }}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(112,130,56,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {loading ? <span className="spinner-border spinner-border-sm" /> : <Save size={18} />}
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
