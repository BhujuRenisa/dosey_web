import { Link } from 'react-router-dom';
import { Pill, Bell, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', fontFamily: "'Quicksand', sans-serif", color: '#3a4a1e' }}>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top py-3" style={{ borderBottom: '1.2px solid #f0f2eb' }}>
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2" style={{ fontWeight: '800', color: '#708238', fontSize: '1.5rem' }}>
            <div style={{ background: '#708238', color: '#fff', padding: '6px', borderRadius: '10px' }}>
              <Pill size={24} />
            </div>
            DoseyCare
          </Link>
          <div className="d-flex gap-3">
            <Link to="/login" className="btn btn-link text-decoration-none fw-bold" style={{ color: '#708238' }}>Login</Link>
            <Link to="/register" className="btn px-4 fw-bold" style={{ background: '#708238', color: '#fff', borderRadius: '12px' }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-5 py-md-5 overflow-hidden">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge mb-3 px-3 py-2" style={{ background: '#f2f4ef', color: '#708238', borderRadius: '30px', fontWeight: '700', fontSize: '0.85rem' }}>
                Your Health, Simplified
              </span>
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#3a4a1e', lineHeight: '1.2' }}>
                Manage Your Medications <span style={{ color: '#708238' }}>With Confidence.</span>
              </h1>
              <p className="lead mb-5 text-muted" style={{ fontWeight: '500' }}>
                Never miss a dose again. DoseyCare tracks your medications, sends smart reminders, and keeps your health records safe and organized.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-lg px-4 py-3 fw-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', borderRadius: '16px' }}>
                  Start Your Journey <ArrowRight size={20} className="ms-2" />
                </Link>
              </div>
            </div>
            <div className="col-lg-6 position-relative">
              <div className="position-relative z-1">
                <div className="card border-0 shadow-lg p-3" style={{ borderRadius: '30px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
                  <img src="/logo.png" alt="App Preview" className="img-fluid rounded-4 shadow-sm" style={{ maxHeight: '450px', objectFit: 'contain' }} />
                </div>
              </div>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: '#70823820', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />
              <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', background: '#a3b46420', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container py-5 text-center">
          <h2 className="fw-bold mb-2">Everything You Need</h2>
          <p className="text-muted mb-5">Features designed to make medication management effortless.</p>
          <div className="row g-4 mt-2">
            {[
              { title: 'Smart Reminders', icon: Bell, text: 'Customized alerts for every dose, ensuring you stay on track.', color: '#708238' },
              { title: 'Secure Vault', icon: Shield, text: 'Your health data is encrypted and protected at all times.', color: '#a3b464' },
              { title: 'Progress Tracking', icon: CheckCircle, text: 'Visualize your adherence and health improvements over time.', color: '#4B5320' },
              { title: 'Refill Alerts', icon: Pill, text: 'Get notified when it\'s time to restock your medicine cabinet.', color: '#8a9a5e' }
            ].map((feature, idx) => (
              <div key={idx} className="col-md-3">
                <div className="card h-100 border-0 p-4 shadow-sm hover-up" style={{ borderRadius: '24px', transition: '0.3s' }}>
                  <div className="mb-4 mx-auto" style={{ width: '60px', height: '60px', borderRadius: '18px', background: `${feature.color}15`, color: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <feature.icon size={28} />
                  </div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted small mb-0">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img src="/logo.png" alt="Steps" className="img-fluid" style={{ maxWidth: '400px' }} />
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">How DoseyCare Works</h2>
              <div className="d-flex flex-column gap-4">
                {[
                  { step: '01', title: 'Add Your Medications', text: 'Simply enter the name, dosage, and schedule of your meds.' },
                  { step: '02', title: 'Set Custom Alarms', text: 'Receive notifications on your device at exact times.' },
                  { step: '03', title: 'Track Your Health', text: 'Log each dose and monitor your supplies automatically.' }
                ].map((item, idx) => (
                  <div key={idx} className="d-flex gap-4">
                    <div className="fw-bold" style={{ fontSize: '2rem', color: '#d5ddc8', lineHeight: '1' }}>{item.step}</div>
                    <div>
                      <h5 className="fw-bold mb-1">{item.title}</h5>
                      <p className="text-muted mb-0">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          .hover-up:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(112,130,56,0.1) !important;
          }
        `}
      </style>
    </div>
  );
};

export default Landing;