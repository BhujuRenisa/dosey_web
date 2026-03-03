import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetLink, setResetLink] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            toast.success('Reset link generated!');
            if (res.data.resetUrl) {
                setResetLink(res.data.resetUrl);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
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

    return (
        <div style={{ minHeight: '100vh', background: '#f2f4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Quicksand', sans-serif" }}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 10px 30px rgba(112,130,56,0.12)' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{ background: 'none', border: 'none', color: '#708238', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1.5rem', padding: 0 }}
                >
                    <ArrowLeft size={16} /> Back to Login
                </button>

                <h3 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '8px' }}>Forgot Password?</h3>
                <p style={{ color: '#8a9a5e', fontWeight: '500', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    No worries! Enter your email and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#a3b464' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            style={{ ...inputStyle, paddingLeft: '42px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(112,130,56,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' }}
                    >
                        {loading ? <span className="spinner-border spinner-border-sm" /> : <Send size={18} />}
                        Send Reset Link
                    </button>
                </form>

                {resetLink && (
                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f7f9f3', borderRadius: '14px', border: '1.5px dashed #708238' }}>
                        <p style={{ color: '#4B5320', fontWeight: '700', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase' }}>Simulated Email Link:</p>
                        <a href={resetLink} style={{ color: '#708238', fontWeight: '800', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                            {resetLink}
                        </a>
                        <p style={{ color: '#8a9a5e', fontSize: '0.75rem', marginTop: '8px' }}>Click this link to proceed to the reset page.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
