import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; 
import './Register.css';

const Register = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const isPasswordTooShort = formData.password.length > 0 && formData.password.length < 6;
  const isMatch = formData.password === formData.confirmPassword && formData.password.length > 0;

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. Validation Checks
    if (!formData.fullName || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // 2. Success Logic
    toast.success('Welcome to DoseyCare! Redirecting to login...', {
      duration: 2000,
      style: {
        borderRadius: '12px',
        background: '#4B5320',
        color: '#fff',
      },
    });

    // 3. Delayed Redirect
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="register-page">
      <Toaster position="top-center" />
      
      <div className="register-container">
        {/* Left Side: Branding */}
        <div className="register-info">
          <div className="register-brand">
            <img src="/logo.png" alt="Logo" className="brand-icon" />
            <span>DoseyCare</span>
          </div>
          <div className="mascot-section">
            <img src="/logo.png" alt="Mascot" className="register-mascot" />
            <h2>Join the family!</h2>
            <p>Start managing your health with a smile today.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="register-form-section">
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Step into a healthier routine.</p>
          </div>

          <form className="cute-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Lily" 
                className="standard-input"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="standard-input"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={isPasswordTooShort ? 'input-error' : ''}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {isPasswordTooShort && <p className="error-text">Min. 6 characters required</p>}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={formData.confirmPassword.length > 0 && !isMatch ? 'input-error' : isMatch ? 'input-success' : ''}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div className="status-icon">
                  {isMatch ? <CheckCircle2 size={18} color="#708238" /> : 
                   (formData.confirmPassword.length > 0 && !isMatch) ? <AlertCircle size={18} color="#d9534f" /> : null}
                </div>
              </div>
            </div>

            <button type="submit" className="btn-register">
              Create Account →
            </button>
          </form>

          <p className="login-prompt">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;