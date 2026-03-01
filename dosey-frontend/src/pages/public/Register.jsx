import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../../utils/api'

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false) // Added loading state

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const isPasswordTooShort =
    formData.password.length > 0 && formData.password.length < 6
  const isMatch =
    formData.password === formData.confirmPassword &&
    formData.password.length > 0

  // ✅ Added 'async' keyword here
  const handleRegister = async (e) => {
    e.preventDefault()

    // 1. Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true) // Start loading

    try {
      // 2. Call the Backend
      const res = await api.post('/auth/register', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.status === 201) {
        // 3. Success
        toast.success('Welcome to DoseyCare! Redirecting to login...', {
          duration: 2000,
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      // ✅ Added missing catch block
      console.error("Register Error:", error);
      const msg = error.response?.data?.message || 'Server connection failed. Is the backend running?';
      toast.error(msg);
    } finally {
      setLoading(false) // Stop loading
    }
  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center bg-light">
      <Toaster position="top-center" />

      <div className="container">
        <div className="row shadow-lg rounded overflow-hidden bg-white mx-auto" style={{ maxWidth: '900px' }}>

          {/* Left Branding */}
          <div className="col-md-5 bg-primary text-white p-5 d-none d-md-flex flex-column justify-content-center text-center">
            <h2 className="fw-bold mb-3">DoseyCare</h2>
            <p className="lead">Join the family and manage your health with ease.</p>
            <img src="/logo.png" alt="Mascot" className="img-fluid mt-4 mx-auto" style={{ maxWidth: '150px' }} />
          </div>

          {/* Right Form */}
          <div className="col-md-7 p-5">
            <h3 className="fw-bold mb-2">Create Account</h3>
            <p className="text-muted mb-4">Step into a healthier routine.</p>

            <form onSubmit={handleRegister} autoComplete="off">
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control bg-light"
                  placeholder="e.g. Lily"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  autoComplete="name-new"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-light"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoComplete="email-new"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-control bg-light ${isPasswordTooShort ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isPasswordTooShort && <div className="invalid-feedback d-block">Minimum 6 characters required</div>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-control bg-light ${formData.confirmPassword.length > 0 && !isMatch ? 'is-invalid' : isMatch ? 'is-valid' : ''}`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button className="btn btn-primary w-100 py-2 text-white fw-bold shadow-sm" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'Create Account →'}
              </button>
            </form>

            <p className="text-center mt-4 mb-0">
              Already have an account? <Link to="/login" className="fw-semibold text-primary text-decoration-none">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register