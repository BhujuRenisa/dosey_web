import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../../utils/api'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });
      const data = res.data;

      if (res.status === 200) {
        // ✅ Save token & user
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        toast.success(`Welcome back, ${data.user.fullName}!`, {
          duration: 2000,
        })

        setTimeout(() => navigate('/home'), 2000)
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch (error) {
      toast.error('Server error. Please try again.')
    }
  }


  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
      <Toaster position="top-center" />

      <div className="container">
        <div
          className="row shadow-lg rounded overflow-hidden bg-white mx-auto"
          style={{ maxWidth: '900px' }}
        >

          {/* LEFT BRAND PANEL — SAME AS REGISTER */}
          <div className="col-md-5 bg-primary text-white p-5 d-none d-md-flex flex-column justify-content-center">
            <h2 className="fw-bold mb-3">DoseyCare</h2>
            <p className="lead">
              Welcome back!!!
            </p>

            <img
              src="/logo.png"
              alt="Mascot"
              className="img-fluid mt-4 mx-auto"
              style={{ maxWidth: '140px' }}
            />


            <p className="lead">
              Ready to manage your health with a smile?
            </p>


          </div>

          {/* RIGHT LOGIN FORM */}
          <div className="col-md-7 p-5">
            <h3 className="fw-bold mb-2">Sign In</h3>
            <p className="text-muted mb-4">
              Enter your details to continue your routine.
            </p>

            <form onSubmit={handleLogin} autoComplete="off">
              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Mail size={18} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-light"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email-new"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-control bg-light"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password-new"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-end mb-4">
                <Link
                  to="/forgot-password"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Forgot Password?
                </Link>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm text-white">
                Sign In →
              </button>
            </form>

            <p className="text-center mt-4">
              New here?{' '}
              <Link
                to="/register"
                className="fw-semibold text-primary text-decoration-none"
              >
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
